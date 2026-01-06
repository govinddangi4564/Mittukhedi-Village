document.addEventListener('DOMContentLoaded', () => {

    // --- Language Toggle Logic ---
    const langToggleBtn = document.getElementById('lang-toggle');
    const body = document.body;

    // Determine current language from localStorage or body class (default to Hindi)
    let currentLang = localStorage.getItem('siteLang') || (body.classList.contains('lang-hi') ? 'hi' : 'en');

    // Ensure valid lang if stored value is weird
    if (!['en', 'hi', 'mv'].includes(currentLang)) {
        currentLang = 'hi';
    }

    // Simple translations for runtime alerts/messages
    const translations = {
        upload_invalid: {
            en: 'Please upload an image file (JPG, PNG).',
            hi: 'कृपया एक छवि फ़ाइल (JPG, PNG) अपलोड करें।',
            mv: 'कृपया फोटो फाइल (JPG, PNG) डालो।'
        },
        swiper_fail: {
            en: 'Error: Image Slider library (Swiper) failed to load. Check internet connection.',
            hi: 'त्रुटि: इमेज स्लाइडर लाइब्रेरी (Swiper) लोड नहीं हुई। इंटरनेट कनेक्शन जाँचें।',
            mv: 'गड़बड़ी: फोटो स्लाइडर (Swiper) चालू नी हो रियो। नेट देख लो।'
        }
    };

    function setLanguage(lang) {
        // Reset all classes
        body.classList.remove('lang-en', 'lang-hi', 'lang-mv');

        // Add new class and update state
        body.classList.add(`lang-${lang}`);
        currentLang = lang;

        // Persist preference
        try {
            localStorage.setItem('siteLang', currentLang);
        } catch (e) {
            // ignore
        }
        // Update HTML lang attribute for accessibility
        try {
            document.documentElement.lang = currentLang;
        } catch (e) { }

        // Update toggle aria label and button text based on NEXT language in cycle
        // Update toggle aria label based on NEXT language in cycle for accessibility
        if (langToggleBtn) {
            let nextLangLabel = '';
            let currentLangLabel = '';

            if (lang === 'en') {
                currentLangLabel = 'English';
                nextLangLabel = 'Hindi';
            } else if (lang === 'hi') {
                currentLangLabel = 'Hindi';
                nextLangLabel = 'Malvi';
            } else { // mv
                currentLangLabel = 'Malvi';
                nextLangLabel = 'English';
            }

            // Aria-label should inform screen reader of current state and what action does
            langToggleBtn.setAttribute('aria-label', `Current language: ${currentLangLabel}. Click to switch to ${nextLangLabel}`);
        }
    }

    // Ensure default language is applied
    setLanguage(currentLang);

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            // Cycle: en -> hi -> mv -> en
            if (currentLang === 'en') {
                setLanguage('hi');
            } else if (currentLang === 'hi') {
                setLanguage('mv');
            } else {
                setLanguage('en');
            }
        });
    }

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
            alert(translations.swiper_fail[currentLang] || 'Image slider failed to load.');
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
                alert(translations.upload_invalid[currentLang] || 'Please upload an image file.');
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
