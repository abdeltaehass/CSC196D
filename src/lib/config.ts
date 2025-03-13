import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {bscTestnet } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = "0d2d0fe295a70bc05d8b5dc51ba67c0f"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [bscTestnet]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig