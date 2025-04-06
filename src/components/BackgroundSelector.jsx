import React, { useEffect, useRef, useState } from "react";

// Background 1: Geometric Constellation
const ConstellationBackground = ({
  starCount = 100,
  maxConnections = 3,
  starColor = "#ffffff",
  lineColor = "rgba(255, 255, 255, 0.15)",
  backgroundColor = "#0f172a",
  starMovement = true,
  speed = 0.2,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Create stars
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        connections: 0,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move stars if enabled
        if (starMovement) {
          star.x += star.vx;
          star.y += star.vy;

          // Bounce off edges
          if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();

        // Reset connections
        star.connections = 0;
      }

      // Draw connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const star1 = stars[i];
          const star2 = stars[j];

          // Calculate distance
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connect stars if close enough and not too many connections
          if (
            distance < 100 &&
            star1.connections < maxConnections &&
            star2.connections < maxConnections
          ) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            star1.connections++;
            star2.connections++;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    starCount,
    maxConnections,
    starColor,
    lineColor,
    backgroundColor,
    starMovement,
    speed,
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

// Background 2: Animated Hexagonal Grid
const HexagonBackground = ({
  gridSize = 50,
  pulseSpeed = 0.02,
  colorPrimary = "#1e3a8a",
  colorSecondary = "#3b82f6",
  backgroundColor = "#0f172a",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Create hexagon grid
    const hexagons = [];
    const hexHeight = gridSize * Math.sqrt(3);

    for (let row = -1; row < canvas.height / hexHeight + 2; row++) {
      for (let col = -1; col < canvas.width / (gridSize * 1.5) + 2; col++) {
        const x = col * gridSize * 1.5;
        const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2);
        const phaseOffset = Math.random() * Math.PI * 2;

        hexagons.push({ x, y, phaseOffset });
      }
    }

    // Draw hexagon
    const drawHexagon = (x, y, size, fillStyle) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update time
      time += pulseSpeed;

      // Draw hexagons
      for (const hexagon of hexagons) {
        const pulse = 0.5 + 0.5 * Math.sin(time + hexagon.phaseOffset);
        const size = gridSize * (0.6 + 0.3 * pulse);

        // Interpolate color based on pulse
        const r1 = parseInt(colorPrimary.slice(1, 3), 16);
        const g1 = parseInt(colorPrimary.slice(3, 5), 16);
        const b1 = parseInt(colorPrimary.slice(5, 7), 16);

        const r2 = parseInt(colorSecondary.slice(1, 3), 16);
        const g2 = parseInt(colorSecondary.slice(3, 5), 16);
        const b2 = parseInt(colorSecondary.slice(5, 7), 16);

        const r = Math.floor(r1 + (r2 - r1) * pulse);
        const g = Math.floor(g1 + (g2 - g1) * pulse);
        const b = Math.floor(b1 + (b2 - b1) * pulse);

        const fillStyle = `rgb(${r}, ${g}, ${b})`;

        drawHexagon(hexagon.x, hexagon.y, size, fillStyle);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [gridSize, pulseSpeed, colorPrimary, colorSecondary, backgroundColor]);

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

// Background 3: Circuit Board
const CircuitBoardBackground = ({
  nodeCount = 20,
  lineWidth = 1.5,
  nodeSize = 4,
  lineColor = "#22c55e",
  nodeColor = "#4ade80",
  backgroundColor = "#052e16",
  animationSpeed = 0.01,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Create nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      nodes.push({ x, y });
    }

    // Create connections - each node connects to 1-3 others
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      const possibleTargets = [...Array(nodes.length).keys()].filter(
        (j) => j !== i
      );

      for (let c = 0; c < connectionCount && possibleTargets.length > 0; c++) {
        const targetIndex = Math.floor(Math.random() * possibleTargets.length);
        const target = possibleTargets[targetIndex];
        possibleTargets.splice(targetIndex, 1);

        connections.push({
          source: i,
          target,
          offset: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.02 + 0.01,
        });
      }
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update time
      time += animationSpeed;

      // Draw connections
      for (const connection of connections) {
        const source = nodes[connection.source];
        const target = nodes[connection.target];

        // Draw line
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Draw pulse (moving dot along the line)
        const pulsePosition = (time * connection.speed) % 1;
        const pulseX = source.x + (target.x - source.x) * pulsePosition;
        const pulseY = source.y + (target.y - source.y) * pulsePosition;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, nodeSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    nodeCount,
    lineWidth,
    nodeSize,
    lineColor,
    nodeColor,
    backgroundColor,
    animationSpeed,
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

// Background 4: Noise Terrain
const NoiseTerrain = ({
  resolution = 50,
  amplitude = 50,
  speed = 0.01,
  colors = ["#134e4a", "#14b8a6", "#99f6e4"],
  backgroundColor = "#042f2e",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Simplex noise implementation (simplified)
    const noise = (x, y) => {
      return (
        Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 +
        Math.sin(x * 0.05 + y * 0.05) * 0.5
      );
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update time
      time += speed;

      // Draw layers
      for (let layer = 0; layer < colors.length; layer++) {
        const layerOffset = layer * 20;
        const points = [];

        // Calculate terrain points
        for (let x = 0; x <= canvas.width; x += resolution) {
          const noiseValue = noise(x * 0.05, time + layer) * amplitude;
          const y = canvas.height - 100 - layerOffset - noiseValue;
          points.push({ x, y });
        }

        // Draw terrain
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(points[0].x, points[0].y);

        // Draw curved path through points
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const current = points[i];
          const cpx = (prev.x + current.x) / 2;

          ctx.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + current.y) / 2);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = colors[layer];
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [resolution, amplitude, speed, colors, backgroundColor]);

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

// Background Selector Component
const BackgroundSelector = () => {
  const [selectedBackground, setSelectedBackground] = useState("constellation");

  const backgrounds = {
    constellation: {
      name: "Constellation",
      component: <ConstellationBackground />,
    },
    hexagon: {
      name: "Hexagon Grid",
      component: <HexagonBackground />,
    },
    circuit: {
      name: "Circuit Board",
      component: <CircuitBoardBackground />,
    },
    terrain: {
      name: "Noise Terrain",
      component: <NoiseTerrain />,
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {backgrounds[selectedBackground].component}

      <div className="text-white text-center p-8 rounded-lg backdrop-blur-md bg-black bg-opacity-20 max-w-lg z-10">
        <h1 className="text-4xl font-bold mb-4">Canvas Backgrounds</h1>
        <p className="text-xl mb-6">Choose a background effect:</p>

        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(backgrounds).map(([key, bg]) => (
            <button
              key={key}
              onClick={() => setSelectedBackground(key)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedBackground === key
                  ? "bg-white text-black"
                  : "bg-black bg-opacity-30 text-white"
              }`}
            >
              {bg.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
