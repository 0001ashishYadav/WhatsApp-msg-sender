import React, { useRef, useEffect } from "react";

const FlowerBackground = () => {
  const canvasRef = useRef(null);
  const flowers = useRef([]);

  const flowerEmoji = "🌸";
  const colors = ["#FFB6C1", "#FFC0CB", "#FF69B4", "#FF1493", "#DB7093"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flowerCount = 50;

    // Create flower objects
    flowers.current = Array.from({ length: flowerCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 20 + Math.random() * 20,
      speed: 0.5 + Math.random() * 1.5,
      drift: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flowers.current.forEach((flower) => {
        ctx.save();
        ctx.translate(flower.x, flower.y);
        ctx.rotate((flower.rotation * Math.PI) / 180);
        ctx.font = `${flower.size}px serif`;
        ctx.shadowColor = flower.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = flower.color;
        ctx.fillText(flowerEmoji, 0, 0);
        ctx.restore();

        flower.y += flower.speed;
        flower.x += flower.drift;
        flower.rotation += 0.2;

        if (flower.y > canvas.height) {
          flower.y = -30;
          flower.x = Math.random() * canvas.width;
        }

        if (flower.x > canvas.width || flower.x < 0) {
          flower.drift *= -1;
        }
      });
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default FlowerBackground;
