// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Theme switcher functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Check for saved theme preference
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    // Function to switch theme
    function switchTheme() {
        // Get current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Toggle theme
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateParticlesColor('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateParticlesColor('dark');
        }
    }

    // Event listener for theme toggle
    themeToggle.addEventListener('click', switchTheme, false);

    // Initialize particles.js
    if (typeof particlesJS === 'function') {
        initParticles();
    } else {
        console.warn('particles.js not loaded yet, waiting...');
        // Try again after a short delay
        setTimeout(function() {
            if (typeof particlesJS === 'function') {
                initParticles();
                console.log('particles.js initialized successfully');
            } else {
                console.error('particles.js failed to load');
            }
        }, 1000);
    }

    // Function to initialize particles.js
    function initParticles() {
        const theme = localStorage.getItem('theme') || 'light';
        const particlesConfig = {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: theme === 'dark' ? '#ff0000' : '#ff0000'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.7,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.4,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: theme === 'dark' ? '#ff0000' : '#ff0000',
                    opacity: 0.6,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'window',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    ontouch: {
                        enable: true,
                        mode: 'repulse'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 180,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        };

        particlesJS('particles-js', particlesConfig);
        
        // Add mouse and touch position tracking for more dynamic interaction
        function updateParticlesPosition(x, y) {
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                const pJS = window.pJSDom[0].pJS;
                
                // Update the mouse position in particles.js
                pJS.interactivity.mouse.pos_x = x;
                pJS.interactivity.mouse.pos_y = y;
                
                // Optional: Create a subtle attraction effect based on mouse position
                const mouseX = x / window.innerWidth;
                const mouseY = y / window.innerHeight;
                
                // Adjust particle movement slightly based on mouse position
                if (pJS.particles && pJS.particles.array) {
                    pJS.particles.array.forEach(function(particle, index) {
                        if (index % 3 === 0) { // Only affect every third particle for performance
                            particle.vx += (mouseX - 0.5) * 0.2;
                            particle.vy += (mouseY - 0.5) * 0.2;
                        }
                    });
                }
            }
        }
        
        // Mouse move event for desktop
        document.addEventListener('mousemove', function(e) {
            updateParticlesPosition(e.clientX, e.clientY);
        });
        
        // Touch events for mobile
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 0) {
                updateParticlesPosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 0) {
                updateParticlesPosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    // Function to update particles color based on theme
    function updateParticlesColor(theme) {
        if (window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;
            const particles = pJS.particles;
            
            // Update particle colors based on theme - always red
            const color = '#ff0000';
            particles.color.value = color;
            particles.line_linked.color = color;
            
            // Update all existing particles with the new color
            if (particles.array) {
                particles.array.forEach(function(p) {
                    p.color.value = color;
                    p.color.rgb = hexToRgb(color);
                });
            }
            
            // Make sure interactivity settings are preserved
            pJS.interactivity.detect_on = 'window';
            pJS.interactivity.events.onhover.mode = 'repulse';
            
            // Refresh particles
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
    
    // Helper function to convert hex color to RGB
    function hexToRgb(hex) {
        // Remove the # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" (home)
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active navigation link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            if (window.scrollY >= sectionTop - navbarHeight - 50) {
                currentSection = section.getAttribute('id') || 'home';
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if ((href === '#' && currentSection === 'home') || 
                (href !== '#' && href.substring(1) === currentSection)) {
                link.classList.add('active');
            }
        });
    }
    
    // Run on scroll and on page load
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // Form submission handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just log it to the console
            console.log('Form submitted:', { name, email, message });
            
            // Show success message (you can customize this)
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-card, .project-card, .about-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Run animation check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
    
    // Text typing animation for job titles
    function setupTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        const jobTitles = [
            'Software Developer',
            'Backend Developer',
            'Laravel Developer'
        ];
        
        let currentTitleIndex = 0;
        let currentCharIndex = jobTitles[0].length; // Start with full first title
        let isDeleting = false;
        let typingSpeed = 100; // Base typing speed in ms
        
        function typeText() {
            const currentTitle = jobTitles[currentTitleIndex];
            
            if (isDeleting) {
                // Deleting text
                typingElement.textContent = currentTitle.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                // Typing text
                typingElement.textContent = currentTitle.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100; // Normal speed when typing
            }
            
            // If finished typing the current title
            if (!isDeleting && currentCharIndex === currentTitle.length) {
                // Pause at the end of typing before starting to delete
                isDeleting = false;
                setTimeout(() => {
                    isDeleting = true;
                }, 2000); // Wait 2 seconds before deleting
            }
            
            // If finished deleting the current title
            if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                // Move to next title
                currentTitleIndex = (currentTitleIndex + 1) % jobTitles.length;
                // No need to wait before typing the next title
                typingSpeed = 100;
            }
            
            // Continue the animation loop
            setTimeout(typeText, typingSpeed);
        }
        
        // Start with the full first title, then wait and start deleting
        typingElement.textContent = jobTitles[0]; // Show full "Software Developer" text
        
        // Wait 2 seconds before starting the animation cycle
        setTimeout(() => {
            isDeleting = true; // Start by deleting the first title
            typeText();
        }, 2000);
    }
    
    // Initialize typing animation
    setupTypingAnimation();
    
    // Ensure particles.js is responsive to window resize
    window.addEventListener('resize', function() {
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
            // Update canvas size
            const canvas = document.getElementById('particles-js').querySelector('canvas');
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            
            // Refresh particles
            setTimeout(function() {
                window.pJSDom[0].pJS.fn.vendors.densityAutoParticles();
            }, 300);
        }
    });
    
    // Add a special effect for cursor/touch movement
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Track touch movement for mobile
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            lastX = mouseX;
            lastY = mouseY;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    // Create a subtle follow effect for particles near the cursor
    function animateParticles() {
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS && window.pJSDom[0].pJS.particles.array) {
            // Calculate mouse movement speed
            const speedX = mouseX - lastX;
            const speedY = mouseY - lastY;
            const speed = Math.sqrt(speedX * speedX + speedY * speedY) * 0.05;
            
            // Update particles based on cursor movement
            const particles = window.pJSDom[0].pJS.particles.array;
            const mouseRadius = 150; // Radius of influence around cursor
            
            particles.forEach(function(p, i) {
                // Only affect some particles for performance
                if (i % 4 === 0) {
                    const dx = p.x - mouseX;
                    const dy = p.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // If particle is within influence radius
                    if (dist < mouseRadius) {
                        const force = (1 - dist / mouseRadius) * speed;
                        p.vx += speedX * force * 0.02;
                        p.vy += speedY * force * 0.02;
                    }
                }
            });
            
            lastX = mouseX;
            lastY = mouseY;
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    // Start the animation loop
    animateParticles();
    
    // Special handling for mobile devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        // Create a touch trail effect
        let touchTrailTimeout;
        
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                
                // Create a ripple effect at touch position
                if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                    const pJS = window.pJSDom[0].pJS;
                    
                    // Clear previous timeout
                    clearTimeout(touchTrailTimeout);
                    
                    // Increase repulse distance temporarily for better mobile experience
                    pJS.interactivity.modes.repulse.distance = 200;
                    
                    // Reset after a short delay
                    touchTrailTimeout = setTimeout(function() {
                        pJS.interactivity.modes.repulse.distance = 150;
                    }, 300);
                    
                    // Add extra velocity to nearby particles
                    if (pJS.particles && pJS.particles.array) {
                        const touchX = touch.clientX;
                        const touchY = touch.clientY;
                        
                        pJS.particles.array.forEach(function(p) {
                            const dx = p.x - touchX;
                            const dy = p.y - touchY;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            
                            if (dist < 100) {
                                const force = (1 - dist / 100) * 2;
                                p.vx += (Math.random() - 0.5) * force;
                                p.vy += (Math.random() - 0.5) * force;
                            }
                        });
                    }
                }
            }
        }, { passive: true });
    }
});