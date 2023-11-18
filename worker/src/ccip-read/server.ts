import { Server } from '@ensdomains/ccip-read-cf-worker'
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json'
import { Buffer } from 'buffer'
import { BytesLike, ethers } from 'ethers'
import { Result, hexConcat } from 'ethers/lib/utils'

import { Env } from '../env'
import { Database, DatabaseResult } from './db'

const Resolver = new ethers.utils.Interface(Resolver_abi)

function decodeDnsName(dnsname: Buffer) {
  const labels = []
  let idx = 0
  while (true) {
    const len = dnsname.readUInt8(idx)
    if (len === 0) break
    labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'))
    idx += len + 1
  }
  return labels.join('.')
}

const queryHandlers: {
  [key: string]: (
    db: Database,
    name: string,
    args: Result,
    env: Env
  ) => Promise<DatabaseResult>
} = {
  'addr(bytes32)': async (db, name, _args, env) => {
    const { addr, ttl } = await db.addr(name, 60, env)
    return { result: [addr], ttl }
  },
  'addr(bytes32,uint256)': async (db, name, args, env) => {
    const { addr, ttl } = await db.addr(name, args[0], env)
    return { result: [addr], ttl }
  },
  'text(bytes32,string)': async (db, name, args, env) => {
    const { value, ttl } = await db.text(name, args[0], env)
    return { result: [value], ttl }
  },
  'contenthash(bytes32)': async (db, name, _args, env) => {
    const { contenthash, ttl } = await db.contenthash(name, env)
    return { result: [contenthash], ttl }
  },
}

async function query(
  db: Database,
  name: string,
  data: string,
  env: Env
): Promise<{ result: BytesLike; validUntil: number }> {
  // Parse the data nested inside the second argument to `resolve`
  const { signature, args } = Resolver.parseTransaction({ data })

  if (ethers.utils.nameprep(name) !== name) {
    throw new Error('Name must be normalised')
  }

  if (ethers.utils.namehash(name) !== args[0]) {
    throw new Error('Name does not match namehash')
  }

  const handler = queryHandlers[signature]
  if (handler === undefined) {
    throw new Error(`Unsupported query function ${signature}`)
  }

  const { result, ttl } = await handler(db, name, args.slice(1), env)

  return {
    result: Resolver.encodeFunctionResult(signature, result),
    validUntil: Math.floor(Date.now() / 1000 + ttl),
  }
}

export function makeServer(
  signer: ethers.utils.SigningKey,
  db: Database | Promise<Database>,
  env: Env
) {
  const server = new Server()
  server.add(IResolverService_abi, [
    {
      type: 'resolve',
      func: async ([encodedName, data]: Result, request) => {
        const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'))

        // Query the database
        const { result, validUntil } = await query(await db, name, data, env)

        // Hash and sign the response
        let messageHash = ethers.utils.solidityKeccak256(
          ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
          [
            '0x1900',
            request?.to,
            validUntil,
            ethers.utils.keccak256(request?.data || '0x'),
            ethers.utils.keccak256(result),
          ]
        )

        const sig = signer.signDigest(messageHash)
        const sigData = hexConcat([sig.r, sig.s, new Uint8Array([sig.v])])
        return [result, validUntil, sigData]
      },
    },
  ])
  return server
}

export function makeApp(
  signer: ethers.utils.SigningKey,
  path: string,
  db: Database | Promise<Database>,
  env: Env
) {
  return makeServer(signer, db, env).makeApp(path)
}
