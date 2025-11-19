// Renderer for all-projects.html — loads assets/data/projects.json and renders three layouts
(function(){
  const DATA = '/assets/data/projects.json';

  function qs(sel){ return document.querySelector(sel); }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

  function createEl(tag, attrs={}, children=[]){
    const el = document.createElement(tag);
    for(const k in attrs){
      if(k === 'class') el.className = attrs[k];
      else if(k === 'text') el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
  }

  function getThumb(p){
    if(!p.images || !p.images.length) return 'assets/images/placeholder.jpg';
    return p.images[0].src;
  }

  // Render a masonry-like flattened gallery of all project images
  function renderMasonryGallery(projects, container){
    container.innerHTML = '';
    // flatten images with project reference (include project url when available)
    const items = [];
    projects.forEach(p => {
      // Use canonical query format: /project?project={id}
      const projectUrl = '/project?project=' + encodeURIComponent(p.id);
      (p.images || []).forEach(img => {
        items.push({
          projectId: p.id,
          projectUrl: projectUrl,
          title: p.title,
          src: img.src,
          alt: img.alt || p.title || ''
        });
      });
    });

    if(!items.length){ container.textContent = 'No images found'; return; }

    // Shuffle slightly for variety but keep grouping by project sometimes
    // We'll keep order but apply a few larger classes by index for visual variety
    items.forEach((it, i) => {
      const wrapper = createEl('div',{class: 'm-card'});
  const img = createEl('img',{src: it.src, alt: it.alt});
  // wrap image in an anchor so users can open in new tab / middle-click
  const a = createEl('a', { href: it.projectUrl, title: it.title });
  a.appendChild(img);
      // randomly vary sizes using data attributes (controlled by CSS)
      if(i % 7 === 0) wrapper.classList.add('large');
      else if(i % 5 === 0) wrapper.classList.add('tall');
      else if(i % 11 === 0) wrapper.classList.add('wide');

      wrapper.appendChild(a);
      // fallback navigation (will follow anchor by default) — keep JS navigation for older browsers
      wrapper.addEventListener('click', (e)=>{
        // if user clicked the wrapper but not the anchor (or JS is preferred), navigate
        if(!e.defaultPrevented){
          window.location = it.projectUrl;
        }
      });
      container.appendChild(wrapper);
    });
  }

  // masonry and list renderers removed — we only keep the Grid Gallery

  // removed premium hero/mosaic renderers per request

  // list renderer removed — Grid Gallery only

  function wireSelectors(){
    // export button copies 'mosaic' as chosen layout id
    const exportBtn = qs('#exportBtn');
    if(exportBtn) exportBtn.addEventListener('click', ()=>{
      const id = 'mosaic';
      navigator.clipboard && navigator.clipboard.writeText(id).then(()=>{
        alert('Layout id copied: ' + id);
      }, ()=>{ alert('Copy failed — selected: ' + id); });
    });
  }

  fetch(DATA).then(r=>r.ok? r.json(): Promise.reject('no-data')).then(json=>{
    const projects = (json && json.projects) ? json.projects : [];
    renderMasonryGallery(projects, qs('#masonryGrid'));
    wireSelectors();
  }).catch(err=>{
    console.error(err);
    const el = qs('#masonryGrid') || qs('#gridContainer');
    if(el) el.textContent = 'Failed to load projects';
  });

})();
