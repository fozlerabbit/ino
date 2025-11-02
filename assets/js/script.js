// ===========================================
// Chuadanga Science & Robotics Club
// Main JavaScript File
// ===========================================

// ========== NAVBAR & FOOTER INJECTION ==========
// This function loads navbar and footer from partial HTML files
// Adjust paths based on page depth (../ for subdirectories)

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const isSubpage = currentPath.includes('/about/') || 
                      currentPath.includes('/projects/') || 
                      currentPath.includes('/achievements/') || 
                      currentPath.includes('/media/') || 
                      currentPath.includes('/join/');
    
    // Determine correct path prefix
    const pathPrefix = isSubpage ? '../' : '';
    
    // Load Navbar
    fetch(`${pathPrefix}partials/navbar.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            
            // Fix image paths in navbar based on page depth
            const navLogo = document.querySelector('.nav-logo img');
            if (navLogo && isSubpage) {
                navLogo.src = '../assets/images/logo.png';
            }
            
            // Fix navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (isSubpage && !href.startsWith('http') && !href.startsWith('mailto')) {
                    if (href === '/') {
                        link.setAttribute('href', '../');
                    } else if (href.startsWith('/')) {
                        link.setAttribute('href', '..' + href);
                    }
                }
            });
            
            // Initialize mobile menu after navbar is loaded
            initMobileMenu();
            highlightCurrentPage();
        })
        .catch(error => console.error('Error loading navbar:', error));
    
    // Load Footer
    fetch(`${pathPrefix}partials/footer.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            
            // Fix image paths in footer based on page depth
            const footerLogo = document.querySelector('.footer-logo');
            if (footerLogo && isSubpage) {
                footerLogo.src = '../assets/images/logo.png';
            }
            
            // Fix footer links
            const footerLinks = document.querySelectorAll('.footer a');
            footerLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (isSubpage && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                    if (href === '/') {
                        link.setAttribute('href', '../');
                    } else if (href.startsWith('/')) {
                        link.setAttribute('href', '..' + href);
                    }
                }
            });
        })
        .catch(error => console.error('Error loading footer:', error));
    
    // Initialize other components
    initCounters();
    initSmoothScroll();
    initLazyLoading();
    initModals();
    initCarousel();
    initMemberFilter();
    initMembershipForm();
});

// ========== MOBILE MENU TOGGLE ==========
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ========== HIGHLIGHT CURRENT PAGE IN NAV ==========
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if ((currentPath === '/' || currentPath === '/index.html') && href === '/') {
            link.style.color = 'var(--emerald)';
            link.style.fontWeight = '600';
        } else if (currentPath.includes(href) && href !== '/') {
            link.style.color = 'var(--emerald)';
            link.style.fontWeight = '600';
        }
    });
}

// ========== ANIMATED COUNTERS ==========
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Animation speed
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for scroll-based animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========== SMOOTH SCROLLING ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========== LAZY LOADING IMAGES ==========
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ========== MODAL FUNCTIONALITY ==========
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// Toggle modal function (called from HTML buttons)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active');
    }
}

// ========== NEWS CAROUSEL ==========
function initCarousel() {
    const carousel = document.querySelector('.news-slides');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (carousel && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slides = carousel.querySelectorAll('.news-slide');
        const totalSlides = slides.length;
        
        function showSlide(index) {
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;
            
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        
        // Auto-advance carousel
        setInterval(() => showSlide(currentSlide + 1), 5000);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
        });
    }
}

// ========== MEMBER FILTER ==========
function initMemberFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const memberItems = document.querySelectorAll('.member-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                memberItems.forEach(item => {
                    const role = item.getAttribute('data-role');
                    if (filter === 'all' || role === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }
}

// ========== MEMBERSHIP FORM ==========
function initMembershipForm() {
    const form = document.getElementById('membership-form');
    const successMessage = document.getElementById('success-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Here you would normally send data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            if (successMessage) {
                successMessage.classList.add('active');
                form.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('active');
                }, 5000);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
}

// ========== PARALLAX EFFECT FOR BANNERS ==========
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const banners = document.querySelectorAll('.hero-banner, .page-banner');
    
    banners.forEach(banner => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        const img = banner.querySelector('img');
        if (img) {
            img.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// ========== FADE IN ANIMATION ON SCROLL ==========
const fadeElements = document.querySelectorAll('.feature-card, .team-card, .project-card-large, .press-card');

if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
}

// ========== KEYBOARD ACCESSIBILITY ==========
// Trap focus within modals
document.addEventListener('keydown', function(e) {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal && e.key === 'Tab') {
        const focusableElements = activeModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// ========== DEVELOPER NOTES ==========
// Replace placeholder images in /assets/images/ with actual photos
// Update text content where needed throughout HTML files
// Test all forms and interactive elements
// Validate HTML, CSS, and JavaScript before deployment
// Ensure all external links are correct and working
// Add Google Analytics or other tracking if needed
