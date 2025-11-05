// Preloader Animation
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progress = document.querySelector('.preloader-progress');
    const percent = document.querySelector('.preloader-percent');
    
    let count = 0;
    const interval = setInterval(() => {
        count += Math.random() * 10;
        if (count > 100) count = 100;
        
        progress.style.width = count + '%';
        percent.textContent = Math.floor(count) + '%';
        
        if (count >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 300);
        }
    }, 50);
});

// ==================== DEVICE DETECTION ====================
const isMobileDevice = window.innerWidth <= 1024;

// ==================== ENHANCED CUSTOM CURSOR ====================
if (!isMobileDevice) {
    const cursor = document.querySelector(".cursor");
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // Smooth cursor follow
    document.addEventListener("mousemove", function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        cursorX += diffX * 0.15;
        cursorY += diffY * 0.15;
        
        if (cursor) {
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor hover effects for all interactive elements
    const hoverElements = document.querySelectorAll(
        'a, button, [data-scroll-to], .box, .elem, .nav-logo, .nav-item, .nav-btn, .social-link, .mobile-nav-close, .mobile-nav-item'
    );
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Cursor click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-click');
    });
}

// ==================== NAVIGATION ELEMENTS ====================
const nav = document.getElementById('nav');
const navLogo = document.querySelector('.nav-logo');
const navItems = document.querySelectorAll('.nav-item');
const navHamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const allNavLinks = document.querySelectorAll('[data-scroll-to]');

// ==================== LOCOMOTIVE SCROLL INITIALIZATION ====================
let locoScroll;

function init() {
    gsap.registerPlugin(ScrollTrigger);

    locoScroll = new LocomotiveScroll({
        el: document.querySelector(".main"),
        smooth: true,
        multiplier: isMobileDevice ? 0.8 : 1,
        smoothMobile: true,
        smartphone: {
            smooth: true,
            multiplier: 0.6
        },
        tablet: {
            smooth: true,
            multiplier: 0.8
        }
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector(".main").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
}

init();

// ==================== SMOOTH SCROLL FUNCTIONALITY ====================
function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (target && locoScroll) {
        locoScroll.scrollTo(target, {
            duration: 1400,
            easing: [0.25, 0.0, 0.35, 1.0],
            offset: -80
        });
    }
}

// Handle all navigation clicks
allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-scroll-to');
        
        // Close mobile menu if open
        closeMobileMenu();
        
        // Scroll to section
        scrollToSection(targetId);
        
        // Update active state for desktop nav
        if (!isMobileDevice) {
            updateActiveNavItem(targetId);
        }
    });
});

// Update active nav item
function updateActiveNavItem(activeId) {
    navItems.forEach(item => {
        const itemTarget = item.getAttribute('data-scroll-to');
        if (itemTarget === activeId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ==================== MOBILE MENU FUNCTIONALITY ====================
function openMobileMenu() {
    navHamburger.classList.add('active');
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate menu items
    gsap.from('.mobile-nav-item', {
        x: 100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
    });
    
    gsap.from('.mobile-nav-cta', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: "power3.out"
    });
    
    gsap.from('.mobile-nav-info', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.7,
        ease: "power3.out"
    });
    
    gsap.from('.mobile-nav-social .social-link', {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.8,
        ease: "back.out(1.7)"
    });
}

function closeMobileMenu() {
    navHamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Hamburger click
if (navHamburger) {
    navHamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileNav.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Close button click
if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
}

// Overlay click
if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
}

// Mobile nav item clicks
mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-scroll-to');
        closeMobileMenu();
        setTimeout(() => {
            scrollToSection(targetId);
        }, 400);
    });
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ==================== NAVIGATION SCROLL EFFECTS ====================
let lastScrollY = 0;
let scrollDirection = 'up';

if (locoScroll) {
    locoScroll.on('scroll', (args) => {
        const currentScroll = args.scroll.y;
        
        // Determine scroll direction
        scrollDirection = currentScroll > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScroll;
        
        // Add scrolled class
        if (currentScroll > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
        
        // Update active nav based on scroll position
        updateActiveNavOnScroll(currentScroll);
    });
}

// Update active navigation based on scroll position
function updateActiveNavOnScroll(scrollY) {
    const sections = ['hero', 'studio', 'work', 'contact'];
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.3;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollY + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop - threshold && scrollY < sectionBottom - threshold) {
                updateActiveNavItem(sectionId);
            }
        }
    });
}

// ==================== NAVIGATION ANIMATIONS ====================

// Logo hover animation
if (navLogo) {
    navLogo.addEventListener('mouseenter', () => {
        if (!isMobileDevice) {
            gsap.to('.logo-container', {
                rotation: 360,
                scale: 1.1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
    
    navLogo.addEventListener('mouseleave', () => {
        if (!isMobileDevice) {
            gsap.to('.logo-container', {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
}

// Nav items hover animation
navItems.forEach(item => {
    if (!isMobileDevice) {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.nav-link'), {
                y: -2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                gsap.to(item.querySelector('.nav-link'), {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }
});

// Button magnetic effect (desktop only)
if (!isMobileDevice) {
    const navButtons = document.querySelectorAll('.nav-btn, .footer-cta, .mobile-cta-btn, .page2-right button');
    
    navButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
}

// ========== FIXED: Initial nav animation - REMOVED transform animations ==========
// Simply fade in the nav without moving it
gsap.from('#nav', {
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
});

gsap.from('.nav-logo', {
    opacity: 0,
    duration: 0.8,
    delay: 0.7,
    ease: "power3.out"
});

gsap.from('.nav-item', {
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.8,
    ease: "power3.out"
});

gsap.from('.nav-btn', {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay: 1,
    ease: "back.out(1.7)"
});

gsap.from('.nav-status', {
    opacity: 0,
    duration: 0.8,
    delay: 1.2,
    ease: "power3.out"
});

// ==================== HERO SECTION ANIMATIONS ====================
gsap.from(".hero-badge", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
});

gsap.from(".page1 h1", {
    y: 100,
    opacity: 0,
    duration: 1,
    delay: 0.7,
    ease: "power3.out"
});

gsap.from(".page1 h2", {
    y: 100,
    opacity: 0,
    duration: 1,
    delay: 0.9,
    ease: "power3.out"
});

gsap.from(".hero-description", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 1.1,
    ease: "power3.out"
});

gsap.from(".page1 video", {
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    delay: 1.3,
    ease: "power3.out"
});

// Scroll-triggered animations for hero - Only for desktop
if (!isMobileDevice) {
    const heroTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".page1 h1",
            scroller: ".main",
            start: "top 20%",
            end: "top -20%",
            scrub: 2
        }
    });

    heroTimeline.to(".page1 h1", {
        x: -150,
        opacity: 0.7
    }, "sync");

    heroTimeline.to(".page1 h2", {
        x: 150,
        opacity: 0.7
    }, "sync");

    heroTimeline.to(".page1 video", {
        width: "95%",
        scale: 1.1
    }, "sync");
}

// ==================== BACKGROUND COLOR TRANSITIONS ====================
const bgTimeline1 = gsap.timeline({
    scrollTrigger: {
        trigger: ".page2",
        scroller: ".main",
        start: "top 60%",
        end: "top 30%",
        scrub: 3
    }
});

bgTimeline1.to(".main", {
    backgroundColor: "#fff"
});

const bgTimeline2 = gsap.timeline({
    scrollTrigger: {
        trigger: ".page4",
        scroller: ".main",
        start: "top 60%",
        end: "top 30%",
        scrub: 3
    }
});

bgTimeline2.to(".main", {
    backgroundColor: "#0F0D0D"
});

// ==================== SECTION ANIMATIONS ====================

// Section fade-in animations
gsap.utils.toArray('.section-label').forEach(label => {
    gsap.from(label, {
        scrollTrigger: {
            trigger: label,
            scroller: ".main",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Stats counter animation
gsap.utils.toArray('.stat-box').forEach(stat => {
    const number = stat.querySelector('h3');
    const finalNumber = parseInt(number.textContent);
    
    gsap.from(number, {
        scrollTrigger: {
            trigger: stat,
            scroller: ".main",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        textContent: 0,
        duration: 2,
        ease: "power1.inOut",
        snap: { textContent: 1 },
        onUpdate: function() {
            number.textContent = Math.ceil(number.textContent) + '+';
        }
    });
});

// Portfolio items animation
gsap.utils.toArray('.project-item').forEach((item, index) => {
    gsap.from(item.querySelector('.project-media'), {
        scrollTrigger: {
            trigger: item,
            scroller: ".main",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    gsap.from(item.querySelector('.project-info'), {
        scrollTrigger: {
            trigger: item,
            scroller: ".main",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
    });
});

// ==================== SERVICES HOVER EFFECTS ====================
if (!isMobileDevice) {
    const services = document.querySelectorAll(".elem");
    
    services.forEach(elem => {
        const images = elem.querySelectorAll("img");
        const heading = elem.querySelector("h1");
        
        elem.addEventListener("mouseenter", function() {
            // Animate images one by one
            images.forEach((img, index) => {
                gsap.to(img, {
                    opacity: 1,
                    visibility: 'visible',
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: "power3.out"
                });
            });
            
            gsap.to(heading, {
                color: "#EDBFFF",
                x: 20,
                duration: 0.5,
                ease: "power3.out"
            });
            
            gsap.to(elem, {
                backgroundColor: "rgba(237, 191, 255, 0.03)",
                duration: 0.5
            });
        });
        
        elem.addEventListener("mouseleave", function() {
            // Hide images one by one in reverse
            images.forEach((img, index) => {
                gsap.to(img, {
                    opacity: 0,
                    visibility: 'hidden',
                    scale: 0.8,
                    y: 50,
                    duration: 0.5,
                    delay: (images.length - 1 - index) * 0.1,
                    ease: "power3.in"
                });
            });
            
            gsap.to(heading, {
                color: "#fff",
                x: 0,
                duration: 0.5,
                ease: "power3.out"
            });
            
            gsap.to(elem, {
                backgroundColor: "transparent",
                duration: 0.5
            });
        });
    });
}

// ==================== CLIENT BOXES HOVER ====================
if (!isMobileDevice) {
    const boxes = document.querySelectorAll(".box");
    const cursor = document.querySelector(".cursor");
    
    boxes.forEach(box => {
        box.addEventListener("mouseenter", function() {
            const imageUrl = box.getAttribute("data-image");
            
            gsap.to(cursor, {
                width: "450px",
                height: "350px",
                borderRadius: "15px",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "3px solid #EDBFFF",
                duration: 0.5,
                ease: "power3.out"
            });
            
            gsap.to(box, {
                scale: 1.02,
                duration: 0.3
            });
        });
        
        box.addEventListener("mouseleave", function() {
            gsap.to(cursor, {
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundImage: "none",
                backgroundColor: "rgba(237, 191, 255, 0.4)",
                border: "2px solid #EDBFFF",
                duration: 0.5,
                ease: "power3.in"
            });
            
            gsap.to(box, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// ==================== PARALLAX EFFECT ====================
if (!isMobileDevice) {
    gsap.utils.toArray('video').forEach(video => {
        gsap.to(video, {
            scrollTrigger: {
                trigger: video,
                scroller: ".main",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -50
        });
    });
}

// ==================== FOOTER ANIMATIONS ====================
gsap.from(".footer-top h2", {
    scrollTrigger: {
        trigger: "footer",
        scroller: ".main",
        start: "top 70%",
        toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".footer-cta", {
    scrollTrigger: {
        trigger: "footer",
        scroller: ".main",
        start: "top 70%",
        toggleActions: "play none none reverse"
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: "back.out(1.7)"
});

gsap.from(".footer-col", {
    scrollTrigger: {
        trigger: ".footer-content",
        scroller: ".main",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
});

// ==================== CTA BUTTON FUNCTIONALITY ====================
const ctaButtons = document.querySelectorAll('.nav-btn-primary, .footer-cta, .mobile-cta-btn, .nav-btn-secondary');

ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        
        const rect = button.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        button.appendChild(ripple);
        
        gsap.to(ripple, {
            width: 300,
            height: 300,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
        
        // Scroll to contact
        setTimeout(() => {
            scrollToSection('contact');
        }, 300);
    });
});

// ==================== WINDOW RESIZE HANDLER ====================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close mobile menu if resizing to desktop
        if (window.innerWidth > 1024 && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
        
        // Update Locomotive Scroll
        if (locoScroll) {
            locoScroll.update();
        }
    }, 250);
});
