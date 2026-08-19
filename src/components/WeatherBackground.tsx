import { useEffect, useRef } from 'react';
import type { ConditionFamily } from '../lib/weatherCodes';

interface Props {
  family: ConditionFamily;
  isDay: boolean;
}

interface RainDrop { x: number; y: number; len: number; speed: number; opacity: number }
interface SnowFlake { x: number; y: number; r: number; speed: number; drift: number; phase: number }
interface CloudPuff { x: number; y: number; scale: number; speed: number; opacity: number }
interface Star { x: number; y: number; r: number; phase: number }

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function WeatherBackground({ family, isDay }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const particles: { rain: RainDrop[]; snow: SnowFlake[]; clouds: CloudPuff[]; stars: Star[] } = {
      rain: [], snow: [], clouds: [], stars: [],
    };
    const lightning = { flashOpacity: 0, nextFlash: performance.now() + rand(2000, 5000) };

    function initParticles() {
      const w = canvas!.width;
      const h = canvas!.height;
      const density = Math.min(1, w / 1400);
      particles.rain = [];
      particles.snow = [];
      particles.clouds = [];
      particles.stars = [];

      if (family === 'rain' || family === 'storm') {
        const count = Math.round((family === 'storm' ? 170 : 120) * density);
        for (let i = 0; i < count; i++) {
          particles.rain.push({
            x: rand(0, w), y: rand(0, h),
            len: rand(10, 22), speed: rand(9, 16), opacity: rand(0.15, 0.45),
          });
        }
      }

      if (family === 'snow') {
        const count = Math.round(90 * density);
        for (let i = 0; i < count; i++) {
          particles.snow.push({
            x: rand(0, w), y: rand(0, h), r: rand(1.5, 4),
            speed: rand(0.6, 1.8), drift: rand(0.3, 1.2), phase: rand(0, Math.PI * 2),
          });
        }
      }

      if (family === 'cloudy' || family === 'fog' || family === 'rain' || family === 'storm') {
        const count = family === 'fog' ? 0 : Math.round(6 * density) + 3;
        for (let i = 0; i < count; i++) {
          particles.clouds.push({
            x: rand(-200, w + 200), y: rand(h * 0.05, h * 0.32),
            scale: rand(0.7, 1.8), speed: rand(0.08, 0.3), opacity: rand(0.08, 0.2),
          });
        }
      }

      if (!isDay) {
        const count = Math.round(110 * density);
        for (let i = 0; i < count; i++) {
          particles.stars.push({ x: rand(0, w), y: rand(0, h * 0.65), r: rand(0.5, 1.6), phase: rand(0, Math.PI * 2) });
        }
      }
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initParticles();
    }
    resize();
    window.addEventListener('resize', resize);

    function drawStars(t: number) {
      ctx!.save();
      for (const s of particles.stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t / 800 + s.phase);
        ctx!.globalAlpha = 0.3 + twinkle * 0.5;
        ctx!.fillStyle = '#FFFFFF';
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawMoon() {
      const mx = canvas!.width * 0.82;
      const my = canvas!.height * 0.16;
      ctx!.save();
      const glow = ctx!.createRadialGradient(mx, my, 2, mx, my, 60);
      glow.addColorStop(0, 'rgba(230,235,245,0.85)');
      glow.addColorStop(1, 'rgba(230,235,245,0)');
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(mx, my, 60, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = 'rgba(240,242,248,0.95)';
      ctx!.beginPath();
      ctx!.arc(mx, my, 22, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawSun(t: number) {
      const sx = canvas!.width * 0.82;
      const sy = canvas!.height * 0.16;
      ctx!.save();
      const glow = ctx!.createRadialGradient(sx, sy, 4, sx, sy, 140);
      glow.addColorStop(0, 'rgba(255,214,120,0.5)');
      glow.addColorStop(1, 'rgba(255,214,120,0)');
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(sx, sy, 140, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.translate(sx, sy);
      ctx!.rotate(t / 40000);
      ctx!.strokeStyle = 'rgba(255,214,120,0.28)';
      ctx!.lineWidth = 2;
      const rays = 12;
      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2;
        ctx!.beginPath();
        ctx!.moveTo(Math.cos(angle) * 34, Math.sin(angle) * 34);
        ctx!.lineTo(Math.cos(angle) * 68, Math.sin(angle) * 68);
        ctx!.stroke();
      }
      ctx!.restore();

      ctx!.save();
      ctx!.fillStyle = 'rgba(255,224,150,0.95)';
      ctx!.beginPath();
      ctx!.arc(sx, sy, 26, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawClouds(dt: number) {
      const w = canvas!.width;
      const puffs: [number, number, number][] = [
        [0, 0, 55], [40, -10, 45], [-40, -8, 42], [15, 12, 50], [-20, 14, 46],
      ];
      for (const c of particles.clouds) {
        c.x += c.speed * dt * 0.06;
        if (c.x > w + 220) c.x = -220;
        ctx!.save();
        ctx!.globalAlpha = c.opacity;
        ctx!.fillStyle = isDay ? '#FFFFFF' : '#AEB8C8';
        ctx!.filter = 'blur(18px)';
        for (const [dx, dy, r] of puffs) {
          ctx!.beginPath();
          ctx!.ellipse(c.x + dx * c.scale, c.y + dy * c.scale, r * c.scale, r * c.scale * 0.6, 0, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      }
    }

    function drawFog(t: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.save();
      for (let i = 0; i < 4; i++) {
        const y = h * (0.28 + i * 0.18);
        const offset = ((t / 30000) * w + i * 300) % (w + 400) - 200;
        const grad = ctx!.createLinearGradient(offset - 200, 0, offset + 400, 0);
        grad.addColorStop(0, 'rgba(210,215,222,0)');
        grad.addColorStop(0.5, `rgba(210,215,222,${isDay ? 0.16 : 0.09})`);
        grad.addColorStop(1, 'rgba(210,215,222,0)');
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, y, w, 90);
      }
      ctx!.restore();
    }

    function drawRain(dt: number) {
      const h = canvas!.height;
      const w = canvas!.width;
      ctx!.save();
      ctx!.strokeStyle = isDay ? 'rgba(190,205,225,0.55)' : 'rgba(150,170,205,0.4)';
      ctx!.lineWidth = 1.2;
      for (const d of particles.rain) {
        d.y += d.speed * dt * 0.09;
        d.x -= d.speed * dt * 0.02;
        if (d.y > h) { d.y = -20; d.x = Math.random() * w; }
        ctx!.globalAlpha = d.opacity;
        ctx!.beginPath();
        ctx!.moveTo(d.x, d.y);
        ctx!.lineTo(d.x - 3, d.y + d.len);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawSnow(dt: number) {
      const h = canvas!.height;
      const w = canvas!.width;
      ctx!.save();
      ctx!.fillStyle = '#FFFFFF';
      for (const s of particles.snow) {
        s.y += s.speed * dt * 0.06;
        s.x += Math.sin(s.phase + s.y / 60) * s.drift * 0.3;
        if (s.y > h) { s.y = -10; s.x = Math.random() * w; }
        ctx!.globalAlpha = 0.75;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function maybeFlashLightning(t: number, dt: number) {
      if (t > lightning.nextFlash) {
        lightning.flashOpacity = rand(0.12, 0.22);
        lightning.nextFlash = t + rand(3500, 9000);
      }
      if (lightning.flashOpacity > 0) {
        ctx!.save();
        ctx!.globalAlpha = lightning.flashOpacity;
        ctx!.fillStyle = '#EDEFFF';
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        ctx!.restore();
        lightning.flashOpacity -= dt * 0.006;
        if (lightning.flashOpacity < 0) lightning.flashOpacity = 0;
      }
    }

    let lastTime = performance.now();
    function frame(t: number) {
      const dt = Math.min(t - lastTime, 48);
      lastTime = t;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      if (!isDay) drawStars(t);
      if (isDay && family === 'clear') drawSun(t);
      if (!isDay && family === 'clear') drawMoon();

      if (family === 'cloudy' || family === 'rain' || family === 'storm') drawClouds(dt);
      if (family === 'fog') drawFog(t);
      if (family === 'rain' || family === 'storm') drawRain(dt);
      if (family === 'snow') drawSnow(dt);
      if (family === 'storm') maybeFlashLightning(t, dt);

      animRef.current = requestAnimationFrame(frame);
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else if (!reduceMotion) {
        lastTime = performance.now();
        animRef.current = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    if (reduceMotion) {
      frame(performance.now());
      cancelAnimationFrame(animRef.current);
    } else {
      animRef.current = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [family, isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
      style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      aria-hidden="true"
    />
  );
}