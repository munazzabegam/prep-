// Particle Animation System
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    
    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.7 ? '#FFD700' : '#FFA500', // Gold and orange
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.particles = [];
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

      // Update pulse for size animation
      particle.pulse += 0.02;
    });
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections between nearby particles
    this.drawConnections();

    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.save();
      
      // Calculate distance to mouse for interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Mouse interaction - particles move away from mouse
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.x -= (dx / distance) * force * 2;
        particle.y -= (dy / distance) * force * 2;
      }

      // Animated size
      const animatedSize = particle.size + Math.sin(particle.pulse) * 0.5;
      
      // Gradient effect
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, animatedSize * 2
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.globalAlpha = particle.opacity;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, animatedSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }

  drawConnections() {
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
    this.ctx.lineWidth = 1;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          this.ctx.globalAlpha = (120 - distance) / 120 * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.updateParticles();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});

// Add some floating code symbols for extra effect
class FloatingSymbols {
  constructor() {
    this.symbols = ['{}', '[]', '()', '=>', '++', '--', '&&', '||', '==', '!='];
    this.floatingElements = [];
    this.createFloatingSymbols();
  }

  createFloatingSymbols() {
    setInterval(() => {
      if (this.floatingElements.length < 8) {
        this.addFloatingSymbol();
      }
    }, 2000);
  }

  addFloatingSymbol() {
    const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
    const element = document.createElement('div');
    element.textContent = symbol;
    element.className = 'floating-symbol';
    
    // Random position and animation
    element.style.left = Math.random() * window.innerWidth + 'px';
    element.style.top = window.innerHeight + 'px';
    element.style.animationDuration = (Math.random() * 3 + 4) + 's';
    element.style.animationDelay = Math.random() * 2 + 's';
    
    document.body.appendChild(element);
    this.floatingElements.push(element);

    // Remove element after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        this.floatingElements = this.floatingElements.filter(el => el !== element);
      }
    }, 6000);
  }
}

// Initialize floating symbols
document.addEventListener('DOMContentLoaded', () => {
  new FloatingSymbols();
});
