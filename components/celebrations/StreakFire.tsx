'use client';

import { useEffect, useState, useRef } from 'react';

interface StreakFireProps {
  isActive: boolean;
  intensity?: number; // 0-1, based on streak length
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

interface FlameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function StreakFire({
  isActive,
  intensity = 0.5,
  size = 'medium',
  className = '',
}: StreakFireProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<FlameParticle[]>([]);

  const sizeMap = {
    small: { width: 60, height: 80, particleCount: 20 },
    medium: { width: 100, height: 120, particleCount: 40 },
    large: { width: 150, height: 180, particleCount: 60 },
  };

  const dimensions = sizeMap[size];

  useEffect(() => {
    if (!isActive) {
      particlesRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles
    const particleCount = Math.floor(dimensions.particleCount * intensity);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 3 + 2) * intensity,
      life: Math.random(),
      maxLife: Math.random() * 0.5 + 0.5,
      size: Math.random() * 8 + 4,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.1 * intensity; // Upward force
        particle.life += 0.02;

        // Fade out as particle ages
        const alpha = 1 - particle.life / particle.maxLife;

        if (particle.life > particle.maxLife || particle.y < 0) {
          // Reset particle
          particle.x = Math.random() * canvas.width;
          particle.y = canvas.height;
          particle.life = 0;
          particle.vy = -(Math.random() * 3 + 2) * intensity;
        }

        // Draw flame particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );
        gradient.addColorStop(0, `rgba(255, ${100 + Math.random() * 50}, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, ${50 + Math.random() * 50}, 0, ${alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, intensity, dimensions]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        imageRendering: 'auto',
      }}
    />
  );
}

