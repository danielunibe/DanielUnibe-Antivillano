import { useEffect } from 'react';

export const useBarrelSmokeEffect = (canvas: HTMLCanvasElement | null) => {
  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const config = { width: 500, height: 700, spawnPoint: { x: 250, y: 450 }, gasRadius: 65, density: 7, spawnDelay: 20, velocity: 4.2, direction: 0, directionSpread: 50 };
    const state = { gas: [] as any[], gasPool: [] as any[], flameGradientSprites: [] as HTMLCanvasElement[], lastTime: performance.now(), spawnTimer: 0 };
    canvas.width = config.width;
    canvas.height = config.height;

    const toRad = Math.PI / 180;
    const interpolate = (start: number, end: number, pos: number) => (end - start) * pos + start;
    const rgba = (c: any) => `rgba(${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0},${c.a ?? 1})`;

    const makeSprite = (drawFn: (spriteCtx: CanvasRenderingContext2D, w: number, h: number) => void) => {
      const sprite = document.createElement('canvas');
      const dim = Math.floor(config.gasRadius * 2.5);
      sprite.width = dim;
      sprite.height = dim;
      const spriteCtx = sprite.getContext('2d');
      if (!spriteCtx) return null;
      drawFn(spriteCtx, dim, dim);
      return sprite;
    };

    const generateFlameGradients = () => {
      const totalFrames = 120;
      const keyframes: any[] = [
        { position: 0, start: { radius: 0.1, r: 1, g: 1, b: 0.8, a: 1 }, end: { radius: 0.3, a: 0 } },
        { position: 0.15, start: { radius: 0.15, r: 1, g: 0.9, b: 0.2, a: 0.95 }, end: { radius: 0.5, a: 0 } },
        { position: 0.4, start: { radius: 0.2, r: 1, g: 0.5, b: 0.0, a: 0.8 }, middle: { radius: 0.5, r: 0.9, g: 0.3, b: 0.0, a: 0.6 }, end: { radius: 0.8, a: 0 } },
        { position: 0.7, start: { radius: 0.25, r: 0.8, g: 0.1, b: 0.0, a: 0.5 }, middle: { radius: 0.6, r: 0.5, g: 0.1, b: 0.0, a: 0.4 }, end: { radius: 1, a: 0 } },
        { position: 1, start: { radius: 0.3, r: 0.2, g: 0.2, b: 0.2, a: 0 }, end: { radius: 1.2, a: 0 } }
      ];

      keyframes.forEach((k) => {
        if (!k.middle) k.middle = { ...k.start };
        ['radius', 'r', 'g', 'b', 'a'].forEach((p) => {
          k.middle[p] = k.middle[p] ?? k.start[p] ?? 0;
          k.end[p] = k.end[p] ?? k.middle[p] ?? 0;
        });
      });

      for (let i = 1; i < keyframes.length; i += 1) {
        const prev = keyframes[i - 1];
        const next = keyframes[i];
        const batchSize = Math.floor((next.position - prev.position) * totalFrames);
        for (let j = 1; j <= batchSize; j += 1) {
          const mult = j / batchSize;
          const frame: any = {};
          ['start', 'middle', 'end'].forEach((k) => {
            frame[k] = {};
            ['radius', 'r', 'g', 'b', 'a'].forEach((prop) => {
              frame[k][prop] = interpolate(prev[k]?.[prop] ?? 0, next[k]?.[prop] ?? 0, mult);
            });
          });

          const sprite = makeSprite((spriteCtx, w, h) => {
              const center = w / 2;
              const grad = spriteCtx.createRadialGradient(center, center, 0, center, center, center);
              grad.addColorStop(frame.start.radius, rgba(frame.start));
              if (frame.middle.radius > frame.start.radius) grad.addColorStop(frame.middle.radius, rgba(frame.middle));
              grad.addColorStop(frame.end.radius, rgba(frame.end));
              spriteCtx.fillStyle = grad;
              spriteCtx.fillRect(0, 0, w, h);
            });
          if (sprite) state.flameGradientSprites.push(sprite);
        }
      }
    };

    const spawnParticle = () => {
      const angle = (config.direction - config.directionSpread / 2) * toRad;
      const spread = (config.directionSpread * toRad) / config.density;
      for (let i = 0; i < config.density; i += 1) {
        const p = state.gasPool.pop() || { x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, size: 0, rotSpeed: 0 };
        const subAngle = angle + spread * i + (Math.random() - 0.5) * spread;
        const speed = config.velocity * (0.8 + Math.random() * 0.4);
        const r = Math.random() * config.gasRadius;
        const theta = Math.random() * Math.PI * 2;
        p.x = config.spawnPoint.x + r * Math.cos(theta);
        p.y = config.spawnPoint.y + r * 0.4 * Math.sin(theta);
        p.vx = Math.sin(subAngle) * speed * 0.5;
        p.vy = -Math.cos(subAngle) * speed;
        p.age = 0;
        p.life = Math.random() * 1000 + 1500;
        p.size = config.gasRadius * (0.5 + Math.random() * 0.5);
        p.rotSpeed = (Math.random() - 0.5) * 0.05;
        state.gas.push(p);
      }
    };

    const tick = () => {
      const now = performance.now();
      const delta = Math.min(now - state.lastTime, 50);
      state.lastTime = now;
      const simSpeed = delta / 16.67;
      state.spawnTimer += delta;
      while (state.spawnTimer >= config.spawnDelay) {
        state.spawnTimer -= config.spawnDelay;
        spawnParticle();
      }

      for (let i = state.gas.length - 1; i >= 0; i -= 1) {
        const p = state.gas[i];
        p.age += delta;
        p.x += p.vx * simSpeed;
        p.y += p.vy * simSpeed;
        p.vx *= 0.98;
        p.vy = p.vy * 0.98 - 0.02 * simSpeed;
        p.size += 0.25 * simSpeed;
        if (p.age >= p.life) {
          state.gas.splice(i, 1);
          state.gasPool.push(p);
        }
      }

      ctx.clearRect(0, 0, config.width, config.height);
      const sprites = state.flameGradientSprites;
      const spriteCount = sprites.length;
      if (spriteCount === 0) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      for (let pass = 0; pass < 2; pass += 1) {
        ctx.globalCompositeOperation = pass === 0 ? 'lighter' : 'source-over';
        state.gas.forEach((p) => {
          if (p.life <= 0) return;
          const lifeProgress = p.age / p.life;
          if ((pass === 0 && lifeProgress >= 0.5) || (pass === 1 && lifeProgress < 0.5)) return;
          const spriteIndex = Math.max(0, Math.min(Math.floor(lifeProgress * (spriteCount - 1)), spriteCount - 1));
          const sprite = sprites[spriteIndex];
          if (!sprite) return;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.drawImage(sprite, -p.size, -p.size, p.size * 2, p.size * 2);
          ctx.restore();
        });
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    generateFlameGradients();
    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      state.gas.length = 0;
      state.gasPool.length = 0;
      state.flameGradientSprites.length = 0;
    };
  }, [canvas]);
};
