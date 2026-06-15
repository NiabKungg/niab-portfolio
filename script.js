/* ==========================================
   Portfolio Website — Interactive JavaScript
   Ekanat Meedech — Full Stack Developer
   ========================================== */

(function () {
    'use strict';

    // ==========================================
    // Loading Screen
    // ==========================================
    const loadingScreen = document.getElementById('loading-screen');
    const loaderFill = document.getElementById('loader-fill');
    let loadProgress = 0;

    function simulateLoading() {
        const interval = setInterval(() => {
            loadProgress += Math.random() * 15 + 5;
            if (loadProgress >= 100) {
                loadProgress = 100;
                loaderFill.style.width = '100%';
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.style.overflow = '';
                    initAnimations();
                }, 400);
            } else {
                loaderFill.style.width = loadProgress + '%';
            }
        }, 100);
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', simulateLoading);

    // ==========================================
    // Custom Cursor
    // ==========================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        cursorFollower.style.left = followerX - 17.5 + 'px';
        cursorFollower.style.top = followerY - 17.5 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category, .contact-card, .timeline-card, .info-item, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovering'));
    });

    // ==========================================
    // Particle System
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 120;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.01;
                this.y -= dy * force * 0.01;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ==========================================
    // Typewriter Effect
    // ==========================================
    const typewriterEl = document.getElementById('typewriter');
    const phrases = [
        'Full Stack Developer',
        'IoT Engineer',
        'Backend Architect',
        'Python Enthusiast',
        'Problem Solver',
        'CS Student @ KMITL'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typewrite() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typewrite, typeSpeed);
    }

    // ==========================================
    // Navigation
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkElements = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    // Scroll effect
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide scroll indicator
        const scrollIndicator = document.getElementById('scroll-indicator');
        if (scrollY > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
        }

        lastScrollY = scrollY;

        // Active nav link based on scroll position
        updateActiveNav();
    });

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinkElements.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    }

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // Scroll Reveal (Intersection Observer)
    // ==========================================
    function initAnimations() {
        typewrite();
        animateCounters();

        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-float');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Skill bars animation
        initSkillBars();

        // GPA bar animation
        initGPABars();

        // Timeline fill animation
        initTimelineFill();
    }

    // ==========================================
    // Skill Bars Animation
    // ==========================================
    function initSkillBars() {
        const skillFills = document.querySelectorAll('.skill-bar-fill');

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillFills.forEach(fill => skillObserver.observe(fill));
    }

    // ==========================================
    // GPA Bar Animation
    // ==========================================
    function initGPABars() {
        const gpaFills = document.querySelectorAll('.gpa-bar-fill');

        const gpaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    gpaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        gpaFills.forEach(fill => gpaObserver.observe(fill));
    }

    // ==========================================
    // Timeline Fill Animation
    // ==========================================
    function initTimelineFill() {
        const timelineFill = document.getElementById('timeline-fill');
        if (!timelineFill) return;

        const timelineSection = document.getElementById('education');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        timelineFill.style.height = '100%';
                    }, 300);
                }
            });
        }, { threshold: 0.2 });

        timelineObserver.observe(timelineSection);
    }

    // ==========================================
    // Counter Animation
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.dataset.target);
                    const isFloat = target % 1 !== 0;
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = eased * target;

                        if (isFloat) {
                            counter.textContent = current.toFixed(2);
                        } else {
                            counter.textContent = Math.floor(current);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            if (isFloat) {
                                counter.textContent = target.toFixed(2);
                            } else {
                                counter.textContent = target;
                            }
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ==========================================
    // Profile Image Fallback
    // ==========================================
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        heroImage.addEventListener('error', () => {
            // Create a gradient placeholder with initials
            const wrapper = heroImage.parentElement;
            heroImage.style.display = 'none';

            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
                border-radius: inherit;
                position: relative;
                z-index: 2;
            `;
            placeholder.innerHTML = `
                <span style="
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    user-select: none;
                ">EM</span>
            `;
            wrapper.insertBefore(placeholder, heroImage);
        });
    }

    // ==========================================
    // Contact Form
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = document.getElementById('form-submit');
            const originalContent = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================
    // Smooth scroll for anchor links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Tilt Effect on Project Cards
    // ==========================================
    const tiltCards = document.querySelectorAll('.project-card, .skill-category');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            // Move glow
            const glow = card.querySelector('.project-card-glow');
            if (glow) {
                glow.style.left = x - rect.width + 'px';
                glow.style.top = y - rect.height + 'px';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==========================================
    // Keyboard Navigation
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ==========================================
    // Console Easter Egg
    // ==========================================
    console.log(
        '%c👋 Hey there, curious developer!',
        'color: #00d4ff; font-size: 20px; font-weight: bold;'
    );
    console.log(
        '%cThis portfolio was crafted with passion by Ekanat Meedech.\nLooking for a full-stack developer? Let\'s connect!\n📧 niabbiekunbgxd@gmail.com\n🐙 github.com/NiabKungg',
        'color: #a0a0b8; font-size: 12px;'
    );

})();
