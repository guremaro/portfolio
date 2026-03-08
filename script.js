/**
 * Gure Design Portfolio - JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside or on a link
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll ---
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Reveal Actions & Counters & Skill Bars on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.stat-number, .hero-stat-number');
    const skillFills = document.querySelectorAll('.skill-fill');
    
    // Using IntersectionObserver for better performance
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class
                entry.target.classList.add('visible');

                // If element has counters, animate them
                if (entry.target.classList.contains('hero') || entry.target.classList.contains('about') || entry.target.querySelectorAll('.hero-stat-number, .stat-number').length > 0) {
                    const targets = entry.target.querySelectorAll('.hero-stat-number, .stat-number');
                    targets.forEach(counter => {
                        if (!counter.hasAttribute('data-animated')) {
                            counter.setAttribute('data-animated', 'true');
                            animateCounter(counter);
                        }
                    });
                }
                
                // If element has counter itself
                if (entry.target.hasAttribute('data-count') && !entry.target.hasAttribute('data-animated')) {
                    entry.target.setAttribute('data-animated', 'true');
                    animateCounter(entry.target);
                }

                // If element has skill bars, animate them
                if (entry.target.classList.contains('skills-bars') || entry.target.querySelectorAll('.skill-fill').length > 0) {
                    const bars = entry.target.querySelectorAll('.skill-fill');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    });
                }
                
                // If element is a skill bar itself
                if (entry.target.classList.contains('skill-fill')) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                }

                // Unobserve after animating
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => sectionObserver.observe(el));
    counters.forEach(el => sectionObserver.observe(el));
    document.querySelectorAll('.skills-bars').forEach(el => sectionObserver.observe(el));


    function animateCounter(counter) {
        const target = +counter.getAttribute('data-count');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    }


    // --- Form Submit Prevention (Mock) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>送信中...</span>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            // Mock API Call
            setTimeout(() => {
                btn.innerHTML = '<span>送信完了！</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
                btn.style.background = '#10b981'; /* Success Green */
                btn.style.opacity = '1';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.pointerEvents = 'auto';
                }, 3000);
            }, 1500);
        });
    }

    // --- Particle Animation (Canvas) ---
    initParticles();
});

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Colors mapping to CSS variables
    const colors = ['rgba(108, 92, 231, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(6, 182, 212, 0.4)'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.size = 0;
            this.speedX = 0;
            this.speedY = 0;
            this.color = '';
            this.alpha = 0;
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5 - 0.1; // Float upwards slightly
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);
        
        // Amount of particles based on screen size
        const count = Math.min(Math.floor((width * height) / 15000), 100);
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
        
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Connect nearby particles with a faint line
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    // Fix alpha calculation
                    const lineAlpha = 0.05 * (1 - distance / 120);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Add a slight scroll parallax to particles
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        canvas.style.transform = `translateY(${scrolled * 0.4}px)`;
    });

    init();
}
