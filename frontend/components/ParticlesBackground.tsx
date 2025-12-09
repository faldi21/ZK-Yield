'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  life: number;
  maxLife: number;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Configuration
    const colors = [
      '59, 130, 246', // Blue
      '6, 182, 212',  // Cyan
      '147, 51, 234', // Purple
    ];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const createParticle = (isInitial = false): Particle => {
      const isMobile = window.innerWidth < 768;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5, // Slow floating
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * (isMobile ? 2 : 3) + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: isInitial ? Math.random() * 0.5 : 0,
        targetAlpha: Math.random() * 0.4 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200, // Frames to live
      };
    };

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 30 : 80; // Fewer particles on mobile
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p, index) => {
        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Fade in/out
        if (p.life < 50) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.05;
        } else if (p.life > p.maxLife - 50) {
          p.alpha -= 0.01;
        }
        
        p.life++;

        // Replace dead particles
        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles[index] = createParticle();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2, i2) => {
          if (index === i2) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const connectDist = 150;

          if (dist < connectDist) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${p.color}, ${Math.min(p.alpha, p2.alpha) * (1 - dist / connectDist) * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        background: 'transparent',
        willChange: 'transform'
      }}
    />
  );
};

export default ParticlesBackground;
