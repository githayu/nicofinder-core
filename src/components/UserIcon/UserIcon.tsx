import classNames from 'classnames'
import { isInteger, omit } from 'lodash-es'
import * as React from 'react'

interface Props {
  userId: number | string
}

interface State {
  isBlank: boolean
}

class UserIcon extends React.PureComponent<Props, State> {
  state = {
    isBlank: false,
  }

  constructor(props: Props) {
    super(props)

    const { userId } = props

    if (isInteger(userId)) {
      const img = new Image()

      img.onerror = () =>
        this.setState({
          isBlank: true,
        })

      img.src = this.url
    } else {
      this.state.isBlank = true
    }
  }

  get url() {
    const { userId } = this.props
    const dir = Math.floor(Number(userId) / 10000)
    const url = `https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/s/${dir}/${userId}.jpg`

    return url
  }

  render() {
    if (this.state.isBlank) {
      return <i className={classNames('icon-before', 'icon-account')} />
    }

    return <img {...omit(this.props, 'userId')} src={this.url} />
  }
}

export default UserIcon
