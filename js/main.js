/* ============================================
   Paran Signature | Salon & Aesthetics
   Premium JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 800);
    });

    // Fallback: hide preloader after 3 seconds max
    setTimeout(function() {
        preloader.classList.add('hidden');
    }, 3000);


    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scroll-progress');
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }


    // --- Sticky Header ---
    const header = document.getElementById('header');
    
    function updateHeader() {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }


    // --- Back to Top Button ---
    const backToTop = document.getElementById('backToTop');
    
    function updateBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- Combined Scroll Handler (performance) ---
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateScrollProgress();
                updateHeader();
                updateBackToTop();
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    });


    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // --- Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Scroll-Triggered Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(el) {
        observer.observe(el);
    });


    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(function(otherItem) {
                otherItem.classList.remove('active');
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


    // --- Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <img src="${imgSrc}" alt="${imgAlt}">
                    <button class="lightbox-close" aria-label="Close lightbox">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Animate in
            setTimeout(function() {
                lightbox.classList.add('active');
            }, 10);
            
            // Close handlers
            const closeLightbox = function() {
                lightbox.classList.remove('active');
                setTimeout(function() {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }, 300);
            };
            
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
            
            // Close on Escape key
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    });

    // Add lightbox styles dynamically
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .lightbox.active {
            opacity: 1;
        }
        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            cursor: pointer;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            z-index: 1;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 85vh;
            border-radius: 8px;
            object-fit: contain;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
            transition: color 0.3s ease;
        }
        .lightbox-close:hover {
            color: #C8A24A;
        }
    `;
    document.head.appendChild(lightboxStyles);


    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const service = formData.get('service');
        const date = formData.get('appointment-date');
        const message = formData.get('message');

        // Validate
        if (!name || !phone || !service) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Build WhatsApp message
        let whatsappMsg = `Hello Paran Signature!%0A%0A`;
        whatsappMsg += `*Name:* ${encodeURIComponent(name)}%0A`;
        whatsappMsg += `*Phone:* ${encodeURIComponent(phone)}%0A`;
        if (email) whatsappMsg += `*Email:* ${encodeURIComponent(email)}%0A`;
        whatsappMsg += `*Service:* ${encodeURIComponent(service)}%0A`;
        if (date) whatsappMsg += `*Preferred Date:* ${encodeURIComponent(date)}%0A`;
        if (message) whatsappMsg += `*Message:* ${encodeURIComponent(message)}%0A`;
        
        // Show success notification
        showNotification('Thank you! Your appointment request has been sent. We will contact you shortly.', 'success');
        
        // Open WhatsApp with the message
        setTimeout(function() {
            window.open(`https://wa.me/923224080586?text=${whatsappMsg}`, '_blank');
        }, 1000);
        
        // Reset form
        contactForm.reset();
    });

    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(function() {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Add notification styles
    const notifStyles = document.createElement('style');
    notifStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.9rem;
            z-index: 99998;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-success {
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
        }
        .notification-success i {
            color: #22c55e;
            font-size: 1.2rem;
        }
        .notification-error {
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        .notification-error i {
            color: #ef4444;
            font-size: 1.2rem;
        }
        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(notifStyles);


    // --- Set minimum date for appointment ---
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }


    // --- Initialize ---
    updateHeader();
    updateBackToTop();
    updateScrollProgress();
});
