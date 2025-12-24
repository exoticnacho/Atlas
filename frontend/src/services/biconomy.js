import { createMeeClient, toMultichainNexusAccount } from "@biconomy/abstractjs";
import { createWalletClient, custom } from "viem";
import { mantleSepoliaTestnet, mantle } from "viem/chains";

const BICONOMY_API_KEY = process.env.NEXT_PUBLIC_BICONOMY_API_KEY;

// Chain configuration
const activeChain = mantleSepoliaTestnet; // Use Sepolia for dev/hackathon

/**
 * Initialize Biconomy Client and Nexus Account
 * @param {Object} walletProvider - Window.ethereum or similar provider
 * @returns {Object} { meeClient, nexusAccount, accountAddress }
 */
export async function setupBiconomy(walletProvider) {
    if (!BICONOMY_API_KEY) {
        throw new Error("Biconomy API Key not found");
    }

    // 1. Create Viem Wallet Client from user's wallet (MetaMask)
    const walletClient = createWalletClient({
        chain: activeChain,
        transport: custom(walletProvider),
    });

    const [eoaAddress] = await walletClient.getAddresses();
    if (!eoaAddress) throw new Error("No wallet connected");

    console.log("Biconomy: Setting up for EOA:", eoaAddress);

    // 2. Create Nexus Account (Smart Account)
    const nexusAccount = await toMultichainNexusAccount({
        chain: activeChain,
        signer: walletClient,
    });

    const accountAddress = await nexusAccount.getAccountAddress();
    console.log("Biconomy: Smart Account Address:", accountAddress);

    // 3. Create Mee Client (Modular Execution Environment)
    const meeClient = await createMeeClient({
        account: nexusAccount,
        apiKey: BICONOMY_API_KEY,
    });

    return { meeClient, nexusAccount, accountAddress };
}

/**
 * Execute a Gasless Transaction
 * @param {Object} meeClient - Initialized Mee Client
 * @param {string} to - Recipient/Target Address
 * @param {string} value - Amount in Wei (as string or bigint)
 * @param {string} data - Calldata
 * @returns {Promise<string>} Transaction Hash
 */
export async function sendGaslessTransaction(meeClient, to, value, data = "0x") {
    console.log("Biconomy: Preparing gasless tx to", to);

    // 1. Get Quote with Sponsorship
    try {
        const quote = await meeClient.getQuote({
            sponsorship: true, // Enable gas sponsorship!
            instructions: [
                {
                    calls: [
                        {
                            to: to,
                            value: BigInt(value),
                            data: data,
                        },
                    ],
                },
            ],
        });

        console.log("Biconomy: Quote received", quote);

        // 2. Execute Transaction
        const { hash } = await meeClient.execute({ quote });

        console.log("Biconomy: Execution submitted, Hash:", hash);
        return hash;

    } catch (error) {
        console.error("Biconomy: Gasless tx failed:", error);
        throw error;
    }
}
