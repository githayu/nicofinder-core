import classNames from 'classnames'
import * as React from 'react'
import { separateNumeric } from '~/utils/'
import { VideoItemContext } from './'

interface Props {
  items?: Array<{
    name: string
    iconName: string
    propName: string
  }>
}

const Counter: React.SFC<Props> = ({ items }) => {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const componentName = `${name}-counter`

        return (
          <ul
            key={`${componentName}-${video.id}`}
            className={classNames(componentName, styles.counter)}
          >
            {items.map((item) => (
              <li
                key={`${componentName}-${video.id}-${item.name}`}
                className={classNames(`icon-${item.iconName}`)}
              >
                {separateNumeric(video[item.propName])}
              </li>
            ))}
          </ul>
        )
      }}
    </VideoItemContext.Consumer>
  )
}

const defaultProps = {
  items: [
    { name: 'view', iconName: 'play', propName: 'viewCount' },
    { name: 'myList', iconName: 'folder', propName: 'myListCount' },
    { name: 'comment', iconName: 'comment', propName: 'commentCount' },
  ],
}

Counter.defaultProps = defaultProps

export default Counter
