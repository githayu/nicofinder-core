import * as Cookies from 'js-cookie'
import { generateUUID, LocalStorage } from './'

export function initPlayListQueue() {
  // ストレージ
  const playListQueue = new LocalStorage('nicofinder_playListQueue')
  const playListSessionId = Cookies.get('nicofinder_playListSession')

  // セッション管理
  const isEmptyStorageSession = playListQueue.store.sessionId.length === 0
  const isEmptyCookieSession = typeof playListSessionId === 'undefined'
  const isEqualSession = playListQueue.store.sessionId === playListSessionId
  const isRegenerateStorage =
    isEmptyStorageSession || isEmptyCookieSession || !isEqualSession

  if (isRegenerateStorage) {
    const sessionId = generateUUID()

    playListQueue.update({
      sessionId,
      items: new Array(),
    })

    Cookies.set('nicofinder_playListSession', sessionId, {
      domain: 'nicofinder.net',
    })
  }

  return playListQueue
}
