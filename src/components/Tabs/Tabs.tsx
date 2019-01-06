import classNames from 'classnames'
import * as React from 'react'

import './Tabs.scss'

interface Props {
  value: string
  children?: React.ReactChild[]
  className?: string
  navigationClassName?: string
  contentClassName?: string
  onChange?(value: string): void
}

interface State {
  selectedIndex: number
}

export default class Tabs extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const selectedIndex = this.getSelectedIndex()

    if (0 <= selectedIndex) {
      this.setState({ selectedIndex })
    }

    this.state = {
      selectedIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.value === nextProps.value) {
      const selectedIndex = this.getTabs().findIndex(
        (tab) => tab.props.value === nextProps.value
      )
      this.setState({ selectedIndex })
    }
  }

  getSelectedIndex() {
    return this.getTabs().findIndex((tab) => {
      return this.props.value === tab.props.value
    })
  }

  getTabs() {
    return this.props.children.reduce((array, tab) => {
      return React.isValidElement(tab) ? array.concat(tab) : array
    }, [])
  }

  handleClick(index: number) {
    if (this.props.onChange) {
      const value = this.getTabs()[index].props.value
      this.props.onChange(value)
    }

    this.setState({
      selectedIndex: index,
    })
  }

  render() {
    const { className, navigationClassName, contentClassName } = this.props

    const { tabs, tabContent } = this.getTabs().reduce(
      (data, tab, index) => {
        const selected = this.state.selectedIndex === index

        data.tabs.push(
          React.createElement(
            'li',
            {
              key: `tab-${index}`,
              className: classNames({
                'is-active': selected,
              }),
              onClick: this.handleClick.bind(this, index),
            },
            tab.props.label
          )
        )

        if (tab.props.children) {
          data.tabContent.push(
            React.cloneElement(tab, {
              key: `tabContent-${index}`,
              selected,
            })
          )
        }

        return data
      },
      {
        tabs: [],
        tabContent: [],
      }
    )

    const content = tabContent.length
      ? React.createElement(
          'div',
          {
            className: classNames('c-tabs-contentContainer', contentClassName),
          },
          tabContent
        )
      : null

    return (
      <div className={classNames('c-tabs-container', className)}>
        <ul className={classNames('c-tabs-navigation', navigationClassName)}>
          {tabs}
        </ul>

        {content}
      </div>
    )
  }
}
