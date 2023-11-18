import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'

// https://chainlist.org

const provider = new ethers.providers.JsonRpcProvider('') // use wagmi

async function paymaster(amount: string) {
  const safeAddress = localStorage.getItem('safeAddress')!
  //private key of the safe
  // const signer = new ethers.Wallet(safeAddress, provider)

  // Any address can be used for destination. In this example, we use vitalik.eth
  const destinationAddress = safeAddress
  const withdrawAmount = ethers.utils.parseUnits(amount, 'usdc').toString()

  // Create a transactions array with one transaction object
  const transactions: MetaTransactionData[] = [
    {
      to: destinationAddress,
      data: '0x',
      value: withdrawAmount,
    },
  ]

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: provider.getSigner(), //wagmi signer,
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

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safeSDK
  )

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  )
}
