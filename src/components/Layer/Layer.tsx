import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface Props {
  show: boolean
  className?: string
  layerClassName?: string
  style?: {}
  isCloseWithInsideClick: boolean
  shouldCancelClick(e: MouseEvent): boolean
  outSideClick?(): void
}

interface HTMLMouseEvent extends MouseEvent {
  target: HTMLElement
}

export default class Layer extends React.Component<Props> {
  static defaultProps: Props = {
    show: true,
    isCloseWithInsideClick: true,
    shouldCancelClick: () => true,
  }

  el = document.createElement('div')

  componentDidMount() {
    document.body.appendChild(this.el)

    window.addEventListener('click', this.outSideClickHandler, true)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.outSideClickHandler, true)

    document.body.removeChild(this.el)
  }

  outSideClickHandler = (e: HTMLMouseEvent) => {
    if (
      this.props.shouldCancelClick !== undefined &&
      !this.props.shouldCancelClick(e)
    ) {
      return
    }

    if (!this.el || !this.props.outSideClick) {
      return
    }

    if (
      (e.target !== this.el && !this.el.contains(e.target)) ||
      this.props.isCloseWithInsideClick
    ) {
      // クリックの例外を指定可能
      if (this.props.shouldCancelClick(e)) {
        this.props.outSideClick()
      }
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}
