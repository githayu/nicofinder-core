import classNames from 'classnames'
import * as React from 'react'
import './SaveMyListForm.scss'

interface Props {
  cancelClick(): void
}

interface State {
  name: string
  description: string
  isPublic: boolean
  status: 'wait' | 'registered' | 'registering'
  progress: Array<{
    status: boolean
    value: number
    max: number
    item: {
      [x: string]: any
    }
  }>
  groupId?: number
}

export default class PlayerSaveQueueForm extends React.Component<Props, State> {
  state: Readonly<State> = {
    name: '',
    description: '',
    isPublic: false,
    status: 'wait',
    progress: [],
  }

  constructor(props: Props) {
    super(props)

    window.Player.extension.port.onMessage.addListener(this.onMessage)
  }

  onMessage = (msg: { type: string; payload: any }) => {
    if (msg.type === 'progressSaveQueueToMyList') {
      const progress = msg.payload
      const nextProgress = Array.from(this.state.progress)

      nextProgress.push(progress)

      this.setState({
        progress: nextProgress,
      })
    } else if (msg.type === 'completeSaveQueueToMyList') {
      this.setState({
        status: 'registered',
        groupId: msg.payload.groupId,
      })
    }
  }

  componentWillUnmount() {
    window.Player.extension.port.onMessage.removeListener(this.onMessage)
  }

  onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const playListQueue = JSON.parse(
      localStorage.getItem('nicofinder_playListQueue')
    )

    window.Player.extension.port.postMessage({
      type: 'saveQueueToMyList',
      payload: {
        group: {
          name: this.state.name,
          description: this.state.description,
          isPublic: this.state.isPublic,
        },
        items: playListQueue.items,
      },
    })

    this.setState({
      status: 'registering',
    })
  }

  renderDefaultMode() {
    return (
      <div className={classNames('saveQueueForm-content')}>
        <div className="saveQueueForm-field">
          <label>
            <span>タイトル</span>
            <input
              type="text"
              maxLength={128}
              value={this.state.name}
              onInput={(e) => this.setState({ name: e.currentTarget.value })}
              required
            />
          </label>

          <label>
            <span>説明文</span>
            <input
              type="text"
              maxLength={1024}
              value={this.state.description}
              onInput={(e) =>
                this.setState({ description: e.currentTarget.value })
              }
            />
          </label>
        </div>

        <div className={classNames('saveQueueForm-footer')}>
          <label>
            <input
              type="checkbox"
              className={classNames('saveQueueForm-checkBox')}
              onChange={(e) => this.setState({ isPublic: e.target.checked })}
            />
            <span>公開</span>
          </label>

          <div className="saveQueueForm-buttons">
            <button type="reset" onClick={this.props.cancelClick}>
              キャンセル
            </button>

            <button type="submit" className={classNames('is-primary')}>
              作成
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderRegistrationMode() {
    const { progress, status, groupId } = this.state

    let groupLink = null
    let progressElement = React.createElement('progress', { value: 0 })
    let progressLogList = null

    if (progress.length) {
      const reverseProgress = Array.from(progress).reverse()
      const lastProgress = reverseProgress[0]

      progressElement = (
        <progress value={lastProgress.value} max={lastProgress.max} />
      )

      progressLogList = (
        <ul className="saveQueueForm-progressLogList">
          {reverseProgress.map((item) => {
            let addMyListLink: React.ReactChild = '登録完了'

            if (!item.status) {
              addMyListLink = (
                <span>
                  <a
                    className={classNames('saveQueueForm-link--addMyList')}
                    onClick={() => {
                      window.open(
                        `https://www.nicovideo.jp/mylist_add/video/${
                          item.item.id
                        }`,
                        'nicovideo-mylist-add',
                        'width=500, height=360'
                      )
                    }}
                  >
                    手動で登録
                  </a>
                </span>
              )
            }

            return (
              <li
                key={`saveQueueForm-progressLogList-${item.item.id}`}
                className={classNames('icon-before', {
                  'icon-alertCircle': !item.status,
                  'icon-checkCircle': item.status,
                })}
              >
                <span>{item.item.id}</span>
                <span>{addMyListLink}</span>
              </li>
            )
          })}
        </ul>
      )

      if (status === 'registered') {
        groupLink = (
          <a
            className={classNames('saveQueueForm-link--resultGroup')}
            href={`https://www.nicovideo.jp/my/mylist/#/${groupId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            マイリストを開く
          </a>
        )
      }
    }

    return (
      <div className={classNames('saveQueueForm-content')}>
        <div className="saveQueueForm-progress">
          {progressElement}
          {groupLink}
        </div>

        {progressLogList}
      </div>
    )
  }

  render() {
    const isRegistering = this.state.status === 'registering'
    const isRegistered = this.state.status === 'registered'
    const contentElement =
      isRegistering || isRegistered
        ? this.renderRegistrationMode()
        : this.renderDefaultMode()

    return (
      <form
        className={classNames('saveQueueForm', {
          'is-register': isRegistering || isRegistered,
          'is-registering': isRegistering,
          'is-registered': isRegistered,
        })}
        onSubmit={this.onSubmit.bind(this)}
      >
        {contentElement}
      </form>
    )
  }
}
