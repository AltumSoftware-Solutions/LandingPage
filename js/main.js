/**
 * ALTUM SOFTWARE - MAIN JAVASCRIPT
 * Handles theme toggle, navbar behaviors, scroll reveals, and contact form
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initScrollReveal();
  initMouseGlow();
  initContactForm();
  initWhatsAppFloating();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('altum_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('altum_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'fas fa-sun';
  }
}

/* ==========================================================================
   2. Navbar Behaviors & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll background glass effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-links a[href*="${sectionId}"]`).forEach(link => {
          link.classList.add('active');
        });
      } else {
        document.querySelectorAll(`.nav-links a[href*="${sectionId}"]`).forEach(link => {
          link.classList.remove('active');
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        icon.className = mobileMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* ==========================================================================
   3. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   4. Dynamic Mouse Radial Glow Effect
   ========================================================================== */
function initMouseGlow() {
  const cards = document.querySelectorAll('.service-card, .estimator-wrapper, .portfolio-card, .benefit-card');
  
  document.addEventListener('mousemove', (e) => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. Contact Form Handler & WhatsApp Bridge
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const service = document.getElementById('contactService')?.value;
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      alert('Por favor, completa los campos requeridos (Nombre, Email y Mensaje).');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando solicitud...';
    submitBtn.disabled = true;

    // Simulate reliable async request
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <i class="fas fa-check-circle"></i> ¡Gracias, <strong>${name}</strong>! Hemos recibido tu solicitud con éxito. Un ingeniero de software de Altum se contactará contigo en menos de 2 horas.
        `;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
}

/* ==========================================================================
   6. Floating WhatsApp Interaction
   ========================================================================== */
function initWhatsAppFloating() {
  const bubble = document.querySelector('.whatsapp-bubble');
  if (bubble) {
    setTimeout(() => {
      bubble.style.display = 'block';
    }, 3000);
  }
}
