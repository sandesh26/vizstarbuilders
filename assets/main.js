// Component loading functionality with fallback
// Slide menu and header initialization (now handled by PHP includes)
document.addEventListener('DOMContentLoaded', function() {

  function loadHTML(elementId, filePath) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", filePath, false);
        try {
            xhr.send();
            if (xhr.status === 200) {
                document.getElementById(elementId).innerHTML = xhr.responseText;
            }
        } catch (e) {
            console.error("Error loading file:", e);
        }
    }

  // use root-relative paths so component requests don't resolve under /project/slug
  loadHTML("header-placeholder", "/components/header.html");
  loadHTML("slide-menu-placeholder", "/components/slide-menu.html");
  loadHTML("footer-placeholder", "/components/footer.html");

  // Set dynamic year in copyright
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  // Set dynamic year in footer
  const footerYearElement = document.getElementById('footerYear');
  if (footerYearElement) {
    footerYearElement.textContent = new Date().getFullYear();
  }

  //handleHeaderScroll();
  // If slide menu is present, initialize its functionality
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  if (openMenuBtn && closeMenuBtn && slideMenu && menuOverlay) {
    openMenuBtn.addEventListener('click', function() {
      slideMenu.classList.add('open');
      menuOverlay.classList.add('show');
    });
    closeMenuBtn.addEventListener('click', function() {
      slideMenu.classList.remove('open');
      menuOverlay.classList.remove('show');
    });
    menuOverlay.addEventListener('click', function() {
      slideMenu.classList.remove('open');
      menuOverlay.classList.remove('show');
    });
  }
});

// Project page scripts (migrated from project.html)
// Scoped: run only when a .project-bg exists on the page
document.addEventListener('DOMContentLoaded', function() {
  if (!document.querySelector('.project-bg')) return;

  const projectImages = [
    // 'assets/images/projects/vizstar/vizstar-1.jpg',
    // 'assets/images/projects/vizstar/vizstar-2.jpg',
    // 'assets/images/projects/vizstar/vizstar-3.jpg'
  ];

  let projectCurrentImageIndex = 0;
  let projectPendingIndex = null;

  const projectBg = document.querySelector('.project-bg');
  const thumbnails = Array.from(document.querySelectorAll('.project-thumbnail'));
  // If there are no configured images (projectImages empty) and no server-rendered
  // thumbnails, skip wiring this legacy project script to avoid trying to load
  // an undefined image URL (which caused requests to "/undefined"). The
  // modern `assets/js/project-loader.js` handles dynamic images when JSON or
  // thumbnails are present.
  if ((!projectImages || projectImages.length === 0) && thumbnails.length === 0) {
    // Nothing for this legacy script to do — bail out early.
    return;
  }
  const leftArrow = document.querySelector('.project-arrow.left');
  const rightArrow = document.querySelector('.project-arrow.right');

  function updateBackgroundImage(index) {
    if (!projectBg) return;
    if (projectBg.classList && projectBg.classList.contains('transitioning')) return;

    projectBg.classList.add('transitioning');

    const transitionOverlay = document.createElement('div');
    transitionOverlay.style.cssText = '\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n      background: rgba(0,0,0,0.3);\n      z-index: 1;\n      opacity: 0;\n      transition: opacity 0.4s ease;\n      pointer-events: none;\n    ';
    document.body.appendChild(transitionOverlay);

    // Fade in overlay quickly
    setTimeout(() => { transitionOverlay.style.opacity = '1'; }, 50);

    // Preload the image to avoid a blank frame when swapping src
    projectPendingIndex = index;
    const imgPre = new Image();
    imgPre.src = projectImages[index];

    const applyLoadedImage = () => {
      if (projectPendingIndex !== index) return; // a newer request arrived
      projectBg.src = imgPre.src;

      // Small pause so browser can paint; then remove transitioning and fade overlay
      setTimeout(() => {
        if (projectBg.classList) projectBg.classList.remove('transitioning');
        transitionOverlay.style.opacity = '0';
        setTimeout(() => { if (transitionOverlay.parentNode) transitionOverlay.parentNode.removeChild(transitionOverlay); }, 400);
      }, 100);
    };

    imgPre.onload = applyLoadedImage;
    imgPre.onerror = () => {
      // Fallback: still apply src (may 404) but ensure overlay is removed gracefully
      applyLoadedImage();
    };

    // Update thumbnails with stagger effect (visual feedback immediately)
    thumbnails.forEach((thumb, i) => {
      setTimeout(() => { thumb.classList.toggle('active', i === index); }, i * 50);
    });

    projectCurrentImageIndex = index;
  }

  function nextImage() {
    const next = (projectCurrentImageIndex + 1) % projectImages.length;
    updateBackgroundImage(next);
  }

  function prevImage() {
    const prev = (projectCurrentImageIndex - 1 + projectImages.length) % projectImages.length;
    updateBackgroundImage(prev);
  }

  if (leftArrow) leftArrow.addEventListener('click', prevImage);
  if (rightArrow) rightArrow.addEventListener('click', nextImage);

  thumbnails.forEach((thumb, index) => { if (thumb) thumb.addEventListener('click', () => updateBackgroundImage(index)); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Hide/Show info functionality
  const hideInfo = document.querySelector('.project-hide-info');
  const infoCard = document.querySelector('.project-info-card');
  const infoContent = document.querySelector('.project-info-content');
  // const mainContent = document.querySelector('.project-main-content'); // unused currently

  if (hideInfo && infoContent && infoCard) {
    hideInfo.setAttribute('role', 'button');
    hideInfo.setAttribute('aria-expanded', String(!infoContent.classList.contains('hidden')));

    hideInfo.addEventListener('click', () => {
      hideInfo.style.pointerEvents = 'none';

      const CARD_COLLAPSE_DELAY_MS = 480;
      const CARD_EXPAND_DELAY_MS = 320;
      const CARD_TRANSITION_MS = 700;

      const currentlyHidden = infoContent.classList.contains('hidden');

      if (!currentlyHidden) {
        infoContent.classList.add('hidden');
        hideInfo.setAttribute('aria-expanded', 'false');
        hideInfo.textContent = 'SHOW INFORMATION';
        setTimeout(() => infoCard.classList.add('hidden'), CARD_COLLAPSE_DELAY_MS);
        setTimeout(() => { hideInfo.style.pointerEvents = 'auto'; }, CARD_TRANSITION_MS + 120);
      } else {
        infoCard.classList.remove('hidden');
        hideInfo.setAttribute('aria-expanded', 'true');
        hideInfo.textContent = 'HIDE INFORMATION';
        setTimeout(() => infoContent.classList.remove('hidden'), CARD_EXPAND_DELAY_MS);
        setTimeout(() => { hideInfo.style.pointerEvents = 'auto'; }, CARD_TRANSITION_MS + 120);
      }
    });
  }

  // Add subtle loading animation helper
  function addLoadingEffect() {
    const loader = document.createElement('div');
    loader.style.cssText = '\n      position: fixed;\n      top: 50%;\n      left: 50%;\n      transform: translate(-50%, -50%);\n      width: 40px;\n      height: 40px;\n      border: 3px solid rgba(255,255,255,0.3);\n      border-top: 3px solid rgba(255,255,255,0.8);\n      border-radius: 50%;\n      animation: spin 1s linear infinite;\n      z-index: 10;\n      opacity: 0;\n      transition: opacity 0.3s ease;\n    ';

    const style = document.createElement('style');
    style.textContent = '\n      @keyframes spin {\n        0% { transform: translate(-50%, -50%) rotate(0deg); }\n        100% { transform: translate(-50%, -50%) rotate(360deg); }\n      }\n    ';
    document.head.appendChild(style);

    return loader;
  }

});

// Main JavaScript for Vizstar Builder

// Carousel functionality
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dots .dot');
let currentSlide = 0;
let autoScrollInterval = null;

function showSlide(idx) {
  // Defensive: ensure slides exist and idx is in range
  if (!slides || slides.length === 0) return;
  if (typeof idx !== 'number' || idx < 0 || idx >= slides.length) idx = 0;

  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'prev');
    if (dots[i]) dots[i].classList.toggle('active', i === idx);
    // Remove zoom effect from all
    const img = slide.querySelector('img');
    if (img) img.classList.remove('carousel-zoom');
  });
  // Set classes for sliding effect
  slides[idx].classList.add('active');
  if (currentSlide !== idx) {
    if (slides[currentSlide]) slides[currentSlide].classList.add('prev');
    // Add zoom effect to new active image
    const img = slides[idx].querySelector('img');
    if (img) img.classList.add('carousel-zoom');
    setTimeout(() => {
      if (slides[currentSlide]) slides[currentSlide].classList.remove('prev');
    }, 800); // match transition duration
  } else {
    // Add zoom effect to current image if first load
    const img = slides[idx].querySelector('img');
    if (img) img.classList.add('carousel-zoom');
  }
  currentSlide = idx;
}

if (dots && dots.length > 0) {
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      resetAutoScroll();
    });
  });
}

function autoScrollCarousel() {
  if (!slides || slides.length === 0) return;
  showSlide((currentSlide + 1) % slides.length);
}

function resetAutoScroll() {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
  // Do not start auto-scroll if there are no slides
  if (!slides || slides.length === 0) return;
  autoScrollInterval = setInterval(autoScrollCarousel, 7000);
}

// Start auto-scroll
resetAutoScroll();

// Fixed header scroll functionality
let lastScrollTop = 0;
let scrollThreshold = 50;

function handleHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (!header) return;
  if (scrollTop > scrollThreshold) {
    // Scrolled down past threshold - show header with scrolled styling
    header.classList.add('header-scrolled');
    header.classList.remove('header-hidden');
  } else {
    // Near top - show normal header
    header.classList.remove('header-scrolled');
    header.classList.remove('header-hidden');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', function() {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(function() {
      handleHeaderScroll();
      scrollTimeout = null;
    }, 10);
  }
});

// Initialize header state
document.addEventListener('DOMContentLoaded', function() {
  handleHeaderScroll();
});

// Animated box and text for hero
window.addEventListener('DOMContentLoaded', function() {
  const boxSquare = document.getElementById('hero-animated-box-square');
  const textOverlay = document.querySelector('.hero-text-overlay');
  if (boxSquare) {
    boxSquare.style.opacity = 1;
    boxSquare.animate([
      { width: '0', height: '0', opacity: 0 },
      { width: '400px', height: '0', opacity: 1, offset: 0.3 },
      { width: '400px', height: '400px', opacity: 1 }
    ], {
      duration: 900,
      easing: 'cubic-bezier(.77,0,.18,1)',
      fill: 'forwards'
    });
  }
  setTimeout(() => {
    if (textOverlay) textOverlay.classList.add('show');
  }, 700);
});

// Slide menu functionality is now initialized in initializeSlideMenu() after component loading

// Projects filter and carousel functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectsDots = document.querySelectorAll('.projects-dots .dot');
let currentProjectsPage = 0;
let filteredProjects = [];
let currentFilter = 'all';

function getFilteredProjects(filter) {
  return Array.from(projectCards).filter(card => {
    const categories = card.dataset.category.split(' ');
    return filter === 'all' || categories.includes(filter);
  });
}

function updateDotsVisibility(totalProjects) {
  const dotsContainer = document.querySelector('.projects-dots');
  if (!dotsContainer) return;
  if (totalProjects <= 4) {
    dotsContainer.style.display = 'none';
    return;
  }
  dotsContainer.style.display = 'flex';
  const totalPages = Math.ceil(totalProjects / 4);
  
  // Update dots based on total pages
  if (projectsDots && projectsDots.length > 0) {
    projectsDots.forEach((dot, index) => {
      if (index < totalPages) {
        dot.style.display = 'block';
      } else {
        dot.style.display = 'none';
      }
    });
  }
}

function showProjectsPage(pageIndex, animated = true) {
  // Hide all projects first
  projectCards.forEach(card => {
    card.style.display = 'none';
    card.style.opacity = '0';
  });
  
  // Show only the projects for current page
  const startIndex = pageIndex * 4;
  const endIndex = startIndex + 4;
  
  filteredProjects.slice(startIndex, endIndex).forEach((card, index) => {
    card.style.display = 'block';
    
    if (animated) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + index * 100);
    } else {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  });
  
  // Update active dot
  projectsDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === pageIndex);
  });
  
  currentProjectsPage = pageIndex;
}

function filterProjects(filter, animated = true) {
  currentFilter = filter;
  filteredProjects = getFilteredProjects(filter);
  
  // Update dots visibility
  updateDotsVisibility(filteredProjects.length);
  
  // Reset to first page
  currentProjectsPage = 0;
  showProjectsPage(0, animated);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const filter = this.dataset.filter;
    
    // Update active filter button
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Filter and show projects
    filterProjects(filter);
  });
});

// Projects pagination functionality
projectsDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (index < Math.ceil(filteredProjects.length / 4)) {
      showProjectsPage(index);
    }
  });
});

// Projects prev/next buttons (header controls)
const projectsPrevBtn = document.getElementById('projectsPrev');
const projectsNextBtn = document.getElementById('projectsNext');

function goToNextProjects() {
  const totalPages = Math.ceil(filteredProjects.length / 4);
  if (currentProjectsPage < totalPages - 1) {
    showProjectsPage(currentProjectsPage + 1);
  }
}

function goToPrevProjects() {
  if (currentProjectsPage > 0) {
    showProjectsPage(currentProjectsPage - 1);
  }
}

if (projectsNextBtn) projectsNextBtn.addEventListener('click', () => { goToNextProjects(); });
if (projectsPrevBtn) projectsPrevBtn.addEventListener('click', () => { goToPrevProjects(); });

// Initialize projects display
window.addEventListener('DOMContentLoaded', function() {
  // Initialize with 'all' filter
  filteredProjects = getFilteredProjects('all');
  updateDotsVisibility(filteredProjects.length);
  showProjectsPage(0, false);
});

// Testimonials carousel functionality
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrevBtn = document.getElementById('testimonialPrevBtn');
const testimonialNextBtn = document.getElementById('testimonialNextBtn');
const testimonialsSlider = document.getElementById('testimonialsSlider');
let currentTestimonialIndex = 0;

function updateTestimonialCarousel() {
  // Defensive: ensure testimonials exist
  if (!testimonialsSlider || !testimonialCards || testimonialCards.length === 0) return;
  const containerEl = document.querySelector('.testimonials-container');
  if (!containerEl) return;

  // Calculate the offset for centering the active testimonial
  const cardWidth = testimonialCards[0].offsetWidth || 0;
  const gap = 40; // Match CSS gap
  const containerWidth = containerEl.offsetWidth || 0;
  const centerOffset = (containerWidth - cardWidth) / 2;
  const translateX = -(currentTestimonialIndex * (cardWidth + gap)) + centerOffset;

  // Apply transform (safely)
  testimonialsSlider.style.transform = `translateX(${translateX}px)`;

  // Update active states
  testimonialCards.forEach((card, index) => {
    card.classList.toggle('active', index === currentTestimonialIndex);
  });
}

function showNextTestimonial() {
  if (!testimonialCards || testimonialCards.length === 0) return;
  currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
  updateTestimonialCarousel();
}

function showPrevTestimonial() {
  if (!testimonialCards || testimonialCards.length === 0) return;
  currentTestimonialIndex = currentTestimonialIndex === 0 
    ? testimonialCards.length - 1 
    : currentTestimonialIndex - 1;
  updateTestimonialCarousel();
}

// Event listeners for testimonial navigation
if (testimonialNextBtn && testimonialPrevBtn) {
  testimonialNextBtn.addEventListener('click', showNextTestimonial);
  testimonialPrevBtn.addEventListener('click', showPrevTestimonial);
}

// Initialize testimonials carousel
window.addEventListener('DOMContentLoaded', function() {
  if (testimonialsSlider && testimonialCards.length > 0) {
    updateTestimonialCarousel();
  }
});

// Update testimonials carousel on window resize
window.addEventListener('resize', function() {
  if (testimonialsSlider && testimonialCards.length > 0) {
    updateTestimonialCarousel();
  }
});

// Auto-advance testimonials every 8 seconds (only if testimonials exist)
let testimonialsAutoInterval = null;
if (testimonialCards && testimonialCards.length > 0) {
  testimonialsAutoInterval = setInterval(showNextTestimonial, 8000);
}

// Pause auto-advance when user interacts
if (testimonialNextBtn && testimonialPrevBtn) {
  [testimonialNextBtn, testimonialPrevBtn].forEach(btn => {
    btn.addEventListener('click', function() {
      clearInterval(testimonialsAutoInterval);
      testimonialsAutoInterval = setInterval(showNextTestimonial, 8000);
    });
  });
}

// Contact page: AJAX form submit and inline result messages
// This runs only when a .contact-form exists on the page
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  function showContactMessage(type, text) {
    let msg = document.getElementById('contact-result');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'contact-result';
      msg.style.margin = '12px 0';
      msg.style.padding = '12px';
      msg.style.borderRadius = '6px';
    }
    if (type === 'success') {
      msg.style.background = '#e6ffef';
      msg.style.color = '#065f46';
    } else {
      msg.style.background = '#fff1f2';
      msg.style.color = '#7f1d1d';
    }
    msg.textContent = text;
    msg.style.display = 'block';
    const wrap = document.querySelector('.contact-form-wrap');
    if (wrap) wrap.insertBefore(msg, wrap.firstChild);
  }

  // If the server redirected back with query params, show message
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('sent') === '1') {
      showContactMessage('success', 'Thank you — your message was sent successfully.');
    } else if (params.get('error') === '1') {
      showContactMessage('error', 'Sorry — we could not send your message. Please try again later.');
    }
  } catch (err) {
    // ignore malformed URLSearchParams in older browsers
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type=submit]');
    let originalBtnText = '';
    if (submitBtn) {
      originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const resp = await fetch(form.action, {
        method: (form.method || 'POST').toUpperCase(),
        body: new FormData(form),
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json,text/html'
        }
      });

      const contentType = (resp.headers.get('content-type') || '').toLowerCase();
      if (contentType.includes('application/json')) {
        const json = await resp.json();
        if (json && (json.sent == 1 || json.success === true)) {
          showContactMessage('success', json.message || 'Thank you — your message was sent successfully.');
          form.reset();
        } else {
          showContactMessage('error', json.message || 'Sorry — we could not send your message. Please try again later.');
        }
      } else {
        // If the server redirected with query params, resp.url will include them
        if (resp.url && resp.url.indexOf('sent=1') !== -1) {
          showContactMessage('success', 'Thank you — your message was sent successfully.');
          form.reset();
        } else if (resp.url && resp.url.indexOf('error=1') !== -1) {
          showContactMessage('error', 'Sorry — we could not send your message. Please try again later.');
        } else if (resp.ok) {
          const text = await resp.text();
          if (text.indexOf('Thank you') !== -1 || text.indexOf('sent successfully') !== -1) {
            showContactMessage('success', 'Thank you — your message was sent successfully.');
            form.reset();
          } else {
            showContactMessage('error', 'Sorry — we could not send your message. Please try again later.');
          }
        } else {
          showContactMessage('error', 'Sorry — we could not send your message. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Contact form submission failed:', err);
      showContactMessage('error', 'An error occurred while sending — check your internet connection and try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
});