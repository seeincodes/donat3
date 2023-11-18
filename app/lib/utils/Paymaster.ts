import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  encodeSetupCallData,
  getSafeContract,
} from '@safe-global/protocol-kit'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import { encodeSetupCallDataProps } from '@safe-global/protocol-kit/dist/src/contracts/utils'

const provider = new ethers.providers.JsonRpcProvider('') // TODO: use wagmi instead here

async function paymaster(amount: string) {
  const safeAddress = localStorage.getItem('safeAddress')!

  const destinationAddress = safeAddress
  const withdrawAmount = ethers.utils.parseUnits(amount, 'usdc').toString()

  const transactions: MetaTransactionData[] = [
    {
      to: destinationAddress,
      data: '0x',
      value: withdrawAmount,
    },
  ]

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: provider.getSigner(), // TODO: need to change to wagmi signer,
  })

  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress,
  })

  const relayKit = new GelatoRelayPack()

  const safeTransaction = await relayKit.createRelayedTransaction({
    safe: safeSDK,
    transactions,
  })

  const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction)

  let safeAccountConfig: SafeAccountConfig = {
    owners: ['0x...'], // TODO: need to change to owner address
    threshold: 1,
  }

  const encodedData: encodeSetupCallDataProps = {
    ethAdapter,
    safeAccountConfig,
    safeContract: await getSafeContract({ ethAdapter, safeVersion: '1.3.0' }),
  }

  await encodeSetupCallData(encodedData)

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safeSDK
  )

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  )
}
