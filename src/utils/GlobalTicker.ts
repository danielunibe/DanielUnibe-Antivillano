
type TickerCallback = (time: number, deltaTime: number, frame: number) => void;

class GlobalTicker {
    private callbacks: Set<TickerCallback> = new Set();
    private frameId: number | null = null;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private isRunning: boolean = false;

    constructor() {
        // Bind context
        this.tick = this.tick.bind(this);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else if (this.callbacks.size > 0 && !this.isRunning) {
                this.start();
            }
        });
    }

    public add(callback: TickerCallback) {
        this.callbacks.add(callback);
        if (!this.isRunning && this.callbacks.size > 0) {
            this.start();
        }
    }

    public remove(callback: TickerCallback) {
        this.callbacks.delete(callback);
        if (this.isRunning && this.callbacks.size === 0) {
            this.stop();
        }
    }

    private start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.tick();
    }

    private stop() {
        this.isRunning = false;
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    private tick() {
        if (!this.isRunning) return;

        const now = performance.now();
        // Limit delta to 100ms to prevent huge jumps if tab was inactive
        const delta = Math.min((now - this.lastTime) / 1000, 0.1); 
        this.lastTime = now;
        this.frameCount++;

        // Execute all subscribers safely: one bad callback should not kill the whole loop.
        this.callbacks.forEach((cb) => {
            try {
                cb(now / 1000, delta, this.frameCount);
            } catch (error) {
                console.error('Ticker callback crashed and was removed:', error);
                this.callbacks.delete(cb);
            }
        });

        this.frameId = requestAnimationFrame(this.tick);
    }
}

// Export singleton
export const Ticker = new GlobalTicker();
