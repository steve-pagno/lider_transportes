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
       BUDGET FORM SUBMISSION (WEB3FORMS)
       ========================================== */
    const orcamentoForm = document.getElementById('orcamento-form');
    const formMessage = document.getElementById('form-message');
    
    if (orcamentoForm) {
        const submitBtn = orcamentoForm.querySelector('button[type="submit"]');
        
        orcamentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous messages
            if (formMessage) {
                formMessage.className = 'form-message';
                formMessage.style.display = 'none';
                formMessage.textContent = '';
            }

            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando...';
            submitBtn.disabled = true;

            const formData = new FormData(orcamentoForm);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    if (formMessage) {
                        formMessage.textContent = "Sucesso! Seu pedido de orçamento foi enviado com sucesso. Entraremos em contato em breve.";
                        formMessage.classList.add('success');
                    }
                    orcamentoForm.reset();
                } else {
                    if (formMessage) {
                        formMessage.textContent = "Erro ao enviar: " + (data.message || "Por favor, tente novamente.");
                        formMessage.classList.add('error');
                    }
                }

            } catch (error) {
                if (formMessage) {
                    formMessage.textContent = "Algo deu errado. Por favor, verifique sua conexão e tente novamente.";
                    formMessage.classList.add('error');
                }
            } finally {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    }
});
