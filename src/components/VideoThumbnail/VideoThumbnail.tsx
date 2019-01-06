import classNames from 'classnames'
import * as moment from 'moment'
import * as React from 'react'
import { durationFormat } from '~/utils/'
import { VideoItemVideo } from '../VideoItem/VideoItem'
import styles from './VideoThumbnail.module.scss'

type thumbnailSizes = 'small' | 'medium' | 'large'

interface Props {
  video: VideoItemVideo
  forceLargeSize: boolean
  className: string
  children: React.ReactNode
}

interface State {
  size: thumbnailSizes
}

class VideoThumbnail extends React.Component<Props, State> {
  static defaultProps = {
    forceLargeSize: true,
  }

  constructor(props: Props) {
    super(props)

    const { video, forceLargeSize } = props

    let size: thumbnailSizes = 'small'

    // 大サイズ優先
    if (forceLargeSize) {
      if (video.largeThumbnail && video.largeThumbnail === true) {
        size = 'large'
      } else {
        // 大サイズの存在が不明な場合は投稿日時より推測
        const checks = {
          isNotOfficial: !video.id.startsWith('so'),
          isAfterDate: moment(video.published).isSameOrAfter(
            '2011-12-08 11:00'
          ),
        }

        if (Object.values(checks).every((i) => i === true)) {
          size = 'large'
        }
      }
    }

    // 実際に大サイズが存在するかチェック
    if (size === 'large') {
      const image = new Image()

      image.src = this.getUrl(size)
      image.addEventListener('error', () => this.setState({ size: 'small' }))
    }

    this.setState({
      size,
    })
  }

  getUrl(type?: thumbnailSizes) {
    const { thumbnailUrl } = this.props.video
    const url = new URL(thumbnailUrl)

    url.protocol = 'https:'

    switch (type) {
      case 'small':
        return url.href

      case 'medium':
        return url.href.concat('.M')

      case 'large':
        return url.href.concat('.L')

      default:
        return this.state.size === 'large' ? url.href.concat('.L') : url.href
    }
  }

  render() {
    const { video, children, className } = this.props

    return (
      <figure
        className={classNames('videoThumbnail-root', className, styles.root)}
        data-video-duration={durationFormat(video.duration)}
      >
        <div
          className={classNames('videoThumbnail-image', styles.image, {
            [styles.large]: this.state.size === 'large',
          })}
          style={{
            backgroundImage: `url(${this.getUrl()})`,
          }}
        />

        {children}
      </figure>
    )
  }
}

export default VideoThumbnail
