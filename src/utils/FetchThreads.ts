import { get, has, set } from 'lodash-es'

interface FetchThreadRequest {
  defaultThreadId?: string
  communityThreadId?: string
  nicosThreadId?: string
  needsKey?: number
  threadKey?: string
  force184?: number
  language: number
  nicoru: number
  scores: number
  videoDuration: number
  isPlayer?: boolean
  isOwnerThread: boolean
}

export default class FetchThreads {
  static messageServer = 'https://nmsg.nicovideo.jp/api.json/'
  static defaultQuery = {
    language: 0,
    nicoru: 0,
    scores: 1,
  }

  req: FetchThreadRequest

  constructor(request: FetchThreadRequest) {
    const {
      defaultThreadId,
      communityThreadId,
      nicosThreadId,
      needsKey,
      threadKey,
      force184,
      language,
      nicoru,
      scores,
      videoDuration,
      isPlayer,
      isOwnerThread,
    } = { ...FetchThreads.defaultQuery, ...request }

    this.req = {
      isPlayer: isPlayer || false,
      isOwnerThread: isOwnerThread || false,
      defaultThreadId,
      communityThreadId,
      nicosThreadId,
      needsKey,
      threadKey,
      force184,
      language,
      nicoru,
      scores,
      videoDuration,
    }
  }

  async execute() {
    if (this.req.isPlayer) {
      window.Player.logger.add(
        window.Player.state.ui.system_message.comment.server_connect,
        {
          defaultThreadId: this.req.defaultThreadId,
          communityThreadId: this.req.communityThreadId || null,
          nicosThreadId: this.req.nicosThreadId || null,
          needsKey: Boolean(this.req.needsKey),
          threadKey: this.req.threadKey || null,
          force184: this.req.force184 || null,
          language: this.req.language,
          nicoru: this.req.nicoru,
          scores: this.req.scores,
        }
      )
    }

    const packet = this.createPacket()
    const result = await this.fetchThreads(packet)

    return result
  }

  createPacket() {
    const {
      isPlayer,
      defaultThreadId,
      isOwnerThread,
      communityThreadId,
      nicosThreadId,
      needsKey,
    } = this.req
    let packet = []

    if (this.hasDefaultThread) {
      if (isPlayer) {
        packet.push(
          this.createThread({
            thread: defaultThreadId,
          })
        )
        packet.push(
          this.createThreadLeaves({
            thread: defaultThreadId,
          })
        )
      } else if (isOwnerThread) {
        packet.push(
          this.createThread({
            thread: defaultThreadId,
            fork: 1,
            res_from: -1000,
          })
        )
      } else {
        packet.push(
          this.createThread({
            thread: defaultThreadId,
            res_from: -1000,
          })
        )
      }
    }

    if (this.hasCommunityThread) {
      if (isPlayer) {
        packet.push(
          this.createThread({
            thread: communityThreadId,
          })
        )
        packet.push(
          this.createThreadLeaves({
            thread: communityThreadId,
          })
        )
      } else {
        packet.push(
          this.createThread({
            thread: communityThreadId,
            res_from: -1000,
          })
        )
      }
    }

    if (this.hasNicosThread) {
      if (isPlayer) {
        packet.push(
          this.createThread({
            thread: nicosThreadId,
          })
        )
        packet.push(
          this.createThreadLeaves({
            thread: nicosThreadId,
          })
        )
      } else {
        packet.push(
          this.createThread({
            thread: nicosThreadId,
            res_from: -1000,
          })
        )
      }
    }

    if (needsKey) {
      const { threadKey, force184 } = this.req

      packet = packet.map((query) =>
        Object.entries(query).reduce<{
          [x: string]: { [x: string]: string | number }
        }>((result, [key, value]) => {
          result[key] = {
            ...value,
            threadkey: threadKey,
            force_184: force184,
          }

          return result
        }, {})
      )
    }

    return packet
  }

  async fetchThreads(
    packet: Array<{
      [x: number]: any
    }>
  ) {
    const request = new Request(FetchThreads.messageServer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packet),
    })

    const response = await fetch(request)

    if (!response.ok) {
      return Promise.reject(new Error('Fetch thread error'))
    }

    const packetResult = await response.json()

    return Promise.resolve(this.formatPacket(packetResult))
  }

  createThread(options: { [x: string]: string | number }) {
    const request = {
      with_global: 1,
      version: 20090904,
      ...options,
    }

    return this.createPacketItem('thread', request)
  }

  createThreadLeaves(options: { [x: string]: string | number }) {
    const { videoDuration } = this.req
    const endNum = Math.ceil(videoDuration / 60)
    const maxChat =
      videoDuration < 60
        ? 100
        : videoDuration < 300
          ? 250
          : videoDuration < 600
            ? 500
            : 1000

    const content = `0-${endNum}:100,${maxChat}`
    const request = { content, ...options }

    return this.createPacketItem('thread_leaves', request)
  }

  createPacketItem(name: string, request: { [x: string]: string | number }) {
    const { language, nicoru, scores } = this.req

    return {
      [name]: {
        language,
        nicoru,
        scores,
        ...request,
      },
    }
  }

  formatPacket(
    packetResult: Array<{
      [x: string]: { [x: string]: string | number }
    }>
  ) {
    return packetResult.reduce<{
      [x: string]: {
        [x: string]: Array<{ [x: string]: string | number }>
      }
    }>((items, item) => {
      Object.entries(item).forEach(([key, value]) => {
        const threadName = this.findThreadType(value)

        if (!has(items, [threadName, key])) {
          set(items, [threadName, key], [])
        }

        items[threadName][key].push(value)
      })

      return items
    }, {})
  }

  findThreadType(item: { [x: string]: string | number }) {
    const { defaultThreadId, communityThreadId, nicosThreadId } = this.req

    switch (item.thread) {
      case defaultThreadId:
        return get(item, 'fork') === 1 ? 'owner' : 'default'

      case communityThreadId:
        return 'community'

      case nicosThreadId:
        return 'nicos'

      default:
        return 'unknown'
    }
  }

  get hasDefaultThread() {
    return typeof this.req.defaultThreadId === 'string'
  }

  get hasCommunityThread() {
    return typeof this.req.communityThreadId === 'string'
  }

  get hasNicosThread() {
    return typeof this.req.nicosThreadId === 'string'
  }
}
