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

// Detect if device is mobile/tablet
const isMobile = window.innerWidth <= 1024;

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-content h4');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Initialize Locomotive Scroll and GSAP
let locoScroll;

function init() {
    gsap.registerPlugin(ScrollTrigger);

    locoScroll = new LocomotiveScroll({
        el: document.querySelector(".main"),
        smooth: true,
        multiplier: isMobile ? 0.8 : 1,
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

// Smooth Scroll Navigation
function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (target && locoScroll) {
        const targetPosition = target.offsetTop;
        locoScroll.scrollTo(targetPosition, {
            duration: 1500,
            easing: [0.25, 0.0, 0.35, 1.0]
        });
    }
}

// Navigation click handlers
const navItems = document.querySelectorAll('[data-scroll-to]');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-scroll-to');
        scrollToSection(targetId);
        
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Custom Cursor - Only for desktop
if (!isMobile) {
    const cursor = document.querySelector(".cursor");
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener("mousemove", function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });
}

// Hero Section Animations
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
if (!isMobile) {
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

// Background color transitions
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

// Services hover effects - Enhanced for desktop
if (!isMobile) {
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

// Client boxes hover with cursor effect - Enhanced
if (!isMobile) {
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
                backgroundColor: "#EDBFFF",
                border: "none",
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

// Navigation hover effects
const navItemsHover = document.querySelectorAll("#nav h4");
const purple = document.querySelector("#purple");
const nav = document.querySelector("#nav");

navItemsHover.forEach(item => {
    item.addEventListener("mouseenter", function() {
        purple.classList.add('active');
        if (nav) {
            nav.classList.add('light-mode');
        }
    });
    
    item.addEventListener("mouseleave", function() {
        purple.classList.remove('active');
        if (nav) {
            nav.classList.remove('light-mode');
        }
    });
});

// Parallax effect for videos - Only for desktop
if (!isMobile) {
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

// Footer animation
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

// Add magnetic effect to buttons - Only for desktop
if (!isMobile) {
    document.querySelectorAll('button').forEach(button => {
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

// Optimize performance on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        if (locoScroll) {
            locoScroll.update();
        }
    }, 250);
});