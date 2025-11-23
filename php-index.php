<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vizstar Builder</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <!-- Header Component Placeholder -->
  <div id="header-placeholder"></div>

  <!-- Image Carousel Section -->
  <section class="carousel-section">
    <div class="carousel-container">
      <div class="carousel-slide active">
  <img src="assets/images/projects/vizstar/vizstar-1.jpg" alt="Project 1" />
        <div style="display: flex; gap: 48px; align-items: flex-start; position: absolute; left: 8vw; top: 8vh; z-index: 4;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div id="hero-animated-box-square"></div>
          </div>
        </div>
        <div class="hero-text-overlay">
          <div class="hero-label">Residential</div>
          <div class="hero-title"><span>The luxury<br>residence in<br>forest</span></div>
          <a href="#" class="hero-link">See project <span class="arrow">→</span></a>
        </div>
      </div>
      <div class="carousel-slide">
  <img src="assets/images/projects/vizstar/vizstar-2.jpg" alt="Project 2" />
      </div>
      <div class="carousel-slide">
        <img src="assets/images/projects/vizstar/vizstar-3.jpg" alt="Project 3" />
      </div>
      <div class="carousel-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </section>

  <!-- About Us Section -->
  <section class="about-section">
    <div class="about-container">
      <div class="about-left">
        <div class="about-label">ABOUT US</div>
        <h2 class="about-title">We Are The Leader In The<br>Architectural</h2>
        <p class="about-desc">
          At Vizstar Builders, we believe in shaping more than just skylines—we build lasting partnerships and deliver excellence in every project. Our commitment to innovation, quality, and collaboration ensures that every client receives tailored solutions and exceptional value. Together, we create spaces that inspire, connect, and endure.
        </p>
        <div class="about-years-row">
          <div class="about-years-box">
            <span class="about-years-num">5</span>
          </div>
          <div class="about-years-text">
            Years<br>Experience<br>Working
          </div>
        </div>
      </div>
      <div class="about-right">
        <div class="about-img-bg"></div>
  <img class="about-img" src="assets/images/projects/vizstar/vizstar-1.jpg" alt="About Vizstar" />
      </div>
    </div>
  </section>

  <!-- Latest Projects Section -->
  <section class="projects-section">
    <div class="projects-header-row">
      <h2 class="projects-title">Latest Projects</h2>
      <div class="projects-filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="building">Building</button>
        <button class="filter-btn" data-filter="interior">Interior & Exterior</button>
        <a href="#" class="view-all-projects">View All Projects</a>
      </div>
    </div>
    <div class="projects-list cards-layout">
      <div class="project-card" data-category="building">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Triangle Concrete House On Lake" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Triangle Concrete House<br>On Lake</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="building">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Ocean Museum Italy" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Ocean Museum<br>Italy</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="building interior">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Milko Co-Working Building" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Milko Co-Working<br>Building</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="interior">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Wooden Horizontal Villa" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Wooden Horizontal<br>Villa</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="building">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Sky Bridge Complex" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Sky Bridge<br>Complex</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="interior">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Luxury Interior Design" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Luxury Interior<br>Design Studio</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="building interior">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Glass Pavilion Mall" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Glass Pavilion<br>Shopping Mall</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
      <div class="project-card" data-category="building">
        <div class="project-img-wrapper">
          <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Neo Corporate Tower" class="project-img" />
        </div>
        <div class="project-info">
          <div class="project-title">Neo Corporate<br>Tower</div>
          <a href="#" class="project-link">See project <span class="arrow">&rarr;</span></a>
        </div>
      </div>
    </div>
    <div class="projects-dots">
      <span class="dot active"></span>
      <span class="dot"></span>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="testimonials-section">
    <div class="testimonials-header">
      <h2 class="testimonials-title">From Our Great Clients</h2>
      <div class="testimonials-nav">
        <button class="testimonial-nav-btn prev" id="testimonialPrevBtn" aria-label="Previous testimonial">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="testimonial-nav-btn next" id="testimonialNextBtn" aria-label="Next testimonial">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    <div class="testimonials-container">
      <div class="testimonials-slider" id="testimonialsSlider">
        <div class="testimonial-card active">
          <div class="testimonial-profile">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Mukesh Ambani" class="testimonial-avatar" />
            <div class="testimonial-info">
              <h4 class="testimonial-name">Mukesh Ambani</h4>
              <p class="testimonial-position">Chairman & Managing Director at Reliance</p>
            </div>
          </div>
          <div class="testimonial-quote">
            <i class="fas fa-quote-left quote-icon"></i>
            <p class="testimonial-text">Sed elit quam, iaculis sed semper sit amet udin vitae nibh. at magna akal semperFusce commodo molestie luctus.Lorem ipsum Dolor tusima ollatup.</p>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-profile">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Adam Stone" class="testimonial-avatar" />
            <div class="testimonial-info">
              <h4 class="testimonial-name">Gautam Adani</h4>
              <p class="testimonial-position">Founder and Chairman of the Adani Group</p>
            </div>
          </div>
          <div class="testimonial-quote">
            <i class="fas fa-quote-left quote-icon"></i>
            <p class="testimonial-text">Sed elit quam, iaculis sed semper sit amet udin vitae nibh. at magna akal semperFusce commodo molestie luctus.Lorem ipsum Dolor tusima ollatup. Sed elit quam, iaculis sed semper sit amet udin vitae nibh.</p>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-profile">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Michael Johnson" class="testimonial-avatar" />
            <div class="testimonial-info">
              <h4 class="testimonial-name">Shiv Nadar</h4>
              <p class="testimonial-position">Founder of HCL Group</p>
            </div>
          </div>
          <div class="testimonial-quote">
            <i class="fas fa-quote-left quote-icon"></i>
            <p class="testimonial-text">Exceptional quality and attention to detail. Vizstar Builders transformed our vision into reality with professionalism and expertise. Highly recommended for any construction project.</p>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="testimonial-profile">
            <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Anand Mahindra" class="testimonial-avatar" />
            <div class="testimonial-info">
              <h4 class="testimonial-name">Anand Mahindra</h4>
              <p class="testimonial-position">Chairman of Mahindra Group</p>
            </div>
          </div>
          <div class="testimonial-quote">
            <i class="fas fa-quote-left quote-icon"></i>
            <p class="testimonial-text">Outstanding service from start to finish. The team delivered beyond our expectations with innovative solutions and timely completion. A truly professional experience.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide Menu Component Placeholder -->
  <div id="slide-menu-placeholder"></div>
<!-- Footer Component Placeholder -->
<div id="footer-placeholder"></div>
<script src="assets/main.js"></script>
</body>
</html>
