// Lightweight project loader and UI binder
// - attempts to fetch assets/data/projects.json
// - supports deep linking via ?project=slug
// - if server pre-rendered markup exists, it will use it and only add interactions

(function () {
  const DATA_URL = '/assets/data/projects.json';
  const PLACEHOLDER = '/assets/images/placeholder.jpg';

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }
  function getParam(name) { return new URLSearchParams(location.search).get(name); }

  const projectBg = qs('.project-bg');
  const thumbnailStrip = qs('.project-thumbnail-strip');
  const leftArrow = qs('.project-arrow.left');
  const rightArrow = qs('.project-arrow.right');
  const hideInfoBtn = qs('.project-hide-info');
  const infoCard = qs('.project-info-card');
  const infoContent = qs('.project-info-content');
  const closeBtn = qs('.project-close-btn');

  // Auto-slide configuration
  const SLIDE_INTERVAL = 4000; // 4 seconds
  let autoSlideTimer = null;
  let isAutoSlideActive = true;

  function startAutoSlide() {
    if (!isAutoSlideActive || !images?.length || images.length <= 1) return;
    
    autoSlideTimer = setInterval(() => {
      if (isAutoSlideActive) {
        nextImage();
      }
    }, SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function restartAutoSlide() {
    stopAutoSlide();
    if (isAutoSlideActive) {
      startAutoSlide();
    }
  }

  // Basic onerror fallback for images
  function safeImage(el) {
    if (!el) return;
    el.addEventListener('error', () => { el.src = PLACEHOLDER; });
  }

  // State
  let currentIndex = 0;
  // full projects list (populated when JSON fetched)
  let allProjects = [];
  // normalize a src from JSON or DOM to root-relative if necessary
  function normalizeSrc(s){
    if(!s) return s;
    if(typeof s !== 'string') return s;
    if(s.indexOf('http://') === 0 || s.indexOf('https://') === 0 || s.indexOf('/') === 0) return s;
    return '/' + s.replace(/^\/+/, '');
  }

  let images = qsa('.project-thumbnail').map(t => ({ src: normalizeSrc(t.getAttribute('src') || t.src), alt: t.alt }));

  function setImage(index) {
    if (!images || !images.length) return;
    currentIndex = ((index % images.length) + images.length) % images.length;
    if (!projectBg) return;
    if (projectBg.classList.contains('transitioning')) return;
    projectBg.classList.add('transitioning');

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:1;opacity:0;transition:opacity .35s;pointer-events:none';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = '1');

    setTimeout(() => {
      // Only set the src when the image entry contains a valid src string.
      const entry = images[currentIndex] || {};
      const src = entry.src && typeof entry.src === 'string' ? entry.src : null;
      if (src) {
        projectBg.src = src;
        projectBg.removeAttribute('aria-hidden');
        projectBg.style.opacity = '';
      } else {
        // No valid src for this index — keep existing image visible and warn for debugging
        console.warn('setImage: no src for image index', currentIndex, entry);
      }
      projectBg.alt = (entry && entry.alt) || '';
      qsa('.project-thumbnail').forEach((el, i) => el.classList.toggle('active', i === currentIndex));
      setTimeout(() => {
        projectBg.classList.remove('transitioning');
        overlay.style.opacity = '0';
        setTimeout(() => { try { document.body.removeChild(overlay); } catch (e) {} }, 350);
      }, 150);
    }, 300);
  }

  function changeImage(delta) {
    setImage(currentIndex + delta);
  }

  function nextImage() { changeImage(1); }
  function prevImage() { changeImage(-1); }

  // Navigate between projects (circular). Uses project id found on <body data-project-id>
  // and the JSON `projects` list loaded into `allProjects`.
  function navigateProject(delta) {
    if (!allProjects || !allProjects.length) {
      console.warn('navigateProject: no projects available');
      return;
    }
    const bodyId = (document.body && document.body.dataset && document.body.dataset.projectId) ? document.body.dataset.projectId : getParam('project');
    let idx = allProjects.findIndex(p => p && String(p.id) === String(bodyId));
    if (idx === -1) idx = 0; // fallback to first project
    const n = allProjects.length;
    const next = ((idx + delta) % n + n) % n;
    const nextId = allProjects[next] && allProjects[next].id;
    if (!nextId) { console.warn('navigateProject: next project id missing'); return; }
    const path = window.location.pathname;
    // Navigate to same path with the project query param (server will render the project)
    window.location.href = path + '?project=' + encodeURIComponent(nextId);
  }

  // If the page was server-rendered, thumbnails and initial background already exist.
  // We wire interactions first; if JSON is available we enable deep linking and multi-project support.

  // Wire basic interactions (work even if JSON not fetched)
  function wireUI(projectData) {
    // re-query thumbnails/strip at time of wiring (defensive if DOM changed)
    const thumbnailStripEl = qs('.project-thumbnail-strip') || document.querySelector('.project-thumbnail-strip');
    // remove accidental duplicate strips, keep the first
    if (thumbnailStripEl) {
      const allStrips = qsa('.project-thumbnail-strip');
      if (allStrips.length > 1) {
        allStrips.slice(1).forEach(s => { try { s.parentNode.removeChild(s); } catch (e) {} });
      }
    }

    const thumbnails = qsa('.project-thumbnail');
    
    // register event for each thumbnail click - restart auto-slide timer
    thumbnails.forEach((thumb, i) => {
      thumb.setAttribute('tabindex', '0');
      thumb.addEventListener('click', () => {
        setImage(i);
        restartAutoSlide(); // restart timer after manual thumbnail click
      });
      thumb.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setImage(i);
          restartAutoSlide();
        }
      });
    });

    // Delegated click handler on the thumbnail strip — use the local strip reference
    if (thumbnailStripEl && !thumbnailStripEl.dataset.bound) {
      thumbnailStripEl.addEventListener('click', (ev) => {
        const tgt = ev.target.closest && ev.target.closest('.project-thumbnail');
        if (!tgt) return;
        // Determine index: prefer explicit data-idx, fallback to node list index
        const idxAttr = tgt.getAttribute('data-idx');
        let idx = typeof idxAttr === 'string' && idxAttr !== null ? parseInt(idxAttr, 10) : NaN;
        if (Number.isNaN(idx)) {
          const list = qsa('.project-thumbnail');
          idx = list.indexOf(tgt);
        }
        if (idx >= 0) {
          setImage(idx);
          restartAutoSlide();
        }
      }, false);
      thumbnailStripEl.dataset.bound = '1';
    }

    // arrows — support Shift+click to navigate between projects (circular),
    // plain click navigates images as before.
    if (leftArrow) leftArrow.addEventListener('click', (ev) => {
      if (ev && ev.shiftKey) {
        navigateProject(-1);
      } else {
        prevImage();
        restartAutoSlide(); // restart timer after manual navigation
      }
    });
    if (rightArrow) rightArrow.addEventListener('click', (ev) => {
      if (ev && ev.shiftKey) {
        navigateProject(1);
      } else {
        nextImage();
        restartAutoSlide(); // restart timer after manual navigation
      }
    });

    // keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          if (e.shiftKey) {
            navigateProject(-1);
          } else {
            prevImage();
            restartAutoSlide();
          }
        }
        if (e.key === 'ArrowRight') {
          if (e.shiftKey) {
            navigateProject(1);
          } else {
            nextImage();
            restartAutoSlide();
          }
        }
    });

    // hide/show info — orchestrated animation for crisp transitions
    if (hideInfoBtn) {
      // initial aria
      hideInfoBtn.setAttribute('role', 'button');
      hideInfoBtn.setAttribute('aria-expanded', String(!infoContent.classList.contains('hidden')));

      hideInfoBtn.addEventListener('click', () => {
        // prevent spamming while animating
        hideInfoBtn.style.pointerEvents = 'none';

        // smoother timings (keep in sync with CSS)
        const CONTENT_FADE_MS = 600;
        const CARD_TRANSITION_MS = 900;
        const COLLAPSED_MAX = 64; // px target when collapsed
        
        const mainContent = document.querySelector('.project-main-content');
        const isCurrentlyHidden = infoCard.classList.contains('collapsed');

        // Helper to clear inline max-height after animation
        function clearInlineMax() {
          requestAnimationFrame(() => { infoCard.style.maxHeight = ''; });
        }

        if (!isCurrentlyHidden) {
          // Collapse smoothly: measure, set explicit maxHeight, fade content, then set collapsed maxHeight
          const fullH = infoCard.scrollHeight;
          infoCard.style.maxHeight = fullH + 'px';
          // trigger reflow then fade content
          requestAnimationFrame(() => {
            infoContent.style.transition = `opacity ${CONTENT_FADE_MS}ms ease-out`;
            infoContent.style.opacity = '0';
          });

          // after content faded, animate card height and move container to top
          setTimeout(() => {
            infoCard.classList.add('collapsed');
            infoCard.style.maxHeight = COLLAPSED_MAX + 'px';
            mainContent.classList.remove('expanded');
            // update aria and label
            hideInfoBtn.setAttribute('aria-expanded', 'false');
            hideInfoBtn.textContent = 'SHOW INFORMATION';
          }, CONTENT_FADE_MS + 40);

          // cleanup after card transition
          setTimeout(() => {
            // ensure content hidden class state
            infoContent.classList.add('hidden');
            clearInlineMax();
            hideInfoBtn.style.pointerEvents = 'auto';
          }, CONTENT_FADE_MS + CARD_TRANSITION_MS + 80);
        } else {
          // Expand smoothly: move container to center first, then expand card from top
          mainContent.classList.add('expanded');
          infoContent.classList.remove('hidden');
          infoContent.style.opacity = '0';
          // ensure collapsed style in place
          infoCard.classList.remove('collapsed');
          infoCard.style.maxHeight = COLLAPSED_MAX + 'px';

          // next frame, measure target expanded height and animate
          requestAnimationFrame(() => {
            const targetH = infoCard.scrollHeight;
            infoCard.style.maxHeight = targetH + 'px';
            hideInfoBtn.setAttribute('aria-expanded', 'true');
            hideInfoBtn.textContent = 'HIDE INFORMATION';
          });

          // after a portion of card expansion, fade content in
          setTimeout(() => {
            infoContent.style.transition = `opacity ${CONTENT_FADE_MS}ms ease-out`;
            infoContent.style.opacity = '1';
          }, CARD_TRANSITION_MS * 0.35);

          // cleanup after full expand
          setTimeout(() => {
            clearInlineMax();
            hideInfoBtn.style.pointerEvents = 'auto';
          }, CARD_TRANSITION_MS + 120);
        }
      });
    }

    // close button - removes card completely
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (!infoCard) return;
        
        // Add closing animation class
        infoCard.classList.add('closing');
        closeBtn.style.pointerEvents = 'none';
        
        // Remove card from DOM after animation
        setTimeout(() => {
          if (infoCard.parentNode) {
            infoCard.parentNode.removeChild(infoCard);
          }
        }, 400); // match CSS transition duration
      });
    }

    // image error handlers
    safeImage(projectBg);
  }

  function setImage(index) {
    if (!images || !images.length) return;
    currentIndex = ((index % images.length) + images.length) % images.length;
    if (!projectBg) return;
    if (projectBg.classList.contains('transitioning')) return;
    projectBg.classList.add('transitioning');

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:1;opacity:0;transition:opacity .35s;pointer-events:none';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = '1');

    setTimeout(() => {
      projectBg.src = images[currentIndex].src || PLACEHOLDER;
      projectBg.alt = images[currentIndex].alt || '';
      qsa('.project-thumbnail').forEach((el, i) => el.classList.toggle('active', i === currentIndex));
      setTimeout(() => {
        projectBg.classList.remove('transitioning');
        overlay.style.opacity = '0';
        setTimeout(() => { try { document.body.removeChild(overlay); } catch (e) {} }, 350);
      }, 150);
    }, 300);
  }

  function changeImage(delta) {
    setImage(currentIndex + delta);
  }

  function nextImage() { changeImage(1); }
  function prevImage() { changeImage(-1); }

  // Try fetch JSON to support deep-linking and richer behavior
  fetch(DATA_URL).then(res => res.ok ? res.json() : Promise.reject('no-data')).then(data => {
    const projects = data.projects || [];
    // expose project list for navigation
    allProjects = projects;
    if (!projects.length) return wireUI();

    const requested = getParam('project');
    let project = null;
    if (requested) project = projects.find(p => p.id === requested);
    if (!project) project = projects[0];

    // If DOM already has thumbnails, override images array with JSON-provided list so sets use same ordering
  if (project && Array.isArray(project.images) && project.images.length) {
  images = project.images.map(i => ({ src: normalizeSrc(i.src), alt: i.alt || '' }));

      // If the DOM did not render thumbnails server-side, build them now
      if (!qsa('.project-thumbnail').length && thumbnailStrip) {
        thumbnailStrip.innerHTML = '';
        project.images.forEach((img, idx) => {
          const t = document.createElement('img');
          t.src = normalizeSrc(img.src);
          t.alt = img.alt || `Thumbnail ${idx + 1}`;
          t.className = 'project-thumbnail';
          t.setAttribute('data-idx', idx);
          t.loading = 'lazy';
          thumbnailStrip.appendChild(t);
        });
      }

      // set initial image using coverIndex or 0
      const start = (typeof project.coverIndex === 'number') ? project.coverIndex : 0;
      setTimeout(() => {
        setImage(start);
        // Start auto-slide after initial setup
        startAutoSlide();
      }, 50);
    }

      // Populate info card fields from JSON (only show non-empty keys)
      (function populateInfo(p) {
        if (!p) return;
        function escapeHtml(str) {
          return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }

        const titleEl = qs('.project-title');
        const descEl = qs('.project-desc');
        const infoContentEl = qs('.project-info-content');
        const tableEl = qs('.project-details-table');

        if (titleEl) {
          // allow newlines in title to become <br>
          titleEl.innerHTML = escapeHtml(p.title || '').replace(/\n/g, '<br>');
        }
        if (descEl) {
          descEl.textContent = p.description || '';
        }

        const details = [
          ['Clients:', p.client],
          ['Completion:', p.completion],
          ['Project Type:', p.projectType],
          ['Architects:', p.architects]
        ];

        const rows = details.reduce((acc, [label, val]) => {
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            acc.push('<tr><td>' + escapeHtml(label) + '</td><td>' + escapeHtml(val) + '</td></tr>');
          }
          return acc;
        }, []);

        if (rows.length) {
          if (tableEl) {
            tableEl.innerHTML = rows.join('\n');
          } else if (infoContentEl) {
            const t = document.createElement('table');
            t.className = 'project-details-table';
            t.innerHTML = rows.join('\n');
            infoContentEl.appendChild(t);
          }
        } else {
          // no detail rows: remove existing table if present
          if (tableEl && tableEl.parentNode) tableEl.parentNode.removeChild(tableEl);
        }
      })(project);

    wireUI(project);
  }).catch(() => {
    // If fetch fails, still wire UI to the server-rendered DOM
    wireUI();
    // Start auto-slide even without JSON data if thumbnails exist
    if (qsa('.project-thumbnail').length > 1) {
      setTimeout(() => startAutoSlide(), 100);
    }
  });

  // Add hover pause/resume for auto-slide
  if (projectBg) {
    projectBg.addEventListener('mouseenter', stopAutoSlide);
    projectBg.addEventListener('mouseleave', () => {
      if (isAutoSlideActive) startAutoSlide();
    });
  }

  // Initialize with expanded state (add the expanded class to main content)
  const mainContent = document.querySelector('.project-main-content');
  if (mainContent) {
    mainContent.classList.add('expanded');
  }

  // Fullscreen controls wiring
  (function wireFullscreen() {
    // use let so we can re-query if DOM was modified unexpectedly
    let fsBtn = qs('.project-fullscreen-btn');
    let fsExitBtn = qs('.project-exit-fullscreen-btn');
    let bgContainer = qs('.project-bg-container');

    // if any element is missing, attempt a fresh query (defensive)
    if (!bgContainer) bgContainer = document.querySelector('.project-bg-container');
    if (!fsBtn) fsBtn = document.querySelector('.project-fullscreen-btn');
    if (!fsExitBtn) fsExitBtn = document.querySelector('.project-exit-fullscreen-btn');

    if (!bgContainer) {
      console.warn('Fullscreen: .project-bg-container not found, aborting fullscreen wiring');
      return;
    }

    // debug: log elements found
    console.debug('Fullscreen wiring:', { bgContainer, fsBtn, fsExitBtn });

    // fallback flag used when browser refuses/doesn't support element fullscreen
    let fsFallback = false;

    async function enterFullscreen() {
      // prefer standard API, fall back to documentElement or vendor prefixed APIs where needed
      fsFallback = false;
      try {
        if (bgContainer.requestFullscreen) {
          console.debug('Fullscreen: requesting element fullscreen on bgContainer');
          await bgContainer.requestFullscreen();
          return;
        }
      } catch (err) {
        console.warn('bgContainer.requestFullscreen failed', err);
      }

      // some browsers prefer requesting fullscreen on the documentElement
      try {
        if (document.documentElement.requestFullscreen) {
          console.debug('Fullscreen: requesting element fullscreen on documentElement');
          await document.documentElement.requestFullscreen();
          return;
        }
      } catch (err) {
        console.warn('documentElement.requestFullscreen failed', err);
      }

      // vendor-prefixed fallbacks
      try {
        if (bgContainer.webkitRequestFullscreen) { console.debug('webkitRequestFullscreen on bgContainer'); bgContainer.webkitRequestFullscreen(); return; }
        if (bgContainer.msRequestFullscreen) { console.debug('msRequestFullscreen on bgContainer'); bgContainer.msRequestFullscreen(); return; }
        if (document.documentElement.webkitRequestFullscreen) { console.debug('webkitRequestFullscreen on documentElement'); document.documentElement.webkitRequestFullscreen(); return; }
      } catch (e) {
        console.warn('vendor-prefixed fullscreen request failed', e);
      }

      // If all attempts fail, use CSS fallback
      console.warn('All native fullscreen attempts failed — using CSS fallback');
      doFsFallback();
    }

    async function exitFullscreen() {
      try {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
          if (document.exitFullscreen) { await document.exitFullscreen(); return; }
          if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); return; }
          if (document.msExitFullscreen) { document.msExitFullscreen(); return; }
        }
      } catch (e) {
        console.warn('Exit fullscreen failed', e);
      }
      // If the browser fullscreen is not active but we used fallback, remove it
      if (fsFallback) {
        undoFsFallback();
      }
    }

    function doFsFallback() {
      // Add classes that simulate fullscreen via CSS. This works reliably when the native API
      // is unavailable or blocked by the browser.
      document.body.classList.add('in-fullscreen');
      document.body.classList.add('fs-fallback');
      fsFallback = true;
      // ensure auto-slide pauses while in fullscreen-like state
      stopAutoSlide();
    }

    function undoFsFallback() {
      document.body.classList.remove('in-fullscreen');
      document.body.classList.remove('fs-fallback');
      fsFallback = false;
      // resume auto-slide after a short delay
      setTimeout(() => { if (isAutoSlideActive) startAutoSlide(); }, 80);
    }

  if (fsBtn) fsBtn.addEventListener('click', (ev) => { ev.preventDefault(); console.debug('Fullscreen button clicked'); enterFullscreen(); });
  if (fsExitBtn) fsExitBtn.addEventListener('click', (ev) => { ev.preventDefault(); console.debug('Exit fullscreen clicked'); exitFullscreen(); });

  // Delegated handlers as a fallback in case elements are re-rendered or wiring ran too early
  document.addEventListener('click', (ev) => {
    const b = ev.target && ev.target.closest && ev.target.closest('.project-fullscreen-btn');
    if (b) {
      ev.preventDefault();
      console.debug('Delegated: fullscreen button clicked');
      enterFullscreen();
      return;
    }
    const x = ev.target && ev.target.closest && ev.target.closest('.project-exit-fullscreen-btn');
    if (x) {
      ev.preventDefault();
      console.debug('Delegated: exit fullscreen clicked');
      exitFullscreen();
      return;
    }
  });

  // Fullscreen-side navigation arrows (these sit inside the bg container so they're visible in fullscreen)
  const fsLeft = qs('.project-fs-arrow.left');
  const fsRight = qs('.project-fs-arrow.right');
  if (fsLeft) fsLeft.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (ev && ev.shiftKey) {
      navigateProject(-1);
    } else {
      prevImage();
      restartAutoSlide();
    }
  });
  if (fsRight) fsRight.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (ev && ev.shiftKey) {
      navigateProject(1);
    } else {
      nextImage();
      restartAutoSlide();
    }
  });

    // Keep UI in sync when fullscreen is toggled via ESC or other means
    document.addEventListener('fullscreenchange', () => {
      const isFS = !!document.fullscreenElement;
      console.debug('fullscreenchange ->', isFS, document.fullscreenElement);
      document.body.classList.toggle('in-fullscreen', isFS);
      // when exiting fullscreen, ensure auto-slide resumes
      if (!isFS) restartAutoSlide();
    });
    // also support webkit prefixed event
    document.addEventListener('webkitfullscreenchange', () => {
      const isFS = !!(document.webkitFullscreenElement || document.fullscreenElement);
      console.debug('webkitfullscreenchange ->', isFS);
      document.body.classList.toggle('in-fullscreen', isFS);
      if (!isFS) restartAutoSlide();
    });
  })();

})();
