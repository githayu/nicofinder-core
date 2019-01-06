import classNames from 'classnames'
import * as React from 'react'
import { VideoItemContext } from './'

interface Props {
  children?: React.ReactNode
}

export default function RightBox(props: Props) {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const componentName = `${name}-info`

        return (
          <div
            key={`${componentName}-${video.id}`}
            className={classNames(componentName, styles.info)}
          >
            {props.children}
          </div>
        )
      }}
    </VideoItemContext.Consumer>
  )
}
