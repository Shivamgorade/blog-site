 // =====================
    // Mobile-first blog JS
    // Features:
    // - In-memory articles array (replace with API when ready)
    // - Search, category filter, open reader, share via Web Share API
    // - Contact form (mailto fallback)
    // =====================

    const articles = [
      {
        id: 'a1',
        title: 'Host layouts in 2025',
        date: '2025-09-01',
        author: 'Shivam Gorade',
        category: 'design',
        excerpt: 'Designing for mobile-first means thinking about performance, readability and thumb-friendly interactions. This guide helps you start.',
        image: '',
        content: `<p>Mobile-first design is no longer optional. Start with the smallest screen and scale up. Focus on typography, vertical rhythm, and fast-loading images. Use progressive enhancement and keep interactions thumb-friendly.</p><h3>Quick checklist</h3><ul><li>Readable font sizes</li><li>Sufficient tap targets</li><li>Fast assets &amp; lazy loading</li></ul>`
      },
      {
        id: 'a2',
        title: 'Top 5 tools for small teams',
        date: '2025-08-27',
        author: 'Aniket',
        category: 'industry',
        excerpt: 'Tools that help small editorial teams ship content faster without expensive infra.',
        image: 'https://static.toiimg.com/thumb/msid-123624558,imgsize-648774,width-400,resizemode-4/article-65.jpg',  // ✅ added here
        content: `<p>From simple CMSs to static site generators, small teams benefit from choosing tools that lower friction. Consider content-as-data and easy deployment.</p>`
      },
      {
        id: 'a3',
        title: 'Policy changes to watch this year',
        date: '2025-07-18',
        author: 'Editorial',
        category: 'policy',
        excerpt: 'A roundup of policy changes and what they mean for readers and publishers.',
        image: '',
        content: `<p>Policy updates can affect how content is moderated, monetized and distributed. Keep an eye on platform T&amp;Cs and local regulations.</p>`
      },
         {
        id: 'a4',
        title: 'Policy changes to watch this yearEDF    WEDFQWEDQWEDF',
        date: '2025-07-18',
        author: 'Editorial',
        category: 'policy',
        excerpt: 'A roundup of policy changes and what they mean for readers and publishers.',
        image: '',
        content: `<p>Policy updates can affect how content is moderated, monetized and distributed. Keep an eye on platform T&amp;Cs and local regulations.</p>`
      }
    ];

    // Helpers
    const byId = id => document.getElementById(id);
    const grid = byId('articlesGrid');
    const heroTitle = byId('heroTitle');
    const heroImg = byId('heroImg');
    const year = byId('year');
    year.textContent = new Date().getFullYear();

    function renderArticles(list){
      grid.innerHTML = '';
      if(list.length === 0){
        grid.innerHTML = '<div class="center muted" style="padding:18px">No articles found</div>';
        return;
      }
      list.forEach(a => {
        const el = document.createElement('article');
        el.className = 'card';
        el.innerHTML = `
          <div class="thumb" aria-hidden></div>
          <div style="flex:1">
            <h3>${a.title}</h3>
            <p class="muted">${a.author} • ${a.date}</p>
            <p class="muted">${a.excerpt}</p>
            <div class="tags"><button class="tag" data-id="${a.id}">Read</button><div class="tag">${a.category}</div></div>
          </div>
        `;
        grid.appendChild(el);
      });
    }

    // initial render
    renderArticles(articles);

    // set hero to first article
    function setHero(a){
      heroTitle.textContent = a.title;
      heroImg.style.background = 'linear-gradient(180deg,#eef2ff,#e6f1ff)';
    }
    setHero(articles[0]);

    // Search
    const searchInput = byId('searchInput');
    searchInput.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = articles.filter(a => (a.title + ' ' + a.excerpt + ' ' + a.category).toLowerCase().includes(q));
      renderArticles(filtered);
    });

    // Category filter
    document.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', e => {
        const cat = btn.getAttribute('data-cat');
        if(cat === 'all') renderArticles(articles);
        else renderArticles(articles.filter(a => a.category === cat));
      });
    });

    // Open reader when clicking read buttons or card
    grid.addEventListener('click', e => {
      const idBtn = e.target.closest('[data-id]');
      if(idBtn){
        const id = idBtn.getAttribute('data-id');
        openReader(id);
        return;
      }
      const card = e.target.closest('.card');
      if(card){
        const title = card.querySelector('h3')?.textContent;
        const art = articles.find(a => a.title === title);
        if(art) openReader(art.id);
      }
    });

    // Reader functions
    const reader = byId('reader');
    const readerTitle = byId('readerTitle');
    const readerMeta = byId('readerMeta');
    const readerBody = byId('readerBody');

    function openReader(id){
      const a = articles.find(x => x.id === id);
      if(!a) return;
      readerTitle.textContent = a.title;
      readerMeta.textContent = `${a.author} • ${a.date}`;
      readerBody.innerHTML = a.content + `<p style="margin-top:16px;color:var(--muted)">Category: ${a.category}</p>`;
      reader.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    byId('closeReader').addEventListener('click', () => closeReader());
    reader.addEventListener('click', e => { if(e.target === reader) closeReader(); });

    function closeReader(){ reader.classList.remove('open'); document.body.style.overflow = ''; }

    // Share
    byId('shareBtn').addEventListener('click', async () => {
      try{
        const title = readerTitle.textContent;
        const text = readerBody.textContent.slice(0,120) + '...';
        if(navigator.share){
          await navigator.share({title,text,url:location.href});
        } else {
          alert('Use copy/paste to share this article');
        }
      }catch(err){console.warn(err)}
    });

    // Menu (simple toast)
    byId('menuBtn').addEventListener('click', ()=>{
      alert('Menu: You can add links to Home, Categories, About, Archive, etc.');
    });

    // Contact form (simple mailto fallback)
    byId('sendContact').addEventListener('click', ()=>{
      const n = byId('name').value.trim();
      const e = byId('email').value.trim();
      const m = byId('message').value.trim();
      if(!n || !e || !m){ alert('Please fill all fields'); return; }
      const subject = encodeURIComponent('Contact from ' + n);
      const body = encodeURIComponent(`Name: ${n}\nEmail: ${e}\n\n${m}`);
      // Try fetch to server endpoint (not available in static template) - fallback to mailto
      location.href = `mailto:hello@aniketnews.example?subject=${subject}&body=${body}`;
    });
    byId('clearContact').addEventListener('click', ()=>{ byId('name').value=''; byId('email').value=''; byId('message').value=''; });

    // Accessibility: keyboard close
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeReader(); });

    // Expose a basic method for adding articles from console (for testing)
    window.addArticle = function(a){ articles.unshift(a); renderArticles(articles); setHero(articles[0]); }

    // Small improvement: detect reduced-motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(!mq.matches){
      // light entrance animation
      document.querySelectorAll('.card').forEach((c,i)=>{ c.style.opacity = 0; c.style.transform = 'translateY(6px)'; setTimeout(()=>{ c.style.transition='all .36s cubic-bezier(.2,.9,.2,1)'; c.style.opacity=1; c.style.transform='none' }, i*60) });
    }
