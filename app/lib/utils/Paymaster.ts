import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types'

// https://chainlist.org
const RPC_URL = 'https://endpoints.omniatech.io/v1/bsc/mainnet/public'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const safeAddress = localStorage.getItem('safeAddress')!

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const withdrawAmount = ethers.utils.parseUnits('0.005', 'ether').toString()

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
  signerOrProvider: signer,
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
