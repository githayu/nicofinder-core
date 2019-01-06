import { isArray, isEqual, isPlainObject } from 'lodash-es'

const STORAGE: {
  [key: string]: {
    storage: string
    value: {
      [key: string]: any
    }
  }
} = {
  nicofinder: {
    storage: 'localStorage',
    value: {
      searchMode: 'default',
    },
  },
  nicofinder_searchOptions: {
    storage: 'localStorage',
    value: {
      viewType: 'row',
    },
  },
  nicofinder_playListQueue: {
    storage: 'localStorage',
    value: {
      items: [],
      sessionId: '',
    },
  },
  nicofinder_videoHistory: {
    storage: 'localStorage',
    value: {
      items: [],
    },
  },
  nicofinder_commentOptions: {
    storage: 'localStorage',
    value: {
      columnWidth: [],
      fetchMode: 'default',
      isHighlightUser: true,
    },
  },
}

export default class LocalStorage {
  name: string

  constructor(name: string) {
    if (STORAGE.hasOwnProperty(name)) {
      this.name = name
    } else {
      return null
    }
  }

  get storage() {
    switch (this.defaultStore.storage) {
      case 'localStorage':
        return window.localStorage

      case 'sessionStorage':
        return window.sessionStorage
    }
  }

  get defaultStore() {
    return STORAGE[this.name]
  }

  get store() {
    const storage = this.storage.getItem(this.name)

    // 初期化
    if (storage === null) {
      return this.create()
    } else {
      if (isPlainObject(this.defaultStore.value)) {
        return this.validate(storage) ? JSON.parse(storage) : this.create()
      } else if (isArray(this.defaultStore.value)) {
        return JSON.parse(storage)
      } else {
        return storage
      }
    }
  }

  validate(storage: string) {
    const defaultKey = Object.keys(this.defaultStore.value)
    const currentKey = Object.keys(JSON.parse(storage))

    return isEqual(defaultKey, currentKey)
  }

  create() {
    this.set(this.defaultStore.value)

    return JSON.parse(this.storage.getItem(this.name))
  }

  remove() {
    this.storage.removeItem(this.name)
  }

  clear() {
    this.storage.clear()
  }

  update(newValues: any) {
    if (isPlainObject(newValues)) {
      newValues = JSON.stringify({ ...this.store, ...newValues })
    } else if (isArray(newValues)) {
      newValues = JSON.stringify(newValues)
    }

    this.storage.setItem(this.name, newValues)
  }

  set(newValues: any) {
    this.storage.setItem(this.name, JSON.stringify(newValues))
  }
}
