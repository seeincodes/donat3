import { Button, Flex, IconButton, Image, Skeleton } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Login() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div>
            {(() => {
              if (!ready)
                return <Skeleton borderRadius={'xl'} w={'160px'} h={8} />

              if (!connected)
                return <Button onClick={openConnectModal}>Login</Button>

              if (chain.unsupported)
                return <Button onClick={openChainModal}>Wrong network</Button>

              return (
                <Flex gap={3}>
                  <Button onClick={openAccountModal}>
                    {!account.hasPendingTransactions
                      ? account.displayName
                      : 'Pending Tx...'}
                  </Button>
                  <IconButton
                    borderRadius={'full'}
                    aria-label={chain.name + 'icon'}
                    onClick={openChainModal}
                    icon={
                      <Image
                        borderRadius={'full'}
                        alt=""
                        src={chain?.iconUrl}
                        height={30}
                        width={30}
                      />
                    }
                  />
                </Flex>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
