'use client'

import { ethers } from 'ethers'
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit'

export async function createSafe(ownerAddress: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  const safeOwner = provider.getSigner()

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  })

  const safeFactory = await SafeFactory.create({ ethAdapter })

  let safeAccountConfig: SafeAccountConfig = {
    owners: [ownerAddress],
    threshold: 1,
  }

  const predictSafeAddress =
    await safeFactory.predictSafeAddress(safeAccountConfig)

  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce: '0',
  })

  return safe
}
