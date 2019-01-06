import IconButton from '@material-ui/core/IconButton/'
import { withStyles } from '@material-ui/core/styles/'
import classNames from 'classnames'
import * as React from 'react'
import { RouteChildrenProps, withRouter } from 'react-router'
import { createSearchParams, LocalStorage } from '~/utils/'
import styles from './SearchQueryField.module.scss'

interface Props extends RouteChildrenProps {
  value?: string
  commentButton?: boolean
  defaultTitle?: string
  defaultPlaceholder?: string
  classes?: {
    [x: string]: string
  }
  nicofinderStorage?: LocalStorage
}

interface State {
  query: string
  suggestItems: string[]
}

class SearchQueryField extends React.Component<Props, State> {
  static defaultProps = {
    commentButton: false,
    defaultPlaceholder: '検索',
    defaultTitle: 'Keywords|VideoId|ThreadId|MyListURL|WatchURL',
    nicofinderStorage: new LocalStorage('nicofinder'),
  }

  constructor(props: Props) {
    super(props)

    let query = props.value || ''

    // 検索ページの場合
    if (props.location !== undefined && props.location.pathname === '/search') {
      query = new URLSearchParams(location.search).get('query')
    }

    this.state = {
      query,
      suggestItems: [],
    }
  }

  componentDidUpdate(nextProps: Props, nextState: State) {
    if (nextState.query !== this.state.query) {
      this.fetchSuggestion(nextState.query)
    }
  }

  onSubmitHandler(e: React.FormEvent) {
    e.preventDefault()

    const { query } = this.state
    const { nicofinderStorage } = this.props
    const { router } = this.context

    if (!query.length) {
      return
    }

    const watchIdRegexp = /\d{10}|(?:sm|so|nm)\d+/
    const myListRegexp = /mylist\/(?:\d+)/

    if (watchIdRegexp.test(query.toLowerCase())) {
      // 動画 or コメント解析ページ
      const [id] = query.match(watchIdRegexp)
      const dir =
        nicofinderStorage.store.searchMode === 'comment' ? 'comment' : 'watch'

      location.href = `/${dir}/${id}`
    } else if (myListRegexp.test(query.toLowerCase())) {
      // マイリストページ
      const [path] = query.match(myListRegexp)

      location.pathname = path
    } else if (
      router !== undefined &&
      ['/', '/search', '/about', '/ranking'].includes(
        router.route.location.pathname
      )
    ) {
      // React Router による検索
      this.context.router.history.push({
        pathname: '/search',
        search: createSearchParams(
          {
            params: { query },
          },
          true
        ),
      })
    } else {
      // 検索
      location.href = `/search?query=${query}`
    }
  }

  async fetchSuggestion(query: string) {
    if (!query.length) {
      return
    }

    const url = `https://sug.search.nicovideo.jp/suggestion/complete/${encodeURIComponent(
      query
    )}`
    const res = await fetch(url)

    if (res.status !== 200) {
      return Promise.reject(res)
    }

    const response = await res.json()

    this.setState({
      suggestItems: response.candidates,
    })
  }

  searchQueryInputRender() {
    const {
      classes,
      defaultPlaceholder,
      defaultTitle,
      commentButton,
      nicofinderStorage,
    } = this.props

    const searchQueryInput = (
      <input
        type="search"
        className={styles.input}
        list="searchQueryField-suggest"
        value={this.state.query}
        onChange={({ target }) =>
          this.setState({
            query: target.value,
          })
        }
        placeholder={defaultPlaceholder}
        title={defaultTitle}
        autoComplete="off"
      />
    )

    if (!commentButton) {
      return searchQueryInput
    } else {
      const isComment = nicofinderStorage.store.searchMode === 'comment'

      return (
        <div className={styles.inputContainer}>
          {searchQueryInput}

          <IconButton
            title="コメント解析優先"
            color={isComment ? 'primary' : 'default'}
            classes={{
              root: classes.commentButtonRoot,
              label: classNames('icon-before', 'icon-comment'),
            }}
            onClick={() => {
              nicofinderStorage.update({
                searchMode: isComment ? 'default' : 'comment',
              })

              this.forceUpdate()
            }}
          />
        </div>
      )
    }
  }

  render() {
    const { classes } = this.props

    return (
      <form className={styles.root} onSubmit={this.onSubmitHandler.bind(this)}>
        {this.searchQueryInputRender()}

        <IconButton
          type="submit"
          classes={{
            root: classes.searchButtonRoot,
            label: classNames('icon-before', 'icon-search'),
          }}
        />

        <datalist id="searchQueryField-suggest">
          {this.state.suggestItems.map((candidate) => (
            <option key={`suggest/${candidate}`} value={candidate} />
          ))}
        </datalist>
      </form>
    )
  }
}

export default withRouter(
  withStyles({
    searchButtonRoot: {
      width: 32,
      height: 32,
      fontSize: '2rem',
      lineHeight: '1rem',
    },
    commentButtonRoot: {
      width: 28,
      height: 28,
      fontSize: '1.5rem',
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 14px)',
    },
  })(SearchQueryField)
)
