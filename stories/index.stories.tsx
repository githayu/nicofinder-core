import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { boolean, withKnobs } from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links'
import { addDecorator, storiesOf } from '@storybook/react'
import * as React from 'react'
import { MemoryRouter } from 'react-router'
import '~/assets/sass/common.scss'
import {
  default as Header,
  Header as HeaderComponent,
} from '~/components/Header/Header'
import './styles.scss'

addDecorator(withKnobs)

storiesOf('Header', module).add(
  'Default',
  withInfo({
    inline: true,
    source: false,
    propTables: [HeaderComponent],
    propTablesExclude: [Header, MemoryRouter],
  })(() => (
    <MemoryRouter>
      <Header searchForm={boolean('検索欄', true)} />
    </MemoryRouter>
  ))
)
