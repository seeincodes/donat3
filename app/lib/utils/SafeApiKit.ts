import { ethers } from 'ethers'
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from '@safe-global/protocol-kit'

const provider = new ethers.providers.Web3Provider((window as any).ethereum)
const safeOwner = provider.getSigner(0)

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: safeOwner,
})

async function createSafe(ownerAddress: string) {
  const txServiceUrl = 'https://safe-transaction-mainnet.safe.global'

  const safeFactory = await SafeFactory.create({ ethAdapter })

  const owner1Signer = new ethers.Wallet(ownerAddress, provider)

  let safeAccountConfig: SafeAccountConfig = {
    owners: [await owner1Signer.getAddress()],
    threshold: 1,
    // ... (Optional params)
  }

  const predictSafeAddress =
    await safeFactory.predictSafeAddress(safeAccountConfig)

  if (predictSafeAddress !== null) {
    safeAccountConfig.owners[0] = predictSafeAddress
  }

  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
  })

  return safe
}
