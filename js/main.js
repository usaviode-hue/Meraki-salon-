/**
 * ================================================================
 * MERAKI SALON & MAKEUP STUDIO - MAIN JAVASCRIPT
 * Premium Interactions, Smooth Scroll, Filters, Sliders, & Lightbox
 * ================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. PRELOADER & HERO LOAD ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
            }, 800); // Allow preloader animations to run briefly
        });
        
        // Safety timeout in case window load event doesn't fire
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }, 3000);
    }

    // --- 2. SCROLL PROGRESS BAR & STICKY HEADER ---
    const scrollProgress = document.getElementById("scroll-progress");
    const header = document.querySelector("header");
    const backToTopBtn = document.querySelector(".float-back-to-top");

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Progress bar
        if (scrollProgress && scrollHeight > 0) {
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = `${scrollPercentage}%`;
        }

        // Sticky Header
        if (header) {
            if (scrollTop > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Floating Back-To-Top Button
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.style.display = "flex";
                setTimeout(() => backToTopBtn.style.opacity = "1", 10);
            } else {
                backToTopBtn.style.opacity = "0";
                setTimeout(() => {
                    if (window.pageYOffset <= 500) {
                        backToTopBtn.style.display = "none";
                    }
                }, 400);
            }
        }
        
        // Active Navigation link on scroll
        updateActiveNavLink();
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- 3. MOBILE MENU TOGGLE ---
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "initial";
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.style.overflow = "initial";
            });
        });
    }

    // Active Navigation link updates based on section
    function updateActiveNavLink() {
        const sections = document.querySelectorAll("section[id]");
        const scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove("active"));
                    correspondingLink.classList.add("active");
                } else {
                    correspondingLink.classList.remove("active");
                }
            }
        });
    }

    // --- 4. SERVICES CATEGORY FILTERING ---
    const tabBtns = document.querySelectorAll(".tab-btn");
    const serviceCards = document.querySelectorAll(".service-card");

    if (tabBtns.length > 0 && serviceCards.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Active tab class switch
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                serviceCards.forEach(card => {
                    const cardCategory = card.getAttribute("data-category");
                    
                    if (filterValue === "all" || cardCategory === filterValue) {
                        card.classList.remove("hidden");
                        // Fade in transition
                        card.style.opacity = "0";
                        card.style.transform = "translateY(15px)";
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "translateY(0)";
                        }, 50);
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    // --- 5. ANIMATED STATS COUNTER ---
    const statsSection = document.querySelector(".stats-bar");
    const statCounters = document.querySelectorAll(".counter-value");

    if (statsSection && statCounters.length > 0) {
        let countStarted = false;

        const countUp = () => {
            statCounters.forEach(counter => {
                const target = parseInt(counter.getAttribute("data-target"));
                const suffix = counter.getAttribute("data-suffix") || "";
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // ~60fps

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.floor(count) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };

                updateCount();
            });
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countStarted) {
                    countStarted = true;
                    countUp();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(statsSection);
    }

    // --- 6. MODERN GALLERY MASONRY FILTER & LIGHTBOX MODAL ---
    const galleryItems = document.querySelectorAll(".gallery-item");
    const galleryFilters = document.querySelectorAll(".gallery-filters .tab-btn");
    
    // Lightbox nodes
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.querySelector(".lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");
    const lightboxPrev = document.querySelector(".lightbox-prev");
    const lightboxNext = document.querySelector(".lightbox-next");

    let currentGalleryIndex = 0;
    let visibleGalleryItems = [...galleryItems];

    // Gallery Category Filter
    if (galleryFilters.length > 0) {
        galleryFilters.forEach(btn => {
            btn.addEventListener("click", () => {
                galleryFilters.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");
                visibleGalleryItems = [];

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute("data-category");
                    
                    if (filterValue === "all" || itemCategory === filterValue) {
                        item.style.display = "block";
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "scale(1)";
                        }, 50);
                        visibleGalleryItems.push(item);
                    } else {
                        item.style.opacity = "0";
                        item.style.transform = "scale(0.9)";
                        setTimeout(() => {
                            item.style.display = "none";
                        }, 300);
                    }
                });
            });
        });
    }

    // Lightbox Functions
    if (galleryItems.length > 0 && lightbox) {
        // Open lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                // Find current item's index inside currently visible set
                currentGalleryIndex = visibleGalleryItems.indexOf(item);
                if (currentGalleryIndex === -1) currentGalleryIndex = 0;
                
                showLightboxImage();
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        const showLightboxImage = () => {
            if (visibleGalleryItems.length === 0) return;
            const currentItem = visibleGalleryItems[currentGalleryIndex];
            const img = currentItem.querySelector("img");
            if (img && lightboxImg) {
                lightboxImg.setAttribute("src", img.getAttribute("src"));
                lightboxImg.setAttribute("alt", img.getAttribute("alt") || "Meraki Salon");
            }
        };

        const nextImage = () => {
            currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryItems.length;
            showLightboxImage();
        };

        const prevImage = () => {
            currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
            showLightboxImage();
        };

        // Event listeners for controls
        if (lightboxClose) {
            lightboxClose.addEventListener("click", () => {
                lightbox.classList.remove("active");
                document.body.style.overflow = "initial";
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener("click", (e) => {
                e.stopPropagation();
                nextImage();
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", (e) => {
                e.stopPropagation();
                prevImage();
            });
        }

        // Close when clicking overlay (outside the image container)
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("active");
                document.body.style.overflow = "initial";
            }
        });

        // Keyboard controls
        document.addEventListener("keydown", (e) => {
            if (lightbox.classList.contains("active")) {
                if (e.key === "ArrowRight") nextImage();
                if (e.key === "ArrowLeft") prevImage();
                if (e.key === "Escape") {
                    lightbox.classList.remove("active");
                    document.body.style.overflow = "initial";
                }
            }
        });
    }

    // --- 7. PREMIUM TESTIMONIAL SLIDER ---
    const sliderTrack = document.querySelector(".testimonials-track");
    const slides = document.querySelectorAll(".testimonial-slide");
    const prevBtn = document.querySelector(".testimonial-btn.prev");
    const nextBtn = document.querySelector(".testimonial-btn.next");
    const dotsContainer = document.querySelector(".testimonial-dots");

    if (sliderTrack && slides.length > 0) {
        let currentIndex = 0;
        let autoSlideInterval;

        // Create dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement("div");
            dot.classList.add("testimonial-dot");
            if (idx === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                goToSlide(idx);
                resetAutoSlide();
            });
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".testimonial-dot");

        const updateSliderPosition = () => {
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Update dots
            if (dots.length > 0) {
                dots.forEach(dot => dot.classList.remove("active"));
                dots[currentIndex].classList.add("active");
            }
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateSliderPosition();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSliderPosition();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSliderPosition();
        };

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Auto slide
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, 6000); // every 6s
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        startAutoSlide();

        // Responsive adjustment on resize
        window.addEventListener("resize", () => {
            updateSliderPosition();
        });
    }

    // --- 8. FAQ ACCORDION TRANSITION ---
    const faqItems = document.querySelectorAll(".faq-item");

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector(".faq-header");
            const body = item.querySelector(".faq-body");

            if (header && body) {
                header.addEventListener("click", () => {
                    const isActive = item.classList.contains("active");

                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove("active");
                            otherItem.querySelector(".faq-body").style.maxHeight = null;
                        }
                    });

                    // Toggle current item
                    if (isActive) {
                        item.classList.remove("active");
                        body.style.maxHeight = null;
                    } else {
                        item.classList.add("active");
                        body.style.maxHeight = body.scrollHeight + "px";
                    }
                });
            }
        });
    }

    // --- 9. APPOINTMENT FORM VALIDATION & SUCCESS MODAL ---
    const bookingForm = document.getElementById("bookingForm");
    const successModalOverlay = document.getElementById("successModalOverlay");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    if (bookingForm && successModalOverlay) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Form inputs
            const fullName = document.getElementById("booking_name").value.trim();
            const phone = document.getElementById("booking_phone").value.trim();
            const serviceSelect = document.getElementById("booking_service");
            const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
            const date = document.getElementById("booking_date").value;
            const time = document.getElementById("booking_time").value;
            const message = document.getElementById("booking_message").value.trim();

            // Simple client-side validation
            if (!fullName || !phone || !date || !time || serviceSelect.value === "") {
                alert("Please fill in all required fields.");
                return;
            }

            // Populate modal success details
            document.getElementById("modal_res_name").innerText = fullName;
            document.getElementById("modal_res_phone").innerText = phone;
            document.getElementById("modal_res_service").innerText = serviceText;
            document.getElementById("modal_res_datetime").innerText = `${formatDate(date)} at ${formatTime(time)}`;

            // Optional LocalStorage Save (Luxury Admin Feature)
            const newAppointment = {
                id: 'MERAKI-' + Date.now(),
                fullName,
                phone,
                service: serviceText,
                dateTime: `${date} ${time}`,
                message,
                created_at: new Date().toISOString()
            };

            const existingAppointments = JSON.parse(localStorage.getItem("meraki_appointments") || "[]");
            existingAppointments.push(newAppointment);
            localStorage.setItem("meraki_appointments", JSON.stringify(existingAppointments));

            // Show beautiful Success Modal
            successModalOverlay.classList.add("active");
            document.body.style.overflow = "hidden";

            // Reset the form
            bookingForm.reset();
        });

        // Close Success Modal
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", () => {
                successModalOverlay.classList.remove("active");
                document.body.style.overflow = "initial";
            });
        }

        successModalOverlay.addEventListener("click", (e) => {
            if (e.target === successModalOverlay) {
                successModalOverlay.classList.remove("active");
                document.body.style.overflow = "initial";
            }
        });
    }

    // Date & Time Formatting Utilities
    function formatDate(dateStr) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', options);
    }

    function formatTime(timeStr) {
        const [hourStr, minStr] = timeStr.split(':');
        const hour = parseInt(hourStr);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minStr} ${ampm}`;
    }

    // --- 10. SCROLL REVEAL OBSERVER ---
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    // Once animate, stop observing
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is in full view
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
