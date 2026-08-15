
import { ASSETS } from '../config/assets';
import { Howl, Howler } from 'howler';

type SoundKey = keyof typeof ASSETS.SOUNDS;

const SOUND_OPTIONS: Record<SoundKey, { volume: number; rateVariance?: number; cooldownMs: number }> = {
    HOVER: { volume: 0.08, rateVariance: 0.035, cooldownMs: 90 },
    CLICK: { volume: 0.16, rateVariance: 0.02, cooldownMs: 35 },
    OPEN: { volume: 0.18, rateVariance: 0.015, cooldownMs: 120 },
    EQUIP: { volume: 0.14, rateVariance: 0.02, cooldownMs: 90 },
};

class SoundManager {
    private sounds: Partial<Record<SoundKey, Howl>> = {};
    private lastPlayedAt: Partial<Record<SoundKey, number>> = {};
    private initialized: boolean = false;
    private enabled: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            Howler.volume(0.82);
            this.preloadSounds();
            this.bindUnlock();
        }
    }

    private preloadSounds() {
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
            Howler.ctx?.resume?.().catch(() => undefined);
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
        if (typeof window !== 'undefined') Howler.mute(!enabled);
    }
}

export const sfx = new SoundManager();
