import { camelCase, isObjectLike, transform } from 'lodash-es'

export function decodeHTMLEnteties(str: string) {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = str
  return textArea.value
}

export function snakeToCamel(str: string) {
  return str.replace(/_(.)/g, (match, under) => under.toUpperCase())
}

export function firstUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function removeHTMLString(str: string) {
  return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
}

export function generateUUID() {
  let uuid = ''

  for (let i = 0; i < 32; i++) {
    // tslint:disable-next-line : no-bitwise
    const random = (Math.random() * 16) | 0

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }

    // tslint:disable-next-line : no-bitwise
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }

  return uuid
}

export function convertObjectToCamelCase(object: {}) {
  return transform(object, (result, value, key) => {
    const nextKey = camelCase(key)

    result[nextKey] = isObjectLike(value)
      ? convertObjectToCamelCase(value)
      : value
  })
}
