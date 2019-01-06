export default function createUserVoiceWidget() {
  const script = document.createElement('script')
  script.async = true
  script.src = '//widget.uservoice.com/J2fnXeIYu8HdjPxsD4MrNQ.js'

  document.head.appendChild(script)

  script.addEventListener('load', () => {
    window.UserVoice.push([
      'set',
      {
        accent_color: '#0288D1',
        trigger_color: 'white',
        trigger_background_color: 'rgba(46, 49, 51, 0.6)',
        mode: 'contact',
        screenshot_enabled: true,
        smartvote_enabled: true,
        post_suggestion_enabled: true,
        contact_enabled: true,
        menu_enable: true,
        position: 'bottom-left',
        strings: {
          contact_title: 'フィードバックの送信',
          contact_message_placeholder: '問題やアイデアをご記入ください',
        },
      },
    ])
  })
}
