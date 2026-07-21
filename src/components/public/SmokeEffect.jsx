import React, { useEffect, useRef } from 'react';

// Define Particle class outside the component
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + (Math.random() * 200); // Start below screen
        this.vx = (Math.random() - 0.5) * 0.5; // Drift left/right
        this.vy = -(Math.random() * 1 + 0.5); // Float up
        this.size = Math.random() * 150 + 50; // Large, soft puffs
        this.life = Math.random() * 0.5 + 0.2; // Opacity
        this.decay = Math.random() * 0.002 + 0.001;
        this.growth = Math.random() * 0.2 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += this.growth;
        this.life -= this.decay;

        if (this.life <= 0 || this.y + this.size < 0) {
            this.reset();
        }
    }

    draw(ctx, color, opacity) {
        ctx.beginPath();
        // Create a soft radial gradient for the "puff" look
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );

        // Using the passed color (R, G, B)
        gradient.addColorStop(0, `rgba(${color}, ${this.life * opacity})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const SmokeEffect = ({ color = "249, 115, 22", opacity = 0.2, density = 50 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Initialize particles
        for (let i = 0; i < density; i++) {
            particles.push(new Particle(canvas));
            // Pre-warm the system so smoke is already visible
            particles[i].y = Math.random() * canvas.height;
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw(ctx, color, opacity);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, opacity, density]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ filter: 'blur(8px)' }} // Extra blur for softness
        />
    );
};

export default SmokeEffect;
