(function () {
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 16) { nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', function () {
    var willOpen = menu.hidden;
    menu.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
    btn.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
  });
  menu.addEventListener('click', function (e) {
    if (e.target && e.target.tagName === 'A') {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
    }
  });

  /* sliding lime indicator for the nav */
  var linksWrap = document.querySelector('.links');
  if (linksWrap) {
    var ind = document.createElement('span');
    ind.className = 'nav-ind';
    linksWrap.appendChild(ind);
    var pills = Array.prototype.slice.call(linksWrap.querySelectorAll('.pill'));
    var posInd = function (el, animate) {
      if (!el || !ind) return;
      if (!animate) { ind.style.transition = 'none'; }
      ind.style.width = el.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + el.offsetLeft + 'px)';
      if (!animate) { void ind.offsetWidth; ind.style.transition = ''; }
      ind.classList.add('on');
    };
    var setActive = function (p) {
      pills.forEach(function (x) { x.classList.remove('active'); });
      p.classList.add('active');
      posInd(p, true);
    };
    var repaint = function () { posInd(linksWrap.querySelector('.pill.active') || pills[0], false); };
    repaint();
    window.addEventListener('load', repaint);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(repaint); }
    window.addEventListener('resize', repaint);
    pills.forEach(function (p) {
      p.addEventListener('click', function () { setActive(p); });
    });
    var spy = [
      { el: document.getElementById('top'), pill: pills[0] },
      { el: document.getElementById('community'), pill: pills[1] },
      { el: document.getElementById('team'), pill: pills[2] }
    ];
    var lastIdx = -1;
    window.addEventListener('scroll', function () {
      var mid = window.scrollY + window.innerHeight * 0.35;
      var idx = 0;
      for (var i = 0; i < spy.length; i++) { if (spy[i].el && spy[i].el.offsetTop <= mid) idx = i; }
      if (idx === lastIdx) return;
      lastIdx = idx;
      setActive(spy[idx].pill);
    }, { passive: true });
  }

  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() { reveals.forEach(function (el) { el.classList.add('in'); }); }
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    window.setTimeout(showAll, 2200);
  } else {
    showAll();
  }

  var online = document.querySelector('[data-live-online]');
  var wrap = document.querySelector('[data-avatars]');
  fetch('https://discord.com/api/guilds/1560769747900043418/widget.json', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) { throw new Error('widget unavailable'); } return r.json(); })
    .then(function (w) {
      if (online) { online.textContent = String(w.presence_count || 0); }
      if (wrap) {
        (w.members || []).filter(function (m) { return m && m.avatar_url; }).slice(0, 10).forEach(function (m) {
          var img = document.createElement('img');
          img.src = m.avatar_url;
          img.alt = '';
          img.width = 42;
          img.height = 42;
          img.loading = 'lazy';
          img.decoding = 'async';
          wrap.appendChild(img);
        });
      }
    })
    .catch(function () { /* graceful placeholders */ });

  var year = document.querySelector('[data-year]');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // dev-only: allow deep-linking a scroll offset for screenshots
  var m = /^#shot(\d+)$/.exec(location.hash || '');
  if (m) { window.setTimeout(function () { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 860 * parseInt(m[1], 10)); }, 120); }
  if (location.hash === '#shotall') {
    window.setTimeout(function () {
      var h = document.querySelector('.hero');
      if (h) { h.style.minHeight = '740px'; }
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
    }, 100);
  }
})();
