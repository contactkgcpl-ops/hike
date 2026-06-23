/* ==========================================================================
   Salvin Brand Website Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Interaction
    const header = document.getElementById('mainHeader');
    const scrollThreshold = 20;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Call handler immediately on load to catch current scroll position
    handleScroll();

    // 2. Mobile Nav Drawer Interaction
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    const toggleMobileMenu = () => {
        const isActive = mobileToggle.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    const openMobileMenu = () => {
        mobileToggle.classList.add('active');
        navMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    const closeMobileMenu = () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scrolling
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking on any navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        // Exclude the services toggle since it needs to open a submenu on mobile
        if (link.id !== 'servicesToggle') {
            link.addEventListener('click', closeMobileMenu);
        }
    });

    // 3. Mobile Dropdown Toggle Interaction
    const servicesToggle = document.getElementById('servicesToggle');
    const servicesDropdown = servicesToggle.closest('.dropdown');

    servicesToggle.addEventListener('click', (e) => {
        // Only run click handler on mobile/tablet viewports
        if (window.innerWidth <= 991) {
            e.preventDefault();
            servicesDropdown.classList.toggle('active');
        }
    });

    // Handle screen resize, reset state if transitioned from mobile to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) {
            closeMobileMenu();
            servicesDropdown.classList.remove('active');
        }
    });

    // 4. WhatsApp B2B Form Redirect
    const inquiryForms = document.querySelectorAll('form');
    inquiryForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const name = form.querySelector('#fullName')?.value || form.querySelector('#name')?.value || '';
            const company = form.querySelector('#companyName')?.value || form.querySelector('#company')?.value || 'N/A';
            const email = form.querySelector('#emailAddress')?.value || form.querySelector('#email')?.value || '';
            const phone = form.querySelector('#phoneNumber')?.value || form.querySelector('#phone')?.value || '';

            // Extract selects/dropdowns
            const productCategory = form.querySelector('#productCategory')?.value || '';
            const projectScale = form.querySelector('#projectScale')?.value || '';
            const complianceNeed = form.querySelector('#complianceNeed')?.value || '';
            const monthlyVolume = form.querySelector('#monthlyVolume')?.value || '';
            const expansionChannel = form.querySelector('#expansionChannel')?.value || '';

            // Textarea message/details
            const details = form.querySelector('#projectDetails')?.value || form.querySelector('#message')?.value || '';

            // Determine form source context (page title / heading)
            const formSource = form.closest('section')?.querySelector('h3')?.innerText || document.title;

            // Format message template
            let msg = `*New B2B Inquiry - Hike Website*\n`;
            msg += `===============================\n`;
            msg += `*Source:* ${formSource}\n\n`;
            msg += `*Name:* ${name}\n`;
            if (company && company !== 'N/A') {
                msg += `*Company:* ${company}\n`;
            }
            msg += `*Email:* ${email}\n`;
            msg += `*Phone:* ${phone}\n`;

            if (productCategory) msg += `*Category/Service:* ${productCategory.toUpperCase()}\n`;
            if (projectScale) msg += `*CapEx Scale:* ${projectScale.toUpperCase()}\n`;
            if (complianceNeed) msg += `*Compliance Need:* ${complianceNeed.toUpperCase()}\n`;
            if (monthlyVolume) msg += `*Monthly Volume:* ${monthlyVolume.toUpperCase()}\n`;
            if (expansionChannel) msg += `*Expansion Channel:* ${expansionChannel.toUpperCase()}\n`;

            msg += `\n*Project Scope / Message:*\n${details}\n`;
            msg += `===============================`;

            // Encode text block
            const encodedText = encodeURIComponent(msg);
            const targetPhone = '919898727796'; // Indian country code + number

            // Open WhatsApp direct link in new window
            window.open(`https://wa.me/${targetPhone}?text=${encodedText}`, '_blank');
        });
    });

    // 5. Global CTA WhatsApp Redirect
    const targetPhoneNum = '919898727796'; // Indian country code + number

    document.addEventListener('click', (e) => {
        const cta = e.target.closest('a.btn');
        if (!cta) return;

        const href = cta.getAttribute('href') || '';
        const classes = cta.className;
        const text = cta.textContent.trim();

        // Check if it is a conversion CTA
        const isConversionCTA = 
            href.includes('contact.html') || 
            href.startsWith('#consultation') || 
            href.startsWith('#discuss') || 
            href.startsWith('#contact') ||
            classes.includes('btn-consultation-header') ||
            classes.includes('btn-banner-cta') ||
            classes.includes('btn-case-enquiry');

        if (isConversionCTA) {
            e.preventDefault();

            // Construct message based on context
            let message = 'Hello Hike, ';
            
            // Check for query parameters first (e.g. subject for case studies)
            if (href.includes('subject=')) {
                try {
                    const urlParams = new URLSearchParams(href.split('?')[1]);
                    const subject = urlParams.get('subject');
                    if (subject) {
                        message += `I would like to discuss a project similar to: *${decodeURIComponent(subject)}*.`;
                    } else {
                        message += 'I would like to enquire about your consulting services.';
                    }
                } catch (err) {
                    message += 'I would like to enquire about your consulting services.';
                }
            } else if (text.toLowerCase().includes('consultation')) {
                message += 'I would like to book a *free consultation* for my food and beverage business.';
            } else if (classes.includes('btn-banner-cta')) {
                message += 'I would like to discuss my project goals and explore how we can *build the future of food together*.';
            } else {
                message += `I would like to enquire about your food and beverage consulting services. (${text})`;
            }

            const encodedText = encodeURIComponent(message);
            window.open(`https://wa.me/${targetPhoneNum}?text=${encodedText}`, '_blank');
        }
    });

    // 6. Hero Background Slideshow Slider with Navigation Buttons
    const heroSlides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');

    if (heroSlides.length > 0) {
        let activeSlideIndex = 0;
        let slideTimer = null;
        const slideChangeInterval = 6000; // Switch slide every 6 seconds

        const showSlide = (index) => {
            heroSlides[activeSlideIndex].classList.remove('active');
            
            activeSlideIndex = index;
            if (activeSlideIndex >= heroSlides.length) {
                activeSlideIndex = 0;
            } else if (activeSlideIndex < 0) {
                activeSlideIndex = heroSlides.length - 1;
            }
            
            heroSlides[activeSlideIndex].classList.add('active');
        };

        const startAutoSlide = () => {
            stopAutoSlide();
            slideTimer = setInterval(() => {
                showSlide(activeSlideIndex + 1);
            }, slideChangeInterval);
        };

        const stopAutoSlide = () => {
            if (slideTimer) {
                clearInterval(slideTimer);
            }
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(activeSlideIndex - 1);
                startAutoSlide(); // Reset auto timer
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(activeSlideIndex + 1);
                startAutoSlide(); // Reset auto timer
            });
        }

        // Start slide show
        startAutoSlide();
    }
});
