import classNames from 'classnames'
import * as React from 'react'
import { removeHTMLString } from '~/utils/'
import { VideoItemContext } from './'

export default function Description() {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const componentName = `${name}-description`

        return (
          <p
            key={`${componentName}-${video.id}`}
            className={classNames(componentName, styles.description)}
          >
            {removeHTMLString(video.description)}
          </p>
        )
      }}
    </VideoItemContext.Consumer>
  )
}
