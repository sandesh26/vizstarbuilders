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

  function renderMasonryGallery(projects, container){
    container.innerHTML = '';
    const items = [];
    projects.forEach(p => {
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

    items.forEach((it, i) => {
      const wrapper = createEl('div',{class: 'm-card'});
  const img = createEl('img',{src: it.src, alt: it.alt});
  
  const a = createEl('a', { href: it.projectUrl, title: it.title, target: '_blank', rel: 'noopener noreferrer' });
  a.appendChild(img);
      if(i % 7 === 0) wrapper.classList.add('large');
      else if(i % 5 === 0) wrapper.classList.add('tall');
      else if(i % 11 === 0) wrapper.classList.add('wide');

      wrapper.appendChild(a);
      wrapper.addEventListener('click', (e)=>{
        if (e.target && e.target.closest && e.target.closest('a')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        window.location = it.projectUrl;
      });
      container.appendChild(wrapper);
    });
  }

  function wireSelectors(){
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
