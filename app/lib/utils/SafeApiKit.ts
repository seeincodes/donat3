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
  // safeAccountConfig, saltNonce, options, callback

  const owner1Signer = new ethers.Wallet('Wallet', provider)

  const safeAccountConfig: SafeAccountConfig = {
    owners: [await owner1Signer.getAddress()],
    threshold: 2,
    // ... (Optional params)
  }

  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
  })

  return safe
}
