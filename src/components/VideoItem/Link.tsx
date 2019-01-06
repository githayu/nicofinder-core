import classNames from 'classnames'
import * as React from 'react'
import { VideoItemContext } from './'

interface Props {
  className?: string
  children?: React.ReactNode
}

export default function Link(props: Props) {
  const { className, children, ...others } = props

  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        return (
          <a
            href={`/watch/${video.id}`}
            className={classNames(className, `${name}-link`, styles.link)}
            {...others}
          >
            {children}
          </a>
        )
      }}
    </VideoItemContext.Consumer>
  )
}
