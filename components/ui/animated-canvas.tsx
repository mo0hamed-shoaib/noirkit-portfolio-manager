"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface AnimatedCanvasProps {
  variant?: "particles" | "waves" | "grid" | "constellation";
  color?: string;
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function AnimatedCanvas({ 
  variant = "particles", 
  color = "#ffffff", 
  intensity = "medium",
  className = ""
}: AnimatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = intensity === "low" ? 30 : intensity === "medium" ? 50 : 80;
    
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          life: 0,
          maxLife: Math.random() * 200 + 100
        });
      }
    };

    initParticles();

    // Animation functions
    const drawParticles = (ctx: CanvasRenderingContext2D, time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Fade based on life
        const lifeRatio = particle.life / particle.maxLife;
        const opacity = particle.opacity * (1 - lifeRatio) * 0.3;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Reset particle if dead
        if (particle.life >= particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = 0;
        }
      });

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
    };

    const drawWaves = (ctx: CanvasRenderingContext2D, time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const waveCount = 3;
      const amplitude = 30;
      const frequency = 0.01;

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const offset = (w / waveCount) * Math.PI * 2;
        const opacity = 0.1 - (w * 0.02);
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 + 
                   Math.sin(x * frequency + time * 0.002 + offset) * amplitude +
                   Math.sin(x * frequency * 2 + time * 0.003 + offset) * amplitude * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = 50;
      const opacity = 0.05 + Math.sin(time * 0.001) * 0.02;
      
      ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animated intersections
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const pulseSize = 2 + Math.sin(time * 0.005 + x * 0.01 + y * 0.01) * 1;
          const pulseOpacity = 0.3 + Math.sin(time * 0.003 + x * 0.01 + y * 0.01) * 0.2;
          
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = `${color}${Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      }
    };

    const drawConstellation = (ctx: CanvasRenderingContext2D, time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      particlesRef.current.forEach(particle => {
        const twinkle = 0.5 + Math.sin(time * 0.01 + particle.x * 0.01) * 0.3;
        const size = particle.size * twinkle;
        const opacity = particle.opacity * twinkle * 0.6;

        // Draw star
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Draw star glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 3
        );
        gradient.addColorStop(0, `${color}${Math.floor(opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${color}00`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Constellation lines
      particlesRef.current.forEach((star, i) => {
        if (i % 3 === 0 && i + 1 < particlesRef.current.length) {
          const nextStar = particlesRef.current[i + 1];
          const distance = Math.sqrt(
            Math.pow(star.x - nextStar.x, 2) + Math.pow(star.y - nextStar.y, 2)
          );
          
          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(nextStar.x, nextStar.y);
            ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
    };

    // Animation loop
    const animate = () => {
      timeRef.current += 1;
      
      switch (variant) {
        case "particles":
          drawParticles(ctx, timeRef.current);
          break;
        case "waves":
          drawWaves(ctx, timeRef.current);
          break;
        case "grid":
          drawGrid(ctx, timeRef.current);
          break;
        case "constellation":
          drawConstellation(ctx, timeRef.current);
          break;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, color, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: "transparent" }}
    />
  );
}