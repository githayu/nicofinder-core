import classNames from 'classnames'
import * as moment from 'moment'
import * as React from 'react'
import { dateFormat } from '~/utils/'
import { VideoItemContext } from './'

export default function Published() {
  return (
    <VideoItemContext.Consumer>
      {({ name, video, styles }) => {
        const componentName = `${name}-date`

        return (
          <time
            key={`${componentName}-${video.id}`}
            className={classNames(componentName, styles.published)}
            dateTime={moment(video.published).toISOString()}
          >
            {dateFormat(moment(video.published).valueOf())}
          </time>
        )
      }}
    </VideoItemContext.Consumer>
  )
}
