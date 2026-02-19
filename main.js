// ============================================
// MAVERA DISTRIBUTORS - Main JavaScript
// Enhanced with all interactive components
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
const preloader = document.getElementById('preloader');

function hidePreloader() {
  if (!preloader || preloader.classList.contains('hidden')) return;

  preloader.classList.add('hidden');

  // remove after transition
  setTimeout(() => {
    preloader.remove();
  }, 500);
}

// DOM ready (fast)
document.addEventListener('DOMContentLoaded', hidePreloader);

// full load (backup)
window.addEventListener('load', hidePreloader);

// absolute fallback
setTimeout(hidePreloader, 2500);


  // --- Header scroll effect ---
  const header = document.getElementById('header');
  const scrollTop = document.getElementById('scrollTop');

  function handleScroll() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
      if (scrollTop) scrollTop.classList.add('visible');
    } else {
      // Only remove 'scrolled' on homepage (where header starts transparent)
      if (document.querySelector('.hero')) {
        header.classList.remove('scrolled');
      }
      if (scrollTop) scrollTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile menu toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // --- Scroll animations (Intersection Observer) ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // --- Animated stat counters ---
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- Contact form handler ---
  window.handleSubmit = function (e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (form && success) {
      form.style.display = 'none';
      success.style.display = 'block';
    }
  };

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Testimonials Carousel ---
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselDotsContainer = document.getElementById('carouselDots');

  if (carouselTrack && carouselPrev && carouselNext && carouselDotsContainer) {
    const cards = carouselTrack.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let slidesPerView = 3;
    let autoplayInterval;

    function updateSlidesPerView() {
      if (window.innerWidth <= 768) slidesPerView = 1;
      else if (window.innerWidth <= 1024) slidesPerView = 2;
      else slidesPerView = 3;
    }

    function getTotalSlides() {
      return Math.max(1, cards.length - slidesPerView + 1);
    }

    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 28; // includes margin
      const offset = currentSlide * cardWidth;
      carouselTrack.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function createDots() {
      carouselDotsContainer.innerHTML = '';
      const total = getTotalSlides();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => { currentSlide = i; updateCarousel(); resetAutoplay(); });
        carouselDotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % getTotalSlides();
      updateCarousel();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + getTotalSlides()) % getTotalSlides();
      updateCarousel();
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    carouselNext.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    carouselPrev.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Pause on hover
    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselTrack.addEventListener('mouseleave', startAutoplay);

    // Init
    updateSlidesPerView();
    createDots();
    startAutoplay();

    // Rebuild on resize
    window.addEventListener('resize', () => {
      updateSlidesPerView();
      currentSlide = Math.min(currentSlide, getTotalSlides() - 1);
      createDots();
      updateCarousel();
    });
  }

  // --- Newsletter ---
  const newsletterBtn = document.getElementById('newsletterBtn');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterBtn && newsletterEmail && newsletterSuccess) {
    newsletterBtn.addEventListener('click', () => {
      const email = newsletterEmail.value.trim();
      if (email && email.includes('@')) {
        newsletterEmail.value = '';
        newsletterSuccess.classList.add('show');
        setTimeout(() => newsletterSuccess.classList.remove('show'), 4000);
      } else {
        newsletterEmail.style.borderColor = '#ef4444';
        setTimeout(() => { newsletterEmail.style.borderColor = ''; }, 2000);
      }
    });
  }

  // --- Cookie Consent ---
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (cookieBanner && !localStorage.getItem('mavera_cookies')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);

    if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('mavera_cookies', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }
    if (cookieDecline) {
      cookieDecline.addEventListener('click', () => {
        localStorage.setItem('mavera_cookies', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

  // --- Smooth page transitions ---
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 250);
    });
  });

  // --- Parallax hero effect ---
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

});
