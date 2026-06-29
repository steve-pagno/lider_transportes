document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       MOBILE MENU TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('open');
            
            // Toggle hamburger icon animation
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('open');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    /* ==========================================
       STICKY HEADER ON SCROLL
       ========================================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       ACTIVE LINK HIGHLIGHTING
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNavigation);

    /* ==========================================
       SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animates only once
                }
            });
        }, observerOptions);
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    /* ==========================================
       PRE-FILL SERVICE IN THE FORM
       ========================================== */
    const selectServiceForm = document.getElementById('form-service');
    const serviceButtons = document.querySelectorAll('.select-service-btn');
    
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedService = btn.getAttribute('data-service');
            if (selectServiceForm) {
                if (selectedService === 'cacamba') {
                    selectServiceForm.value = 'caçamba';
                } else if (selectedService === 'pipa') {
                    selectServiceForm.value = 'caminhão-pipa';
                }
            }
        });
    });

    /* ==========================================
       INTERACTIVE BUDGET WHATSAPP REDIRECTION
       ========================================== */
    const orcamentoForm = document.getElementById('orcamento-form');
    
    if (orcamentoForm) {
        orcamentoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Fetch inputs
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const service = document.getElementById('form-service').value;
            const address = document.getElementById('form-address').value.trim();
            const notes = document.getElementById('form-notes').value.trim();
            
            // Format WhatsApp Message
            let formattedService = '';
            if (service === 'caçamba') {
                formattedService = 'Locação de Caçambas';
            } else if (service === 'caminhão-pipa') {
                formattedService = 'Fornecimento de Caminhão-Pipa';
            } else if (service === 'ambos') {
                formattedService = 'Caçamba e Caminhão-Pipa';
            }
            
            const message = `Olá Líder Transportes! Gostaria de solicitar um orçamento:\n\n` +
                            `👤 *Nome:* ${name}\n` +
                            `📞 *WhatsApp:* ${phone}\n` +
                            `🛠️ *Serviço:* ${formattedService}\n` +
                            `📍 *Endereço/CEP:* ${address}\n` +
                            (notes ? `📝 *Detalhes:* ${notes}` : '');
            
            // Encode text for URL
            const encodedText = encodeURIComponent(message);
            
            // Líder Transportes WhatsApp Number
            const whatsappNumber = '5521999672923';
            
            // Final link
            const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;
            
            // Open WhatsApp in a new tab
            window.open(waUrl, '_blank');
        });
    }
});
