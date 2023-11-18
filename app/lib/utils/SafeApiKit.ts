'use client'

import { ethers } from 'ethers'
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit'
import { useAccount } from 'wagmi'

export async function createSafe(ownerAddress: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  const safeOwner = provider.getSigner()

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  })
  //   const txServiceUrl = 'https://safe-transaction-mainnet.safe.global'

  const safeFactory = await SafeFactory.create({ ethAdapter })

  // const owner1Signer = new ethers.Wallet(ownerAddress, provider)

  let safeAccountConfig: SafeAccountConfig = {
    owners: [ownerAddress],
    threshold: 1,
    // ... (Optional params)
  }

  const predictSafeAddress =
    await safeFactory.predictSafeAddress(safeAccountConfig)

  // if (predictSafeAddress !== null) {
  //   safeAccountConfig.owners[0] = predictSafeAddress
  //   localStorage.setItem('safeAddress', predictSafeAddress)
  // }

  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce: '0',
  })

  return safe
}
