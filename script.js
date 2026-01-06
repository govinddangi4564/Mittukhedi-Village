document.addEventListener('DOMContentLoaded', () => {

    // --- Language Toggle Logic ---
    const langToggleBtn = document.getElementById('lang-toggle');
    const body = document.body;
    let currentLang = 'hi'; // Default language

    langToggleBtn.addEventListener('click', () => {
        if (currentLang === 'en') {
            body.classList.remove('lang-en');
            body.classList.add('lang-hi');
            currentLang = 'hi';
        } else {
            body.classList.remove('lang-hi');
            body.classList.add('lang-en');
            currentLang = 'en';
        }
    });

    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');
    const overlay = document.querySelector('.mobile-menu-overlay');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
            // Smooth scroll
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Ripple Effect on Buttons ---
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    const buttons = document.querySelectorAll('.btn-primary, .btn-toggle');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });


    // --- Scroll Animations ---
    const animatedElementsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const staggerParent = entry.target.closest('[data-stagger-children]');
                if (staggerParent) {
                    // Find all animated children of the stagger parent to determine the index
                    const animatedChildren = Array.from(staggerParent.querySelectorAll('[data-animation]'));
                    const elIndex = animatedChildren.indexOf(entry.target);
                    const baseDelay = parseInt(staggerParent.dataset.staggerDelay) || 150;
                    const delay = elIndex * baseDelay;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    const elementsToAnimate = document.querySelectorAll('[data-animation]');
    elementsToAnimate.forEach(element => {
        element.classList.add('animated-on-scroll');
        animatedElementsObserver.observe(element);
    });



    // --- Swiper Slider ---
    // --- Swiper Slider ---
    try {
        if (typeof Swiper !== 'undefined') {
            console.log('Swiper is defined, initializing...');
            var swiper = new Swiper('.gallery-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                    },
                    1280: {
                        slidesPerView: 4,
                        spaceBetween: 50,
                    }
                }
            });
            console.log('Swiper initialized:', swiper);
        } else {
            console.error('Swiper is NOT defined. CDN might be blocked or failed to load.');
            alert('Error: Image Slider library (Swiper) failed to load. Check internet connection.');
        }
    } catch (err) {
        console.error('Swiper initialization failed:', err);
    }

    /* --- Photo Upload Logic (Temporary - Session Only) --- */
    const uploadInput = document.getElementById('photoUpload');

    // Handle new file selection
    if (uploadInput) {
        uploadInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file (JPG, PNG).');
                return;
            }

            // Create a temporary URL for the image (Session Only)
            const photoURL = URL.createObjectURL(file);

            // Add to UI
            addPhotoToGallery(photoURL);
        });
    }

    // Helper: Add photo to Grid DOM
    function addPhotoToGallery(imgSrc) {
        const grid = document.getElementById('user-upload-grid');
        if (!grid) return;

        // Create Grid Item
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        // Add a fade-in animation
        gridItem.style.animation = 'zoom-in 0.5s ease-out';

        gridItem.innerHTML = `
            <img src="${imgSrc}" alt="Community Photo">
        `;

        // Append to Grid (at start)
        const firstChild = grid.firstChild;
        if (firstChild) {
            grid.insertBefore(gridItem, firstChild);
        } else {
            grid.appendChild(gridItem);
        }
    }


});
