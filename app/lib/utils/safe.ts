'use server'

import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import {
  MetaTransactionData,
  MetaTransactionOptions,
} from '@safe-global/safe-core-sdk-types'
import { ChainKeys, SafeFactoryAddress } from '../types/base'
import { random } from './basics'
import { getEthersSigner } from './ethers'
import SafeApiKit from '@safe-global/api-kit'

const threadTracker = new Map<
  `0x${string}`,
  {
    idle: boolean
  }
>()

type DeploySafeWithPaymaster = {
  chainKey: ChainKeys
  saltNonce: string
  factoryAddress: `0x${string}`
  ownerAddress: `0x${string}`
  moduleAddress?: `0x${string}`
}

export async function getSafeWalletAddress(ownerAddress?: `0x${string}`) {
  if (!ownerAddress) return null
  const signerOrProvider = (await getEthersSigner('EthSepolia'))!

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider,
  })

  const safeApiKit = new SafeApiKit({
    txServiceUrl: 'https://safe-transaction-mainnet.safe.global',
    ethAdapter,
  })

  return await safeApiKit.getSafesByOwner(ownerAddress)
}

export async function batchDeploySafeWithPaymaster(
  ownerAddress: `0x${string}` | undefined
) {
  if (!ownerAddress) return undefined
  const threadHasAddress = threadTracker.has(ownerAddress)

  if (!threadHasAddress) threadTracker.set(ownerAddress, { idle: true })

  if (!threadTracker.get(ownerAddress)!.idle) return undefined

  try {
    threadTracker.set(ownerAddress, { idle: false })
    const response = await handleBatchDeploySafeWithPaymaster(ownerAddress)

    return response
  } finally {
    threadTracker.set(ownerAddress, { idle: true })
  }
}

async function handleBatchDeploySafeWithPaymaster(ownerAddress: `0x${string}`) {
  const keys: ChainKeys[] = ['EthGoerli']
  const saltNonce = String(random(0, 99999999, false))

  const response = await Promise.all(
    keys.map(async (k) => {
      const factoryAddress = SafeFactoryAddress[k]
      return await deploySafeWithPaymaster({
        saltNonce,
        chainKey: k,
        factoryAddress,
        ownerAddress,
      })
    })
  )

  return response
}

async function deploySafeWithPaymaster({
  chainKey,
  saltNonce,
  factoryAddress,
  ownerAddress,
  moduleAddress,
}: DeploySafeWithPaymaster) {
  const signer = (await getEthersSigner(chainKey))!

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
  })

  const response = await relayKit.executeRelayTransaction(
    safeTransaction,
    safe,
    options
  )

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  )

  return response
}
