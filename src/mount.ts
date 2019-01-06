import '~/assets/sass/common.scss'
import { PRODUCTION } from '~/index'
import userVoice from './utils/createUserVoiceWidget'

function createAppContainer() {
  const div = document.createElement('div')

  div.id = 'app'

  document.body.appendChild(div)
}

/**
 * ルート要素作成 & 拡張機能ID定義 & UserVoiceWidget読み込み
 */
export default function() {
  createAppContainer()

  if (!PRODUCTION) {
    window.useProductionAPI = true
  }

  window.getExtensionId = () => {
    const params = new URLSearchParams(location.search)
    const mode = params.has('ext')
      ? params.get('ext')
      : !PRODUCTION
        ? 'dev'
        : 'prod'

    switch (mode) {
      case 'dev':
        return 'lhkjphjhlgldeecemdaipocogjgocnhe'
      case 'prod':
        return 'jgnhfelllimcnjaoofphfjiepgfkdbed'
    }
  }

  userVoice()
}
