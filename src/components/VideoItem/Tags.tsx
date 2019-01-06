import classNames from 'classnames'
import * as React from 'react'
import { Link } from 'react-router-dom'
import createSearchParams from '~/utils/createSearchParams'
import { VideoItemContext, VideoItemVideo } from './'

function TagItem({ name, video }: { name: string; video: VideoItemVideo }) {
  return (
    <React.Fragment>
      {video.tags.map((tag, index) => (
        <Link
          key={`${name}-${video.id}-${index}`}
          to={{
            pathname: '/search',
            search: createSearchParams(
              {
                params: {
                  query: tag,
                  page: 1,
                  filters: [],
                },
              },
              true
            ),
          }}
        >
          {tag}
        </Link>
      ))}
    </React.Fragment>
  )
}

export default class Tags extends React.PureComponent {
  state = {
    show: false,
  }

  render() {
    const { show } = this.state

    return (
      <VideoItemContext.Consumer>
        {({ name, video, styles }) => {
          const componentName = `${name}-tags`

          return (
            <div
              onClick={() => this.setState({ show: !show })}
              className={classNames(componentName, styles.tags, {
                open: show,
              })}
            >
              <div className={classNames(`${componentName}Inner`)}>
                <TagItem name={componentName} video={video} />
              </div>
            </div>
          )
        }}
      </VideoItemContext.Consumer>
    )
  }
}
