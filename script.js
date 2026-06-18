/* -------------------------------------------------------------
   SAHIL RAJ - RECRUITER PORTFOLIO JAVASCRIPT (VANILLA JS)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme preference, default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('portfolio-theme', 'light');
      showToast('Theme switched to Light Mode', 'info');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('portfolio-theme', 'dark');
      showToast('Theme switched to Dark Mode', 'info');
    }
  });

  // 2. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Navigation Link Highlighting on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the main view area
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // 4. Project Tag Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardTags = card.getAttribute('data-tags') || '';
        const tagsArray = cardTags.split(' ');

        if (filterValue === 'all' || tagsArray.includes(filterValue)) {
          card.style.display = 'flex';
          // Force reflow for fade in effect
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 200ms ease, transform 150ms ease';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // SVG Success/Info Icon depending on type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg class="toast-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" x2="12" y1="16" y2="12"/>
          <line x1="12" x2="12.01" y1="8" y2="8"/>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Fade out and remove toast after 4 seconds
    setTimeout(() => {
      toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      
      // Remove element from DOM after transition finishes
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // 6. Custom Cursor & Smoke Trail Effect
  function initCustomCursorAndSmokeTrail() {
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    const canvas = document.getElementById('pointer-trail-canvas');
    if (!dot || !ring || !canvas) return;

    // Check prefers-reduced-motion media query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Hide custom cursor elements if reduced motion is requested
    if (prefersReducedMotion.matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let isDrawing = false;
    let hasMoved = false;

    // Cursor tracking state
    const mouse = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    let scaleCurrent = 1;
    let scaleTarget = 1;

    // Pre-rendered offscreen canvases for extreme performance (GPU-cached drawing)
    const smokeCanvasWhite = document.createElement('canvas');
    const smokeCanvasBlack = document.createElement('canvas');
    const smokeImgSize = 128;
    smokeCanvasWhite.width = smokeImgSize;
    smokeCanvasWhite.height = smokeImgSize;
    smokeCanvasBlack.width = smokeImgSize;
    smokeCanvasBlack.height = smokeImgSize;

    // Render White Smoke (for Dark Theme)
    const ctxW = smokeCanvasWhite.getContext('2d');
    const gradW = ctxW.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradW.addColorStop(0, 'rgba(235, 235, 235, 0.9)');
    gradW.addColorStop(0.2, 'rgba(235, 235, 235, 0.45)');
    gradW.addColorStop(0.6, 'rgba(235, 235, 235, 0.12)');
    gradW.addColorStop(1, 'rgba(235, 235, 235, 0)');
    ctxW.fillStyle = gradW;
    ctxW.beginPath();
    ctxW.arc(64, 64, 64, 0, Math.PI * 2);
    ctxW.fill();

    // Render Black Smoke (for Light Theme)
    const ctxB = smokeCanvasBlack.getContext('2d');
    const gradB = ctxB.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradB.addColorStop(0, 'rgba(25, 25, 25, 0.9)');
    gradB.addColorStop(0.2, 'rgba(25, 25, 25, 0.45)');
    gradB.addColorStop(0.6, 'rgba(25, 25, 25, 0.12)');
    gradB.addColorStop(1, 'rgba(25, 25, 25, 0)');
    ctxB.fillStyle = gradB;
    ctxB.beginPath();
    ctxB.arc(64, 64, 64, 0, Math.PI * 2);
    ctxB.fill();

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    // Initialize size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Drift wider horizontally and slowly upwards
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = -Math.random() * 0.25 - 0.15; // slow upward drift
        // Initial size: starts wider (between 14px and 22px)
        this.size = Math.random() * 8 + 14;
        // Growth rate: expands wider faster
        this.growth = Math.random() * 0.4 + 0.35;
        // Alpha/opacity: starts thin
        this.alpha = Math.random() * 0.12 + 0.1; // 0.1 to 0.22
        // Decay rate: lasts around 25-45 frames
        this.decay = Math.random() * 0.005 + 0.004;
        
        // Irregular cloud offsets - spaced wider from the start
        const angle1 = Math.random() * Math.PI * 2;
        const dist1 = Math.random() * 6 + 4;
        this.offsetX1 = Math.cos(angle1) * dist1;
        this.offsetY1 = Math.sin(angle1) * dist1;

        const angle2 = Math.random() * Math.PI * 2;
        const dist2 = Math.random() * 6 + 4;
        this.offsetX2 = Math.cos(angle2) * dist2;
        this.offsetY2 = Math.sin(angle2) * dist2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Friction on horizontal movement
        this.vx *= 0.97;
        
        this.size += this.growth;
        this.offsetX1 *= 1.012;
        this.offsetY1 *= 1.012;
        this.offsetX2 *= 1.012;
        this.offsetY2 *= 1.012;

        this.alpha -= this.decay;
      }

      draw(ctx, isLightTheme) {
        // Select pre-rendered smoke puff image
        const smokeImg = isLightTheme ? smokeCanvasBlack : smokeCanvasWhite;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        
        // Draw 3 hardware-accelerated image stamps to form a soft volumetric shape
        // Center puff
        ctx.drawImage(
          smokeImg, 
          this.x - this.size, 
          this.y - this.size, 
          this.size * 2, 
          this.size * 2
        );

        // Sub-puff 1
        ctx.drawImage(
          smokeImg, 
          this.x + this.offsetX1 - this.size * 0.8, 
          this.y + this.offsetY1 - this.size * 0.8, 
          this.size * 1.6, 
          this.size * 1.6
        );

        // Sub-puff 2
        ctx.drawImage(
          smokeImg, 
          this.x + this.offsetX2 - this.size * 0.7, 
          this.y + this.offsetY2 - this.size * 0.7, 
          this.size * 1.4, 
          this.size * 1.4
        );

        ctx.restore();
      }
    }

    // Single requestAnimationFrame loop for custom cursor ring lerping & smoke rendering
    function updateLoop() {
      // 1. Lerp Ring Position
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;

      // 2. Lerp Scale
      scaleCurrent += (scaleTarget - scaleCurrent) * 0.16;

      // 3. Apply styles to custom cursor elements
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scaleCurrent})`;

      // 4. Render Canvas Smoke Particles
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const isLightTheme = document.body.classList.contains('light-theme');
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx, isLightTheme);
        }
      }

      // Loop continues if particles exist OR if the ring hasn't fully caught up to the mouse yet
      const distanceToMouse = Math.hypot(mouse.x - ringPos.x, mouse.y - ringPos.y);
      const scaleDelta = Math.abs(scaleTarget - scaleCurrent);

      if (particles.length > 0 || distanceToMouse > 0.1 || scaleDelta > 0.001) {
        requestAnimationFrame(updateLoop);
      } else {
        isDrawing = false;
      }
    }

    function triggerUpdate() {
      if (!isDrawing) {
        isDrawing = true;
        requestAnimationFrame(updateLoop);
      }
    }

    window.addEventListener('mousemove', (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Make custom cursor elements visible on first movement
      if (!hasMoved) {
        dot.classList.add('custom-cursor-visible');
        ring.classList.add('custom-cursor-visible');
        
        mouse.x = clientX;
        mouse.y = clientY;
        ringPos.x = clientX;
        ringPos.y = clientY;
        
        hasMoved = true;
        triggerUpdate();
        return;
      }

      const dist = Math.hypot(clientX - mouse.x, clientY - mouse.y);
      // Interpolate points with lower density for optimal frame rate
      const steps = Math.min(Math.floor(dist / 12), 4);

      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 1 : i / steps;
        const x = mouse.x + (clientX - mouse.x) * t;
        const y = mouse.y + (clientY - mouse.y) * t;
        particles.push(new SmokeParticle(x, y));
      }

      mouse.x = clientX;
      mouse.y = clientY;

      triggerUpdate();
    });

    // Handle mouse leaving/entering window
    document.addEventListener('mouseleave', () => {
      dot.classList.remove('custom-cursor-visible');
      ring.classList.remove('custom-cursor-visible');
      hasMoved = false;
    });

    // Hover event delegation for scaling cursor
    const hoverSelector = 'a, button, select, textarea, input, [role="button"], .social-link, .filter-btn, .info-card, .btn';
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(hoverSelector);
      if (target) {
        scaleTarget = 1.6;
        ring.classList.add('is-hovering');
        triggerUpdate();
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(hoverSelector);
      if (target) {
        scaleTarget = 1.0;
        ring.classList.remove('is-hovering');
        triggerUpdate();
      }
    });

    // Handle prefers-reduced-motion dynamic changes
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        canvas.style.display = 'none';
        particles = [];
      } else {
        dot.style.display = '';
        ring.style.display = '';
        canvas.style.display = '';
        resizeCanvas();
      }
    });
  }

  // Initialize Custom Cursor & Smoke Trail
  initCustomCursorAndSmokeTrail();
});
