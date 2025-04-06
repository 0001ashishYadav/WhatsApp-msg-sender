import React, { useEffect, useRef } from "react";

const CanvasBackground = ({
  effect = "particles",
  particleCount = 100,
  particleColor = "#ffffff",
  backgroundColor = "#1a1a2e",
  speed = 1,
  connectParticles = true,
  maxConnections = 3,
  connectDistance = 150,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-initialize particles when canvas size changes
      if (particles.length > 0) {
        initializeParticles();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.radius = Math.random() * 3 + 1;
        this.connections = 0;
      }

      update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Reset connection count for next frame
        this.connections = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    // Initialize particles
    const initializeParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Draw connections between particles
    const drawConnections = () => {
      if (!connectParticles) return;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectDistance) {
            // Only draw connection if both particles haven't exceeded their max connections
            if (
              particles[i].connections < maxConnections &&
              particles[j].connections < maxConnections
            ) {
              // Calculate opacity based on distance
              const opacity = 1 - distance / connectDistance;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              // Increment connection count for both particles
              particles[i].connections++;
              particles[j].connections++;
            }
          }
        }
      }
    };

    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      drawConnections();

      // Request next frame
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    const startAnimation = () => {
      initializeParticles();
      animate();
    };

    startAnimation();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    effect,
    particleCount,
    particleColor,
    backgroundColor,
    speed,
    connectParticles,
    maxConnections,
    connectDistance,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

// Example of a component that uses the canvas background
const BackgroundEffectPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <CanvasBackground
        effect="particles"
        particleCount={150}
        particleColor="#4f8fff"
        backgroundColor="#0a0a20"
        speed={0.8}
        connectParticles={true}
        maxConnections={5}
        connectDistance={200}
      />
      <div className="text-white text-center p-6 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-4">Your Website Content</h1>
        <p className="text-xl">Content with a beautiful animated background</p>
      </div>
    </div>
  );
};

export default CanvasBackground;
