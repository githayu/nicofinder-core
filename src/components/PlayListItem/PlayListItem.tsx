import * as React from 'react'
import {
  VideoItem,
  VideoItemLeftBox,
  VideoItemLink,
  VideoItemPublished,
  VideoItemRightBox,
  VideoItemTitle,
} from '../VideoItem/'

import { VideoItemVideo } from '../VideoItem/VideoItem'
import './flex.scss'
import './player.scss'

interface Props {
  name?: string
  video: VideoItemVideo
}

export default class PlayListItem extends React.Component<Props> {
  static defaultProps = {
    name: 'playListItem',
  }

  render() {
    const { name, video, children, ...props } = this.props

    return (
      <VideoItem name={name} video={video} {...props}>
        {children}
        <VideoItemLink>
          <VideoItemLeftBox
            forceLargeThumbnail={false}
            shouldRenderMeta={false}
          />
          <VideoItemRightBox>
            <VideoItemPublished />
            <VideoItemTitle />
          </VideoItemRightBox>
        </VideoItemLink>
      </VideoItem>
    )
  }
}
