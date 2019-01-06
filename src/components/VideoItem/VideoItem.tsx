import classNames from 'classnames'
import * as React from 'react'

export interface VideoItemVideo {
  id: string
  title: string
  description: string
  duration: number
  published: number
  tags?: string[]
  viewCount?: number
  myListCount?: number
  commentCount?: number
  thumbnailUrl: string
  lastComments?: string
  fetchTime?: string
  largeThumbnail?: boolean
  movieType?: string
  registered?: number
  [x: string]: any
}

export interface VideoItemStyles {
  [x: string]: string
}

export interface Props {
  name?: string
  styles?: VideoItemStyles
  video: VideoItemVideo
  className?: string
}

export const VideoItemContext = React.createContext<{
  name?: string
  video?: VideoItemVideo
  styles?: VideoItemStyles
}>({})

const VideoItem: React.SFC<Props> = (props) => {
  const { name, video, styles, className, ...others } = props
  const contextValue = {
    name,
    video,
    styles,
  }

  return (
    <VideoItemContext.Provider value={contextValue}>
      <div className={classNames(name, className, styles.root)} {...others} />
    </VideoItemContext.Provider>
  )
}

VideoItem.defaultProps = {
  name: 'videoItem',
}

export default VideoItem
