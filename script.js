// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Carousel functionality (Completely Revamped)
class ProjectCarousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.project-card');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.gap = 32; // 2rem gap between cards
        this.visibleCards = 3; // Number of cards to show at once
        this.isAnimating = false;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        this.updateCardWidth();
        this.updateSlidePosition(false);
        this.startAutoPlay();
        this.initTouchEvents();
        this.initButtonEvents();
        this.handleResize();
    }

    updateCardWidth() {
        const containerWidth = this.container.offsetWidth;
        this.cardWidth = (containerWidth - this.gap * (this.visibleCards - 1)) / this.visibleCards;
        
        this.cards.forEach(card => {
            card.style.width = `${this.cardWidth}px`;
        });
    }

    updateSlidePosition(animate = true) {
        const offset = this.currentIndex * (this.cardWidth + this.gap);
        this.track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        this.track.style.transform = `translateX(-${offset}px)`;
    }

    slide(direction) {
        if (this.isAnimating || this.cards.length <= this.visibleCards) return;
        
        this.stopAutoPlay();

        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        let nextIndex = this.currentIndex;

        if (direction === 'next') {
            nextIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
        } else {
            nextIndex = this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
        }

        this.goToSlide(nextIndex);
        this.startAutoPlay();
    }

    goToSlide(index) {
        if (this.isAnimating || this.cards.length <= this.visibleCards) return;
        
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;

        this.isAnimating = true;
        this.currentIndex = index;

        this.updateSlidePosition(true);
        this.updateActiveClasses();

        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    updateActiveClasses() {
        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        if (this.autoPlayInterval || this.cards.length <= this.visibleCards) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.slide('next');
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateCardWidth();
                this.updateSlidePosition(false);
            }, 150);
        });
    }

    initTouchEvents() {
        let startX, moveX;
        const threshold = 50;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () => {
            if (!startX || !moveX) return;

            const diff = startX - moveX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.slide('next');
                } else {
                    this.slide('prev');
                }
            }
        });
    }

    initButtonEvents() {
        if (!this.prevBtn || !this.nextBtn) return;

        this.prevBtn.addEventListener('click', () => this.slide('prev'));
        this.nextBtn.addEventListener('click', () => this.slide('next'));

        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectCarousel();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectCarousel;
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.about-content, .project-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(element);
});

// Add active class to current navigation link
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Particle.js Configuration
const particlesConfig = {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#2563eb'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.3,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#2563eb',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 3
            }
        }
    },
    retina_detect: true
};

// Initialize particles for hero section
particlesJS('particles-js', particlesConfig);

// Initialize particles for contact section with modified config
const contactParticlesConfig = {
    ...particlesConfig,
    particles: {
        ...particlesConfig.particles,
        number: {
            value: 40, // Increased number of particles
            density: {
                enable: true,
                value_area: 800
            }
        },
        opacity: {
            value: 0.3, // Increased opacity
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        move: {
            ...particlesConfig.particles.move,
            speed: 1.2 // Slightly faster movement
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#2563eb',
            opacity: 0.3, // Increased line opacity
            width: 1
        }
    }
};

particlesJS('particles-contact', contactParticlesConfig);

// Loading Screen
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    loading.classList.add('hidden');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
    cursorFollower.style.transform = 'scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursorFollower.style.transform = 'scale(1)';
});

// Scroll Progress Bar
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Project Card Hover Effect
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Skill Tag Animation
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach(tag => {
    tag.addEventListener('mouseover', () => {
        tag.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    tag.addEventListener('mouseout', () => {
        tag.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize EmailJS
(function() {
    emailjs.init("8MJGTjQOFVPmSCWbi"); // Your public key
})();

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const successMessage = document.querySelector('.success-message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Send email using EmailJS
        emailjs.send("service_icwhz7m", "template_k5s85cq", {
            from_name: name,
            from_email: email,
            message: message,
            to_email: "marcoladeiraworkemail@gmail.com"
        })
        .then(function() {
            // Show success message
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        })
        .catch(function(error) {
            console.error("Failed to send email:", error);
            alert("Failed to send message. Please try again later.");
        })
        .finally(function() {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.src = 'assets/placeholder.jpg';
        img.alt = 'Image not found';
    });
});

// Enhanced glitch effect
const glitchText = document.querySelector('.glitch');
let glitchInterval;

function startGlitch() {
    glitchInterval = setInterval(() => {
        glitchText.style.textShadow = `
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 0, 0.7),
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 255, 0, 0.7),
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 0, 255, 0.7)
        `;
    }, 50);
}

function stopGlitch() {
    clearInterval(glitchInterval);
    glitchText.style.textShadow = 'none';
}

glitchText.addEventListener('mouseenter', startGlitch);
glitchText.addEventListener('mouseleave', stopGlitch);

// Dynamic typing effect
const dynamicTexts = document.querySelector('.dynamic-texts');
const words = ['Developer', 'Designer', 'Freelancer', 'Creator'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;

function type() {
    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);
    
    dynamicTexts.querySelector('span').textContent = currentText;
    
    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        typingDelay = 200;
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        typingDelay = 100;
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % words.length;
        }
        typingDelay = 1200;
    }
    
    setTimeout(type, typingDelay);
}

type(); 