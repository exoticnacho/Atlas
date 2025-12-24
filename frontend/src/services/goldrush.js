import { GoldRushClient } from "@covalenthq/client-sdk";

const GOLDRUSH_API_KEY = process.env.NEXT_PUBLIC_GOLDRUSH_API_KEY;
const MANTLE_MAINNET_CHAIN_ID = '5000';
const MANTLE_SEPOLIA_CHAIN_ID = '5003';

// Initialize client only if API key exists
let client = null;
if (GOLDRUSH_API_KEY) {
    client = new GoldRushClient(GOLDRUSH_API_KEY);
}

/**
 * Get NFT holdings for a wallet address
 * Falls back to mock data on Sepolia or if API fails
 */
export async function getNFTHoldings(walletAddress, chainId) {
    // Check if we're on Mantle Mainnet and have API key
    if (chainId === MANTLE_MAINNET_CHAIN_ID && client) {
        try {
            const resp = await client.NftService.getNftsForAddress({
                chainName: "mantle-mainnet",
                walletAddress: walletAddress
            });

            if (resp.data && resp.data.items) {
                return resp.data.items.map(nft => ({
                    name: nft.contract_name || 'Unknown Collection',
                    contract: nft.contract_address,
                    floorPrice: nft.floor_price_quote || 0,
                    count: nft.balance || 1,
                    imageUrl: nft.nft_data?.[0]?.external_data?.image || null
                }));
            }
        } catch (error) {
            console.warn('GoldRush API failed, using mock data:', error);
        }
    }

    // Fallback to mock data for Sepolia or on error
    return getMockNFTData();
}

/**
 * Get token balances and portfolio value
 * Falls back to mock data on Sepolia or if API fails
 */
export async function getPortfolioData(walletAddress, chainId) {
    if (chainId === MANTLE_MAINNET_CHAIN_ID && client) {
        try {
            const resp = await client.BalanceService.getTokenBalancesForWalletAddress({
                chainName: "mantle-mainnet",
                walletAddress: walletAddress
            });

            if (resp.data && resp.data.items) {
                const tokens = resp.data.items
                    .filter(token => token.balance > 0)
                    .map(token => ({
                        symbol: token.contract_ticker_symbol,
                        balance: token.balance / Math.pow(10, token.contract_decimals),
                        usdValue: token.quote || 0,
                        logo: token.logo_url
                    }));

                const totalValue = tokens.reduce((sum, t) => sum + t.usdValue, 0);

                return { tokens, totalValue };
            }
        } catch (error) {
            console.warn('GoldRush API failed, using mock data:', error);
        }
    }

    // Fallback to mock data
    return getMockPortfolioData();
}

/**
 * Get historical portfolio value
 */
export async function getPortfolioHistory(walletAddress, chainId, days = 30) {
    if (chainId === MANTLE_MAINNET_CHAIN_ID && client) {
        try {
            const resp = await client.BalanceService.getHistoricalPortfolioValueOverTime({
                chainName: "mantle-mainnet",
                walletAddress: walletAddress,
                days: days
            });

            if (resp.data && resp.data.items) {
                return resp.data.items.map(item => ({
                    date: item.timestamp,
                    value: item.quote || 0
                }));
            }
        } catch (error) {
            console.warn('GoldRush API failed, using mock data:', error);
        }
    }

    return getMockHistoricalData(days);
}

// Mock data generators
function getMockNFTData() {
    return [
        {
            name: 'Mantle Punks',
            contract: '0x1234...5678',
            floorPrice: 0.5,
            count: 3,
            imageUrl: null
        },
        {
            name: 'Mantle Apes',
            contract: '0x8765...4321',
            floorPrice: 1.2,
            count: 2,
            imageUrl: null
        },
        {
            name: 'Mantle Doodles',
            contract: '0xabcd...efgh',
            floorPrice: 0.8,
            count: 1,
            imageUrl: null
        }
    ];
}

function getMockPortfolioData() {
    return {
        tokens: [
            { symbol: 'MNT', balance: 1250, usdValue: 2500, logo: null },
            { symbol: 'USDT', balance: 5000, usdValue: 5000, logo: null },
            { symbol: 'WETH', balance: 2.5, usdValue: 6250, logo: null }
        ],
        totalValue: 13750
    };
}

function getMockHistoricalData(days) {
    const data = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = days; i >= 0; i--) {
        data.push({
            date: new Date(now - (i * dayMs)).toISOString(),
            value: 10000 + Math.random() * 5000
        });
    }

    return data;
}

export const SUPPORTED_NETWORKS = {
    MANTLE_MAINNET: {
        chainId: MANTLE_MAINNET_CHAIN_ID,
        name: 'Mantle Mainnet',
        hasRealData: true
    },
    MANTLE_SEPOLIA: {
        chainId: MANTLE_SEPOLIA_CHAIN_ID,
        name: 'Mantle Sepolia',
        hasRealData: false
    }
};
