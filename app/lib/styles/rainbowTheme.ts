import { dark, light } from '@/lib/styles/theme'
import { css } from '@emotion/react'
import { Theme, lightTheme } from '@rainbow-me/rainbowkit'
import { merge } from 'lodash'

export const getRainbowTheme = (isLight: boolean) => {
  const accentColor = isLight ? light.accent[400] : dark.accent[400]
  const modalBackground = isLight ? 'white' : dark.primary[800]
  const secondaryColor = isLight
    ? // gray 600
      '#4A5568'
    : // fray 300
      '#CBD5E0'
  const profileAction = isLight
    ? // gray 200
      '#E2E8F0'
    : dark.primary[700]

  const theme = merge(lightTheme(), {
    colors: {
      accentColor,
      modalBackground,
      modalText: secondaryColor,
      modalTextSecondary: secondaryColor,
      modalTextDim: secondaryColor,
      closeButton: secondaryColor,
      profileAction,
    },
  } as Theme)

  const globalCss = css`
    .walletconnect-modal__footer {
      display: flex;
      row-gap: 0.5em;
      flex-wrap: wrap;
    }

    .walletconnect-search__input::placeholder {
      color: black !important;
    }

    .walletconnect-modal__mobile__toggle {
      color: black !important;
    }
  `

  return {
    theme,
    globalCss,
  }
}
