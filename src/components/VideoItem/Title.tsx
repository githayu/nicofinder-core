import classNames from 'classnames'
import * as React from 'react'
import { decodeHTMLEnteties } from '~/utils/index'
import { VideoItemContext } from './index'

export default function Title() {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const componentName = `${name}-title`

        return (
          <h1
            key={`${componentName}-${video.id}`}
            className={classNames(componentName, styles.title)}
            title={video.title}
          >
            {decodeHTMLEnteties(video.title)}
          </h1>
        )
      }}
    </VideoItemContext.Consumer>
  )
}
