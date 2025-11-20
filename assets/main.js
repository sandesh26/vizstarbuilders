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