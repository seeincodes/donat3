import { baseGoerli } from 'viem/chains'

export type ChainKeys = keyof typeof ChainId

export enum ChainId {
  EthSepolia = 11155111,
  BaseGoerli = 84531,
}

export enum ChainRpcUrl {
  EthSepolia = 'https://ethereum-sepolia.publicnode.com',
  BaseGoerli = 'https://goerli.base.org',
}

export enum SafeFactoryAddress {
  EthSepolia = '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
  BaseGoerli = '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
}
