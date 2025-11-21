# NNN Survivor NFT - Farcaster Mini App Setup

## 🎯 What's Built

A fully compliant Farcaster Mini App for minting limited edition "No Nut November Survivor" NFTs:

- ✅ **Farcaster SDK Integration**: Full Mini App support with ready(), signIn(), addFrame()
- ✅ **Free NFT Minting**: 69-supply limited edition on Base chain
- ✅ **Wallet Integration**: Uses Farcaster wallet (no MetaMask/external wallets)
- ✅ **Database**: Tracks mints and enforces one-per-wallet
- ✅ **Dark Brutalist Design**: Black background with gold accents
- ✅ **Backend API**: Mint endpoint with supply validation
- ✅ **Share & Viral Features**: Built-in sharing to Warpcast

## 🏗️ Architecture

### Frontend
- **React + TypeScript + Vite**
- **Farcaster Frame SDK**: `@farcaster/frame-sdk`
- **Tailwind CSS**: Custom design system with gold/black theme
- **Viem**: Ethereum interactions

### Backend (Lovable Cloud)
- **Database**: PostgreSQL table tracking mints
- **Edge Function**: `/functions/v1/mint-nnn` for minting
- **RLS Policies**: Public read/write for mint table

### Smart Contract (To Deploy)
- **ERC-721** on Base chain
- **69 total supply**
- **Owner-only minting**
- See `CONTRACT_DEPLOYMENT.md` for details

## 📋 Next Steps

### 1. Test the Mini App Locally

The app is ready to test! Try:
- Click "MINT FREE NFT" to test wallet connection
- Use "Add" to test addFrame()
- Use "Share" to test URL opening
- Use "Tip" to test ETH transactions

### 2. Deploy Smart Contract

Follow `CONTRACT_DEPLOYMENT.md` to:
1. Deploy ERC-721 contract to Base
2. Upload NFT metadata to IPFS
3. Save contract address

### 3. Update Mint Integration

Once contract is deployed, update `supabase/functions/mint-nnn/index.ts`:
- Add contract interaction using viem
- Call `mint(address)` on-chain
- Store transaction hash in database

Example integration:
\`\`\`typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(Deno.env.get('PRIVATE_KEY') as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http()
});

// Call mint function
const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'mint',
  args: [walletAddress]
});
\`\`\`

### 4. Configure Farcaster Manifest

After deployment:

1. **Get your deployed URL** (e.g., `https://yourapp.lovable.app`)

2. **Create Hosted Manifest** at https://warpcast.com/~/developers/frames
   - Fill in your app details
   - Use your NFT image URL
   - Set button action to launch Mini App
   - Get the hosted manifest URL

3. **Set up 307 redirect**:
   Update your hosting to redirect `/.well-known/farcaster.json` to the hosted manifest URL

   For Lovable deployments, you may need to contact support or manually configure this redirect.

### 5. Update Meta Tags

Once deployed, update `index.html` with your actual URLs:
- Replace placeholder image URLs with your deployed images
- Update domain references
- Ensure all URLs point to your production domain

### 6. Submit for Review

1. Go to https://warpcast.com/~/developers/frames
2. Submit your Mini App
3. Include:
   - App name: "NNN Survivor NFT"
   - Description: "Mint your free limited edition NFT. Only the disciplined survive."
   - Category: "NFT" or "Collectibles"

## 🔑 Required Secrets

Add these via Lovable Cloud secrets manager:

- `CONTRACT_ADDRESS`: Deployed NFT contract address
- `PRIVATE_KEY`: Owner wallet private key for minting (keep secure!)

## 🎨 Design System

The app uses a custom brutalist design:

- **Colors**: Black (#0a0a0a) background, Gold (#ffc107) accents
- **Typography**: Bold, tracking-tight headings
- **Shadows**: Gold glow effects, brutal shadows
- **Animations**: Slide-up entrance, gold pulse

Customize in:
- `src/index.css` - Design tokens
- `tailwind.config.ts` - Theme extensions

## 📱 Testing in Warpcast

Once deployed and approved:

1. Share your Mini App URL in a cast
2. The frame preview will show your NFT
3. Users click "Mint Survivor NFT" button
4. Mini App opens inline in Warpcast
5. Users connect wallet and mint

## 🛡️ Security Notes

- ✅ RLS policies enabled (public access for mints)
- ✅ One mint per wallet enforced
- ✅ Supply cap enforced (69 max)
- ✅ Input validation on wallet addresses
- ⚠️ Private key stored in secrets (never commit!)

## 🐛 Troubleshooting

### "SDK not loaded"
- Ensure you're testing in Warpcast or using the Frame emulator
- SDK only works in Farcaster context

### "Transaction failed"
- Check user has enough ETH for gas on Base
- Verify contract is deployed and accessible
- Check owner wallet has permission to mint

### "Already minted"
- Database correctly enforcing one-per-wallet
- User can check their wallet on BaseScan

## 📚 Resources

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/)
- [Base Network Docs](https://docs.base.org)
- [Viem Documentation](https://viem.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

## 🚀 Deployment Checklist

- [ ] Test locally with all features
- [ ] Deploy smart contract to Base
- [ ] Upload metadata to IPFS
- [ ] Update mint function with contract interaction
- [ ] Add contract address to secrets
- [ ] Deploy frontend to production
- [ ] Update meta tags with production URLs
- [ ] Create hosted manifest
- [ ] Configure redirect for farcaster.json
- [ ] Test in Warpcast Frame Emulator
- [ ] Submit for Farcaster review
- [ ] Share your Mini App! 🎉
