import { set } from 'lodash-es'
import { PRODUCTION } from '~/index'

export const devApiHost = 'http://localhost:3000'
export const prodApiHost = 'https://api.nicofinder.net'

/**
 * Nicofinder API Client
 * @param options
 * @param useProd
 */
export function nicofinderAPI(
  options: {
    path: string
    request: RequestInit
    json: boolean
  },
  useProd = false
): Promise<any> {
  const defaultRequest: RequestInit = {
    mode: 'cors',
  }

  if (options.json) {
    set(defaultRequest, 'headers[Content-Type]', 'application/json')
  }

  const host =
    !PRODUCTION && !useProd && !window.useProductionAPI
      ? devApiHost
      : prodApiHost
  const url = host.concat(options.path)
  const fetchOptions = { ...defaultRequest, ...options.request }

  return fetch(url, fetchOptions)
    .then((res) => {
      if (!res.ok) {
        return { status: false }
      }

      return res.json()
    })
    .catch((err) => {
      if (useProd === false) {
        return nicofinderAPI(options, true)
      } else {
        return err
      }
    })
}
