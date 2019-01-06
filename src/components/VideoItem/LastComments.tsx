import classNames from 'classnames'
import * as React from 'react'
import { VideoItemContext } from './'

export default function LastComments() {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const componentName = `${name}-lastComments`

        return (
          <p
            key={`${componentName}-${video.id}`}
            className={classNames(componentName, styles.lastComment)}
          >
            {video.lastComment}
          </p>
        )
      }}
    </VideoItemContext.Consumer>
  )
}
