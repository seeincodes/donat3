'use client'

import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
} from '@web3auth/openlogin-adapter'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Chain, configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli, baseGoerli } from 'viem/chains'
import { publicProvider } from 'wagmi/providers/public'
// RainbowKit
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { Avatar } from '@/components/ui/Avatar'
import { getRainbowTheme } from '@/lib'
import { useColorMode } from '@chakra-ui/react'
import { Global } from '@emotion/react'

const name = 'Login with Google'
const iconUrl =
  'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png'

const rainbowWeb3AuthConnector = (chains: Chain[]) => {
  // Create Web3Auth Instance
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x' + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0]!,
  }

  const web3AuthInstance = new Web3AuthNoModal({
    clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT as string,
    chainConfig,
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
  })

  // Add openlogin adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  })
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
  })
  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  const connector = new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: 'google',
      },
    },
  })

  return {
    id: 'web3auth',
    name,
    iconUrl,
    iconBackground: '#fff',
    createConnector: () => {
      return {
        connector,
      }
    },
  }
}

const { chains, publicClient } = configureChains(
  [goerli, baseGoerli],
  [publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      rainbowWallet({ projectId: '04309ed1007e77d1f119b85205bb779d', chains }),
      rainbowWeb3AuthConnector(chains),
      metaMaskWallet({ projectId: '04309ed1007e77d1f119b85205bb779d', chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
})

export default function ConnectorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // const { colorMode } = useColorMode() // TODO Solve undefined ret
  const { theme, globalCss } = getRainbowTheme(true)
  return (
    <WagmiConfig config={wagmiConfig}>
      <Global styles={globalCss} />
      <RainbowKitProvider chains={chains} avatar={Avatar} theme={theme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
