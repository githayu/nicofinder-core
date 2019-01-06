import classNames from 'classnames'
import * as React from 'react'
import { Thumbnail } from '../'
import { VideoItemContext } from './'

interface Props {
  forceLargeThumbnail: boolean
  shouldRenderMeta?: boolean
  children?: React.ReactNode
}

const defaultProps = {
  shouldRenderMeta: false,
}

const LeftBox: React.SFC<Props> = (props) => {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const { forceLargeThumbnail, shouldRenderMeta, children } = props
        const componentName = `${name}-thumbnail`
        let nextChild = children

        // メタ情報も含む場合は'div'で囲う
        if (shouldRenderMeta) {
          const wrapperName = `${name}-meta`

          nextChild = (
            <div
              key={`${wrapperName}-${video.id}`}
              className={classNames(wrapperName)}
            >
              {children}
            </div>
          )
        }

        return (
          <Thumbnail
            key={componentName}
            video={video}
            forceLargeSize={forceLargeThumbnail}
            className={styles.thumbnail}
          >
            {nextChild}
          </Thumbnail>
        )
      }}
    </VideoItemContext.Consumer>
  )
}

LeftBox.defaultProps = defaultProps

export default LeftBox
