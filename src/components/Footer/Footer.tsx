import * as React from 'react'
import './Footer.scss'

export default class Footer extends React.PureComponent {
  render() {
    const { children } = this.props
    const copyright = `© ${new Date().getFullYear()} Nicofinder, Powered by niconico.`

    return (
      <footer className="footer">
        <div className="footer-inner">
          <nav className="footer-links">
            <a href="https://nicofinder.uservoice.com/" target="_blank">
              ヘルプ
            </a>
            <a
              onClick={(e) => {
                window.UserVoice.push(['show'])
              }}
            >
              不具合報告
            </a>

            {children}
          </nav>

          <small className="copyright">{copyright}</small>
        </div>
      </footer>
    )
  }
}
