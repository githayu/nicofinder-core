import classNames from 'classnames'
import { has } from 'lodash-es'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { SearchQueryField } from '../index'
import styles from './Header.module.scss'

interface HeaderItem {
  type: string
  label?: string
  link?: string
  className?: string
  children?: HeaderItem[]
}

interface Props extends RouteComponentProps {
  searchForm?: boolean
  items?: {
    [x: string]: HeaderItem[]
  }
}

class Header extends React.PureComponent<Props> {
  static defaultProps = {
    searchForm: true,
    items: {
      left: [
        {
          type: 'route',
          label: 'Nicofinder',
          link: '/',
          className: styles.branding,
          children: [
            { type: 'href', label: 'ランキング', link: '/ranking/' },
            { type: 'route', label: 'About', link: '/about' },
          ],
        },
      ],

      right: [{ type: 'search' }],
    },
  }

  itemRender(item: HeaderItem, isChild: boolean = false) {
    const { searchForm, location } = this.props

    return (
      <div
        key={`header/${item.label}`}
        className={classNames(styles[item.type], {
          [styles.subMenu]: item.children,
          [styles.navItem]: !isChild,
          [styles.subItem]: isChild,
        })}
      >
        {(item.type === 'href' ||
          (item.type === 'route' &&
            /\/watch|comment\//.test(location.pathname))) && (
          <a
            href={item.link}
            className={classNames({
              [item.className]: has(item, 'className'),
            })}
          >
            {item.label}
          </a>
        )}

        {item.type === 'route' &&
          !/\/watch|comment\//.test(location.pathname) && (
            <Link
              to={item.link}
              className={classNames({
                [item.className]: has(item, 'className'),
              })}
            >
              {item.label}
            </Link>
          )}

        {item.type === 'search' && searchForm && <SearchQueryField />}

        {item.children && (
          <div className={styles.subMenuContainer}>
            <div className={styles.subMenuContent}>
              {item.children.map((child) => this.itemRender(child, true))}
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const items = this.props.items

    return (
      <header className={classNames(styles.root)}>
        <div className={styles.inner}>
          {Object.keys(items).map((groupType) => (
            <nav className={groupType} key={groupType}>
              {items[groupType].map((item) => this.itemRender(item))}
            </nav>
          ))}
        </div>
      </header>
    )
  }
}

export { Header }
export default withRouter(Header)
