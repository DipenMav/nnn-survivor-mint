import sdk from "@farcaster/miniapp-sdk";

export interface FarcasterContext {
  isSDKLoaded: boolean;
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
}

let sdkInitialized = false;

export async function initializeFarcaster(): Promise<void> {
  if (sdkInitialized) return;
  
  try {
    const context = await sdk.context;
    console.log("Farcaster SDK initialized:", context);
    sdkInitialized = true;
    
    // Notify the SDK that the app is ready
    sdk.actions.ready();
  } catch (error) {
    console.error("Failed to initialize Farcaster SDK:", error);
    throw error;
  }
}

export async function getFarcasterUser() {
  try {
    await initializeFarcaster();
    const context = await sdk.context;
    return {
      fid: context.user?.fid || 0,
      username: context.user?.username,
      displayName: context.user?.displayName,
      pfpUrl: context.user?.pfpUrl,
    };
  } catch (error) {
    console.error("Failed to get Farcaster user:", error);
    return null;
  }
}

export async function signInWithFarcaster(): Promise<{ address: string; fid: number } | null> {
  try {
    await initializeFarcaster();
    
    // Get context first to get FID
    const context = await sdk.context;
    const fid = context.user?.fid || 0;
    
    // Request ethereum provider for wallet address
    const provider = await sdk.wallet.ethProvider.request({
      method: "eth_requestAccounts",
    });
    
    if (!provider || !Array.isArray(provider) || provider.length === 0) {
      console.error("No accounts returned");
      return null;
    }
    
    const address = provider[0] as string;
    
    return {
      address,
      fid,
    };
  } catch (error) {
    console.error("Failed to sign in:", error);
    return null;
  }
}

export async function addToMiniApps() {
  try {
    await sdk.actions.addFrame();
    console.log("Added to Mini Apps");
  } catch (error) {
    console.error("Failed to add to Mini Apps:", error);
  }
}

export async function sendTipToCreator() {
  try {
    const provider = sdk.wallet.ethProvider;
    
    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          to: "0xEcAb7178c118Ee4A664420F510253511539F07A5",
          value: "0x10c388d00000", // 0.0003 ETH in hex
          chainId: "0x2105", // Base chain (8453 in hex)
        },
      ],
    });
    
    console.log("Tip sent:", txHash);
    return txHash;
  } catch (error) {
    console.error("Failed to send tip:", error);
    return null;
  }
}

export async function openUrl(url: string) {
  try {
    await sdk.actions.openUrl(url);
  } catch (error) {
    console.error("Failed to open URL:", error);
  }
}
