import { ParticleNetwork } from '@particle-network/auth';
import { MantleSepoliaTestnet } from '@particle-network/chains';

const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID;
const PARTICLE_CLIENT_KEY = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY;
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID;

let particle = null;

export function getParticle() {
    if (typeof window === 'undefined') return null;

    if (!particle && PARTICLE_PROJECT_ID && PARTICLE_CLIENT_KEY && PARTICLE_APP_ID) {
        particle = new ParticleNetwork({
            projectId: PARTICLE_PROJECT_ID,
            clientKey: PARTICLE_CLIENT_KEY,
            appId: PARTICLE_APP_ID,
            chainName: MantleSepoliaTestnet.name, // Support standard
            chainId: MantleSepoliaTestnet.id,
            wallet: {
                displayWalletEntry: true, // Show floating wallet entry
                defaultWalletEntryPosition: 'bottom-right',
                uiMode: 'dark',
                supportChains: [MantleSepoliaTestnet],
            },
            securityAccount: {
                promptSettingWhenSign: 1,
                promptMasterPasswordSettingWhenLogin: 1
            },
        });
    }

    return particle;
}

export const socialLoginOptions = {
    preferredAuthModes: ['google', 'twitter', 'email', 'discord', 'github']
};
