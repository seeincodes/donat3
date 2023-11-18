import {
  type WalletClient,
  type PublicClient,
  getWalletClient,
} from '@wagmi/core'
import { providers } from 'ethers'
import { http, type HttpTransport, createPublicClient } from 'viem'
import { ChainKeys } from '../types/base'
import { baseGoerli, sepolia } from 'viem/chains'

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = await getWalletClient({ chainId })
  if (!walletClient) return undefined
  return walletClientToSigner(walletClient)
}

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider(chainKey: ChainKeys) {
  const publicClient = createPublicClient({
    chain: (() => {
      switch (chainKey) {
        case 'BaseGoerli':
          return baseGoerli

        default:
          return sepolia
      }
    })(),
    transport: http(),
  })
  // @ts-ignore
  return publicClientToProvider(publicClient)
}
