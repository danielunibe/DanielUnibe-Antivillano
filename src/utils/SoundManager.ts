import { ASSETS } from '../config/assets';

type SoundKey = keyof typeof ASSETS.SOUNDS;

// Howler is heavy and only needed for 4 short SFX; load it on demand so it
// never ships in the initial bundle.
type HowlerModule = typeof import('howler');

let howlerPromise: Promise<HowlerModule> | null = null;
const getHowler = (): Promise<HowlerModule> => {
    if (!howlerPromise) howlerPromise = import('howler');
    return howlerPromise;
};

const SOUND_OPTIONS: Record<SoundKey, { volume: number; rateVariance?: number; cooldownMs: number }> = {
    HOVER: { volume: 0.08, rateVariance: 0.035, cooldownMs: 90 },
    CLICK: { volume: 0.16, rateVariance: 0.02, cooldownMs: 35 },
    OPEN: { volume: 0.18, rateVariance: 0.015, cooldownMs: 120 },
    EQUIP: { volume: 0.14, rateVariance: 0.02, cooldownMs: 90 },
};

class SoundManager {
    private sounds: Partial<Record<SoundKey, import('howler').Howl>> = {};
    private lastPlayedAt: Partial<Record<SoundKey, number>> = {};
    private initialized: boolean = false;
    private enabled: boolean = true;
    private howlerReady: Promise<HowlerModule> | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.howlerReady = this.init();
            this.bindUnlock();
        }
    }

    private async init(): Promise<HowlerModule> {
        const howler = await getHowler();
        const { Howl, Howler } = howler;
        Howler.volume(0.82);
        this.preloadSounds(Howl);
        return howler;
    }

    private preloadSounds(Howl: HowlerModule['Howl']) {
        Object.entries(ASSETS.SOUNDS).forEach(([key, src]) => {
            const soundKey = key as SoundKey;
            const options = SOUND_OPTIONS[soundKey];

            this.sounds[soundKey] = new Howl({
                src: [src],
                volume: options.volume,
                preload: true,
                pool: soundKey === 'HOVER' ? 4 : 3,
                html5: false,
                onloaderror: () => {
                    // Silencioso intencionalmente: un asset de sonido no debe romper la app.
                },
                onplayerror: (_id, _error) => {
                    this.sounds[soundKey]?.once('unlock', () => {
                        this.play(soundKey);
                    });
                },
            });
        });
    }

    private bindUnlock() {
        const unlock = () => {
            if (this.initialized) return;
            this.initialized = true;
            this.howlerReady?.then(({ Howler }) => Howler.ctx?.resume?.().catch(() => undefined));
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };

        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
    }

    private getSubtleRate(key: SoundKey) {
        const variance = SOUND_OPTIONS[key].rateVariance ?? 0;
        if (!variance) return 1;
        return 1 + (Math.random() * variance * 2 - variance);
    }

    public play(key: SoundKey) {
        if (typeof window === 'undefined' || !this.enabled) return;

        const sound = this.sounds[key];
        if (!sound) return;

        const now = performance.now();
        const cooldownMs = SOUND_OPTIONS[key].cooldownMs;
        if (now - (this.lastPlayedAt[key] ?? 0) < cooldownMs) return;

        this.lastPlayedAt[key] = now;
        sound.rate(this.getSubtleRate(key));
        sound.play();
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (typeof window !== 'undefined') {
            this.howlerReady?.then(({ Howler }) => Howler.mute(!enabled));
        }
    }
}

export const sfx = new SoundManager();