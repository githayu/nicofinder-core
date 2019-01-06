import classNames from 'classnames'
import * as React from 'react'
import { Layer } from '~/components/'
import './ContextMenu.scss'

interface Props {
  className?: string
}

export default class ContextMenu extends React.PureComponent<Props> {
  render() {
    const { children, className, ...props } = this.props

    return (
      <Layer className={classNames(className, 'contextMenu')} {...props}>
        {children}
      </Layer>
    )
  }
}
