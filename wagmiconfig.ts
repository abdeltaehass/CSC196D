import { http, createConfig } from '@wagmi/core'
import { bscTestnet } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http(),
  },
})