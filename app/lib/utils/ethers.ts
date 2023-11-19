'use server'

import { type WalletClient, type PublicClient } from '@wagmi/core'
import { ethers } from 'ethers'
import { http, createPublicClient, createWalletClient } from 'viem'
import { ChainKeys } from '../types/base'
import { baseGoerli, goerli, sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

/** Action to convert a viem Public Client to an ethers.js Provider. */
export async function getEthersProvider(chainKey: ChainKeys) {
  const chain = getChain(chainKey)
  const publicClient = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.public.http[0]),
  })

  // @ts-ignore
  return publicClientToProvider(publicClient)
}

// export async function getEthersSigner(chainKey: ChainKeys) {
//   const chain = getChain(chainKey)
//   const provider = new ethers.providers.JsonRpcProvider(
//     chain.rpcUrls.public.http[0]
//   )
//   const signer = new ethers.Wallet(
//     process.env.PRIVATE_KEY! as `0x${string}`,
//     provider
//   )
//   return signer
// }

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner(chainKey: ChainKeys) {
  const chain = getChain(chainKey)
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`),
    chain,
    transport: http(chain.rpcUrls.public.http[0]),
  })
  if (!walletClient) return undefined
  return walletClientToSigner(walletClient)
}

async function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new ethers.providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

async function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
    transport.url,
    network
  )
  return jsonRpcProvider
}

function getChain(chainKey: ChainKeys) {
  switch (chainKey) {
    case 'BaseGoerli':
      return baseGoerli

    case 'EthSepolia':
      return sepolia

    case 'EthGoerli':
      return goerli
  }
}
