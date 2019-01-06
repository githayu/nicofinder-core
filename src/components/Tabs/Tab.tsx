import classNames from 'classnames'
import * as React from 'react'

interface Props {
  label: string
  value: string
  selected?: boolean
  className?: string
  children?: React.ReactChild
  onClick?(): void
}

export default class Tab extends React.PureComponent<Props> {
  render() {
    const { selected, className } = this.props

    return (
      <div
        className={classNames(className, {
          'is-active': selected,
        })}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    )
  }
}
