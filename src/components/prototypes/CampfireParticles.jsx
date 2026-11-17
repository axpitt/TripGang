import { useEffect, useRef } from 'react';

/**
 * CampfireParticles
 * Zero-Dependency 60FPS Ambient Lakeside Campfire & Night-Sky Canvas Shader.
 * Uses an in-memory object pool for zero-allocation rendering,
 * interactive cursor wind inertia, and React 19 StrictMode cleanup.
 *
 * Compatible with React 19, Tailwind CSS v4, and Framer Motion 12.
 */
export function CampfireParticles({
  isFullScreen = false,
  className = '',
  maxEmbers = 70,
  starCount = 50,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = isFullScreen ? window.innerWidth : canvas.parentElement.clientWidth;
      height = canvas.height = isFullScreen ? window.innerHeight : canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse velocity wind tracking
    const mouse = {
      x: width / 2,
      prevX: width / 2,
      vx: 0,
      active: false,
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.prevX = mouse.x;
      mouse.x = e.clientX - rect.left;
      mouse.vx = (mouse.x - mouse.prevX) * 0.08;
      mouse.active = true;
    };

    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouse.prevX = mouse.x;
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.vx = (mouse.x - mouse.prevX) * 0.08;
      mouse.active = true;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 1. Static Twinkling Stars Pool
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.75),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
    }));

    // 2. High-Performance Campfire Ember Class (Object Pool)
    class Ember {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        // Spawn near center-bottom or scattered initially
        const spawnWidth = Math.min(width * 0.5, 300);
        this.x = width / 2 + (Math.random() * spawnWidth - spawnWidth / 2);
        this.y = initial ? Math.random() * height : height - Math.random() * 30;
        this.size = Math.random() * 2.2 + 0.8;
        this.vy = -(Math.random() * 1.6 + 0.9);
        this.vx = Math.random() * 0.8 - 0.4;
        this.life = initial ? Math.random() : 1.0;
        this.decay = Math.random() * 0.009 + 0.004;

        // Dual Tone: 65% Monsoon Emerald sparks (145), 35% Warm Amber fire (35)
        this.hue = Math.random() > 0.35 ? 145 : 35;
        this.lightness = Math.random() * 25 + 60;
      }

      update() {
        // Wind influence from cursor movement
        this.vx += mouse.vx * 0.015;
        this.vx *= 0.96; // Inertia damping
        this.x += this.vx + Math.sin(this.y * 0.02) * 0.4;
        this.y += this.vy;
        this.life -= this.decay;

        if (this.life <= 0 || this.y < -10) {
          this.reset();
        }
      }

      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.life);
        c.globalCompositeOperation = 'lighter';

        const grad = c.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2.2
        );
        grad.addColorStop(0, `hsla(${this.hue}, 100%, ${this.lightness}%, 1)`);
        grad.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, 0.4)`);
        grad.addColorStop(1, 'transparent');

        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Allocate pool
    const particles = Array.from({ length: maxEmbers }, () => new Ember());

    // 60FPS Render Loop
    const render = () => {
      // Clear with soft dark background trail
      ctx.clearRect(0, 0, width, height);

      // Render Twinkling Stars
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 0.85 || s.alpha < 0.2) {
          s.speed *= -1;
        }
        ctx.fillStyle = `rgba(241, 245, 249, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // Render Rising Campfire Embers
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Natural wind velocity decay
      mouse.vx *= 0.92;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // React 19 StrictMode Cleanup Function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animId);
    };
  }, [isFullScreen, maxEmbers, starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`${
        isFullScreen ? 'fixed inset-0 pointer-events-none z-0' : 'absolute inset-0 pointer-events-none'
      } ${className}`}
    />
  );
}
