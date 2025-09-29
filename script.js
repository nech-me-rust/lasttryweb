// Main website functionality
class WebsiteManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'cs';
        this.translations = {};
        this.init();
    }
    
    async init() {
        await this.loadTranslations();
        this.setupNavigation();
        this.setupLanguageSwitcher();
        this.setupAnimations();
        this.applyLanguage(this.currentLang);
    }
    
    async loadTranslations() {
        try {
            const response = await fetch('translations.json');
            if (response.ok) {
                this.translations = await response.json();
            }
        } catch (error) {
            console.log('Translations file not found, using data attributes');
        }
    }
    
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                }
            }
        });
    }
    
    setupLanguageSwitcher() {
        const langToggle = document.getElementById('lang-toggle');
        const langText = document.querySelector('.lang-text');
        
        if (langToggle && langText) {
            // Set initial button text
            langText.textContent = this.currentLang === 'cs' ? 'EN' : 'CZ';
            
            langToggle.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'cs' ? 'en' : 'cs';
                this.applyLanguage(this.currentLang);
                localStorage.setItem('language', this.currentLang);
                
                // Update button text
                langText.textContent = this.currentLang === 'cs' ? 'EN' : 'CZ';
            });
        }
    }
    
    applyLanguage(lang) {
        document.documentElement.lang = lang;
        
        // Update all elements with data attributes
        const elements = document.querySelectorAll('[data-cs][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = text;
                } else if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
        
        // Update page title
        const titleMap = {
            'index.html': { cs: 'Nech mě růst - Domů', en: 'Let Me Grow - Home' },
            'zvireci-obyvatele.html': { cs: 'Nech mě růst - Zvířecí obyvatelé', en: 'Let Me Grow - Animal Residents' },
            'virtualni-adopce.html': { cs: 'Nech mě růst - Virtuální adopce', en: 'Let Me Grow - Virtual Adoption' },
            'udalosti.html': { cs: 'Nech mě růst - Události', en: 'Let Me Grow - Events' },
            'kontakt.html': { cs: 'Nech mě růst - Kontakt', en: 'Let Me Grow - Contact' },
            'prispet-kryptem.html': { cs: 'Nech mě růst - Přispět kryptem', en: 'Let Me Grow - Donate with Crypto' }
        };
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (titleMap[currentPage]) {
            document.title = titleMap[currentPage][lang];
        }
        
        // Update form labels and placeholders
        this.updateFormElements(lang);
        
        // Update calendar if on events page
        if (window.eventsManager) {
            window.eventsManager.renderCalendar();
        }
    }
    
    updateFormElements(lang) {
        // Update form placeholders
        const placeholders = {
            cs: {
                'name': 'Vaše jméno',
                'email': 'vas@email.cz',
                'phone': '+420 123 456 789',
                'message': 'Vaše zpráva...',
                'dietary': 'Vegetarián, vegan, alergie...',
                'reg-message': 'Další informace, dotazy...'
            },
            en: {
                'name': 'Your name',
                'email': 'your@email.com',
                'phone': '+420 123 456 789',
                'message': 'Your message...',
                'dietary': 'Vegetarian, vegan, allergies...',
                'reg-message': 'Additional information, questions...'
            }
        };
        
        Object.keys(placeholders[lang]).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.placeholder = placeholders[lang][id];
            }
        });
        
        // Update select options
        const selectOptions = {
            'subject': {
                cs: {
                    '': 'Vyberte předmět...',
                    'visit': 'Zájem o návštěvu',
                    'adoption': 'Virtuální adopce',
                    'volunteer': 'Dobrovolnictví',
                    'donation': 'Finanční podpora',
                    'other': 'Jiné'
                },
                en: {
                    '': 'Select subject...',
                    'visit': 'Interest in visiting',
                    'adoption': 'Virtual adoption',
                    'volunteer': 'Volunteering',
                    'donation': 'Financial support',
                    'other': 'Other'
                }
            }
        };
        
        Object.keys(selectOptions).forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const options = select.querySelectorAll('option');
                options.forEach(option => {
                    const value = option.value;
                    if (selectOptions[selectId][lang][value]) {
                        option.textContent = selectOptions[selectId][lang][value];
                    }
                });
            }
        });
    }
    
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.value-card, .animal-card, .event-card, .type-card, .contact-card, .step');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
        
        // Parallax effect for hero sections
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImages = document.querySelectorAll('.hero-bg');
            
            heroImages.forEach(img => {
                const speed = 0.5;
                img.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
        
        // Smooth hover effects for cards
        const cards = document.querySelectorAll('.value-card, .animal-card, .event-card, .type-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    formatDate(date, lang = 'cs') {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US', options);
    }
}

// Contact form handling
class ContactFormManager {
    constructor() {
        this.init();
    }
    
    init() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
    }
    
    handleSubmit(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validation
        if (!data.name || !data.email || !data.message) {
            websiteManager.showNotification('Prosím vyplňte všechna povinná pole.', 'error');
            return;
        }
        
        if (!websiteManager.validateEmail(data.email)) {
            websiteManager.showNotification('Prosím zadejte platnou emailovou adresu.', 'error');
            return;
        }
        
        // Create email content
        const subject = encodeURIComponent(`Kontakt z webu: ${data.subject}`);
        const body = encodeURIComponent(`
Dobrý den,

kontaktuje vás ${data.name} prostřednictvím kontaktního formuláře na webu.

Předmět: ${data.subject}
Email: ${data.email}

Zpráva:
${data.message}

S pozdravem,
${data.name}
        `);
        
        // Open email client
        window.location.href = `mailto:info@nechmerust.org?subject=${subject}&body=${body}`;
        
        websiteManager.showNotification('Zpráva byla připravena k odeslání!', 'success');
        
        // Reset form
        e.target.reset();
    }
}

// Initialize when DOM is loaded
let websiteManager;
let contactFormManager;

document.addEventListener('DOMContentLoaded', () => {
    websiteManager = new WebsiteManager();
    contactFormManager = new ContactFormManager();
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('button, .btn, .support-btn, .adopt-btn, .contact-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                const originalText = this.textContent;
                this.innerHTML = '<span class="loading"></span>';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1000);
            }
        });
    });
    
        // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add smooth transitions to all interactive elements
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
        
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


// Export for use in other scripts
window.websiteManager = websiteManager;

