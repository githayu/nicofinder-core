import blue from '@material-ui/core/colors/blue'
import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  palette: {
    primary: blue,
    secondary: blue,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Open Sans',
      'Hiragino Kaku Gothic Pro',
      'Meiryo',
      'sans-serif',
    ].join(),
    htmlFontSize: 10,
    useNextVariants: true,
  },
  overrides: {
    MuiIconButton: {
      root: {
        padding: 0,
      },
    },
  },
})
