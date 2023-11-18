'use server'

import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import {
  MetaTransactionData,
  MetaTransactionOptions,
} from '@safe-global/safe-core-sdk-types'
import { ChainKeys, ChainRpcUrl, SafeFactoryAddress } from '../types/base'
import { random } from './basics'
import { WalletClient } from 'wagmi'
import { walletClientToSigner } from './ethers'

// const withdrawAmount = ethers.utils.parseUnits(amountUSDC, '6').toString()
// const safeContract = await getSafeContract({
//   ethAdapter,
//   safeVersion: '1.3.0',
// })

// const data = await encodeSetupCallData({
//   ethAdapter,
//   safeAccountConfig: {
//     owners: [signer._address],
//     threshold: 1,
//   },
//   safeContract,
// })

type DeploySafeWithPaymaster = {
  provider: ethers.providers.JsonRpcProvider
  saltNonce: string
  factoryAddress: `0x${string}`
  ownerAddress: `0x${string}`
  moduleAddress?: `0x${string}`
}

export async function getSafeWalletAddress(
  ownerAddress?: `0x${string}` /* safeOwnerClient: WalletClient */
) {
  if (!ownerAddress) return undefined
  // const signerOrProvider = walletClientToSigner(safeOwnerClient)
  const provider = new ethers.providers.JsonRpcProvider(ChainRpcUrl.EthSepolia)
  const signerOrProvider = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider,
  })

  const safeFactory = await SafeFactory.create({ ethAdapter })

  const predictSafeAddress = await safeFactory.predictSafeAddress({
    owners: [ownerAddress],
    threshold: 1,
  })

  return predictSafeAddress
}

export async function batchDeploySafeWithPaymaster(
  ownerAddress: `0x${string}` | undefined
) {
  if (!ownerAddress) return undefined
  const keys: ChainKeys[] = ['BaseGoerli', 'EthSepolia']
  const saltNonce = String(random(0, 99999999, false))

  const response = await Promise.all(
    keys.map(async (k) => {
      const provider = new ethers.providers.JsonRpcProvider(ChainRpcUrl[k])
      const factoryAddress = SafeFactoryAddress[k]
      return await deploySafeWithPaymaster({
        saltNonce,
        provider,
        factoryAddress,
        ownerAddress,
      })
    })
  )

  return response
}

async function deploySafeWithPaymaster({
  provider,
  saltNonce,
  factoryAddress,
  ownerAddress,
  moduleAddress,
}: DeploySafeWithPaymaster) {
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

  // Create a transactions array with one transaction object
  const transactions: MetaTransactionData[] = [
      {
        to: factoryAddress,
        data: '0x',
        value: '0',
      },
    ],
    options: MetaTransactionOptions = {
      isSponsored: true,
    }

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  })

  const safe = await Safe.create({
    ethAdapter,
    predictedSafe: {
      safeAccountConfig: {
        owners: [ownerAddress],
        threshold: 1,
      },
      safeDeploymentConfig: {
        saltNonce,
        safeVersion: '1.3.0',
      },
    },
  })

  // const ccipModule = await safe.createEnableModuleTx(moduleAddress)

  const relayKit = new GelatoRelayPack(process.env.GELATO_1BALANCE_API_KEY)

  const safeTransaction = await relayKit.createRelayedTransaction({
      safe,
      transactions,
      options,
    }),
    signedSafeTransaction = await safe.signTransaction(
      safeTransaction,
      'eth_sign'
    )

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safe,
    options
  )

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  )

  return response
}
