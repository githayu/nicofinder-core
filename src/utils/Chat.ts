import { nth } from 'lodash-es'

export interface ChatProps {
  no?: number
  mail: string
  thread: number
  vpos: number
  date: number
  user_id: number
  premium: number
  anonymity: number
  score?: number
  deleted?: number
  content: string
  leaf?: number
}

const commandSizes = ['big', 'medium', 'small']
const commandPositions = ['ue', 'naka', 'shita']
const commandColors: { [key: string]: string } = {
  white: '#fff',
  red: '#f00',
  pink: '#f88',
  orange: '#fc0',
  yellow: '#ff0',
  green: '#0f0',
  cyan: '#0ff',
  blue: '#00f',
  purple: '#c0f',
  black: '#000',
  white2: '#cc9',
  niconicowhite: '#cc9',
  red2: '#c03',
  truered: '#c03',
  pink2: '#f3c',
  orange2: '#f60',
  passionnrange: '#f60',
  yellow2: '#990',
  madyellow: '#990',
  green2: '#0c6',
  elementalgreen: '#0c6',
  cyan2: '#0cc',
  blue2: '#39f',
  marineblue: '#39f',
  purple2: '#63c',
  nobleviolet: '#63c',
  black2: '#666',
}

export default class Chat {
  context: ChatProps

  constructor(chat: ChatProps) {
    this.context = chat
  }

  get isDeleted() {
    if (this.context.hasOwnProperty('deleted')) {
      return this.context.deleted
    } else {
      return 0
    }
  }

  get isAdminDeleted() {
    return this.isDeleted === 2
  }

  get isOwnerDeleted() {
    return this.isDeleted === 1
  }

  get isOwnerNG() {
    return this.isDeleted === 1000
  }

  get isAnonymity() {
    return (
      this.context.hasOwnProperty('anonymity') && this.context.anonymity === 1
    )
  }

  get isPremium() {
    return this.context.premium === 1
  }

  get id() {
    return [this.context.thread, this.context.no].join('-')
  }

  get comment() {
    if (this.context.hasOwnProperty('content')) {
      return this.context.content
    } else {
      return ''
    }
  }

  get commentArray() {
    if (this.context.hasOwnProperty('content')) {
      return this.comment.split(/\n/)
    } else {
      return []
    }
  }

  get command() {
    if (this.context.hasOwnProperty('mail')) {
      return this.context.mail
    } else {
      return ''
    }
  }

  get commandArray() {
    if (this.context.hasOwnProperty('mail')) {
      return this.command.split(/\s/)
    } else {
      return []
    }
  }

  get color() {
    let color = '#fff'

    const colorName = Object.keys(commandColors).find((name) =>
      this.command.includes(name)
    )

    if (colorName) {
      color = commandColors[colorName]
    } else {
      for (const command of this.commandArray) {
        if (/^#\w{6}$/.test(command)) {
          color = command
          break
        }
      }
    }

    return color
  }

  get score() {
    return this.context.hasOwnProperty('score') ? this.context.score : 0
  }

  get date() {
    if (this.context.hasOwnProperty('date')) {
      return new Date(this.context.date * 1000)
    } else {
      return null
    }
  }

  get userId() {
    if (this.context.hasOwnProperty('user_id')) {
      return this.context.user_id
    } else {
      return null
    }
  }

  get size() {
    return commandSizes.find((size) => this.command.includes(size)) || 'medium'
  }

  get cpos() {
    return (
      commandPositions.find((cpos) => this.command.includes(cpos)) || 'naka'
    )
  }

  get vpos() {
    return this.context.hasOwnProperty('vpos') ? this.context.vpos : null
  }

  get leaf() {
    return this.context.hasOwnProperty('leaf') ? this.context.leaf : 0
  }

  get device() {
    for (const cmd of this.commandArray) {
      const device = nth(cmd.match(/^device:(\w+)$/), 1)

      if (device) {
        return device
      } else {
        switch (cmd) {
          case 'iphone':
            return 'iPhone'
          case 'docomo':
            return 'Docomo'
        }
      }
    }

    return 'PC'
  }
}
