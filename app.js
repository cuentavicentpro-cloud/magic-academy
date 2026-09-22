/* =====================================================================
   MAGIC+ ENGLISH ACADEMY — MOTOR DE LA WEB
   Renderiza la página desde window.MAGIC_CONTENT (content.js)
   e incluye el EDITOR VISUAL (botón ✏️ abajo a la derecha).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  var C = window.MAGIC_CONTENT || {};
  var EDIT_KEY = 'magic_academy_content';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function deepMerge(base, over) {
    if (!over || typeof over !== 'object') return over;
    var out = clone(base);
    Object.keys(over).forEach(function (k) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && base[k] && typeof base[k] === 'object') {
        out[k] = deepMerge(base[k], over[k]);
      } else { out[k] = clone(over[k]); }
    });
    return out;
  }
  function getData() {
    try {
      var raw = localStorage.getItem(EDIT_KEY);
      if (raw) return deepMerge(C, JSON.parse(raw));
    } catch (e) {}
    return clone(C);
  }
  var DATA = getData();

  function pathGet(o, p) { return p.split('.').reduce(function (a, k) { return a && a[k]; }, o); }
  function pathSet(o, p, v) {
    var keys = p.split('.');
    keys.reduce(function (a, k, i) {
      if (i === keys.length - 1) a[k] = v;
      else { if (!a[k] || typeof a[k] !== 'object') a[k] = {}; return a[k]; }
    }, o);
  }
  function shade(rgb, f) {
    return rgb.split(',').map(function (c) { return Math.round(parseInt(c, 10) * f); }).join(',');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function attr(p) { return 'data-edit="' + p.replace(/"/g, '&quot;') + '"'; }
  function imgAttr(p) { return 'data-img="' + p.replace(/"/g, '&quot;') + '"'; }
  function stars(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<span class="material-symbols-outlined text-amber-400" style="font-variation-settings:\'FILL\' 1">star</span>';
    return s;
  }
  function waLink(num) { return 'https://wa.me/' + num; }
  function telLink(num) { return 'tel:+34' + num; }
  var initialsColors = {
    teal: 'bg-brand/15 text-brand', indigo: 'bg-indigo-100 text-indigo-700',
    orange: 'bg-orange-100 text-orange-700', green: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  /* ---------- Templates por sección ---------- */
  function header() {
    var nav = DATA.nav.map(function (n, i) {
      return '<a data-edit="nav.' + i + '.label" class="navlink text-sm font-semibold text-mute hover:text-ink hover:scale-105 transition-all py-1.5 px-2 rounded-lg" href="' + esc(n.href) + '">' + esc(n.label) + '</a>';
    }).join('');
    return '' +
      '<header class="fixed top-0 inset-x-0 z-50">' +
      '<div class="bg-brand text-white text-[13px] font-semibold py-1.5 px-4 overflow-hidden marquee">' +
      '<div class="max-w-7xl mx-auto flex items-center gap-6 marquee-track" style="--speed:26s">' +
      '<span>' + esc(DATA.announce.text) + '</span><span class="opacity-40">•</span>' +
      '<a class="hover:underline flex items-center gap-1" href="' + waLink(DATA.contact.wa1) + '" target="_blank" rel="noopener"><span class="material-symbols-outlined text-[15px]">call</span>' + esc(DATA.contact.phone1) + '</a><span class="opacity-40">•</span>' +
      '<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">pin_drop</span>' + esc(DATA.contact.places || 'Solares &amp; Sarón (Cantabria)') + '</span><span class="opacity-40">•</span>' +
      '<span>' + esc(DATA.announce.text) + '</span><span class="opacity-40">•</span>' +
      '<a class="hover:underline flex items-center gap-1" href="' + waLink(DATA.contact.wa1) + '" target="_blank" rel="noopener"><span class="material-symbols-outlined text-[15px]">call</span>' + esc(DATA.contact.phone1) + '</a><span class="opacity-40">•</span>' +
      '<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">pin_drop</span>' + esc(DATA.contact.places || 'Solares &amp; Sarón (Cantabria)') + '</span><span class="opacity-40">•</span>' +
      '</div></div>' +
      '<div id="site-nav" class="bg-white/85 backdrop-blur-xl border-b border-soft shadow-card transition-all">' +
      '<div class="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-4">' +
      '<a href="#top" class="flex items-center gap-2.5 shrink-0">' +
      '<span class="w-10 h-10 rounded-full bg-brand/10 ring-2 ring-brand/40 flex items-center justify-center font-extrabold text-brand text-lg">M+</span>' +
      '<span class="leading-tight"><span class="block font-extrabold text-lg tracking-tight text-ink">' + esc(DATA.brand.name) + '<span class="text-accent">' + esc(DATA.brand.mark) + '</span><span ' + attr('brand.tag') + ' class="text-[10px] font-extrabold uppercase bg-soft text-brand px-1.5 py-0.5 rounded-full align-middle ml-1">' + esc(DATA.brand.tag) + '</span></span>' +
      '<span class="block text-[11px] text-mute font-medium">' + esc(DATA.brand.subtitle) + '</span></span></a>' +
      '<nav id="desktop-nav" class="hidden xl:flex items-center gap-1">' + nav + '</nav>' +
      '<div class="flex items-center gap-2.5">' +
      '<a aria-label="WhatsApp" class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#22c55e] text-white hover:scale-110 active:scale-95 shadow-[0_4px_14px_rgba(34,197,94,.4)] transition-transform" href="' + waLink(DATA.contact.wa1) + '" target="_blank" rel="noopener"><span class="material-symbols-outlined">chat</span></a>' +
      '<a class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/85 hover:shadow-glowA hover:-translate-y-0.5 transition-all duration-200 shine" href="#contacto">' + esc(DATA.hero.ctaPrimary) + '</a>' +
      '<button id="menu-btn" aria-label="Abrir menú" aria-expanded="false" class="xl:hidden p-2 rounded-lg text-ink hover:bg-soft transition-colors"><span id="menu-icon" class="material-symbols-outlined">menu</span></button>' +
      '</div></div>' +
      '<div id="mobile-menu" class="hidden xl:hidden bg-white/95 backdrop-blur-xl shadow-lift px-4 py-3 border-t border-soft">' +
      '<nav class="flex flex-col">' + DATA.nav.map(function (n, i) {
        return '<a data-edit="nav.' + i + '.label" class="navlink p-3 rounded-lg text-ink font-semibold hover:bg-soft transition-colors" href="' + esc(n.href) + '">' + esc(n.label) + '</a>';
      }).join('') + '</nav>' +
      '<div class="mt-3 pt-3 border-t border-soft"><a class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white font-bold shadow-glowA" href="#contacto">' + esc(DATA.hero.ctaPrimary) + '</a></div>' +
      '</div></div></header>';
  }

  function hero() {
    var ht = DATA.hero;
    return '' +
      '<section id="top" class="relative overflow-hidden pt-28 lg:pt-32 pb-10 lg:pb-16">' +
      '<div class="blob absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-brand/30" data-para="0.12"></div>' +
      '<div class="blob absolute top-40 -right-32 w-[520px] h-[520px] rounded-full bg-accent/25" data-para="0.2"></div>' +
      '<div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">' +
      '<div class="lg:col-span-7">' +
      '<div class="flex flex-wrap gap-2 rv"><span ' + attr('hero.chip1') + ' class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-[13px] font-bold"><span class="material-symbols-outlined text-[16px] animate-pulse">local_fire_department</span>' + esc(ht.chip1) + '</span>' +
      '<span ' + attr('hero.chip2') + ' class="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-[13px] font-bold">' + esc(ht.chip2) + '</span></div>' +
      '<h1 class="mt-5 text-[34px] sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] rv" style="--d:.05s">' +
      '<span ' + attr('hero.h1a') + '>' + esc(ht.h1a) + '</span><span ' + attr('hero.h1b') + ' class="grad-text underline decoration-accent/50 decoration-4 underline-offset-8">' + esc(ht.h1b) + '</span></h1>' +
      '<p ' + attr('hero.subtitle') + ' class="mt-5 text-lg text-mute leading-relaxed max-w-2xl rv" style="--d:.1s">' + ht.subtitle + '</p>' +
      '<div class="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rv" style="--d:.15s">' +
      '<a href="#contacto" class="shine inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-accent text-white font-bold text-base shadow-glowA hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">' +
      '<span class="material-symbols-outlined">rocket_launch</span><span ' + attr('hero.ctaPrimary') + '>' + esc(ht.ctaPrimary) + '</span></a>' +
      '<a href="' + waLink(DATA.contact.wa1) + '?text=Hola%2C%20quiero%20mis%202%20clases%20de%20prueba%20gratis" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#22c55e] text-white font-bold hover:bg-[#16a34a] hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(34,197,94,.35)] transition-all duration-200">' +
      '<span class="material-symbols-outlined">chat</span><span ' + attr('hero.ctaSecondary') + '>' + esc(ht.ctaSecondary) + '</span></a></div>' +
      '<div class="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mute rv" style="--d:.2s">' +
      '<div class="flex items-center">' + stars(5) + '</div>' +
      '<span class="font-bold text-ink">' + esc(ht.rating) + '<span class="font-medium text-mute"> ' + esc(ht.ratingLabel) + '</span></span>' +
      '<span class="w-1 h-1 rounded-full bg-soft"></span><span ' + attr('hero.proof1') + '>' + esc(ht.proof1) + '</span>' +
      '<span class="w-1 h-1 rounded-full bg-soft"></span><span ' + attr('hero.proof2') + ' class="font-semibold text-brand">' + esc(ht.proof2) + '</span></div></div>' +

      '<div class="lg:col-span-5" id="hero-visual">' +
      '<div class="tilt relative max-w-md mx-auto" id="tilt-zone">' +
      '<div class="floaty bg-white rounded-2xl shadow-lift overflow-hidden -rotate-1" style="--d:.25s">' +
      '<div class="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white/90 text-[13px]">' +
      '<div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span><span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span><span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>' +
      '<span ' + attr('hero.callLabel') + ' class="ml-2 font-medium opacity-80 text-[12px]">' + esc(ht.callLabel) + '</span></div>' +
      '<span class="inline-flex items-center gap-1 text-[11px] bg-red-600 px-2 py-0.5 rounded-full font-bold ping-dot">' + esc(ht.rec) + '</span></div>' +
      '<img ' + imgAttr('hero.imgSrc') + ' alt="' + esc(ht.imgAlt) + '" class="w-full h-56 sm:h-64 object-cover object-top" src="' + esc(ht.imgSrc) + '" onerror="this.insertAdjacentHTML(\'afterend\',\'<div class=&quot;w-full h-56 grid place-items-center text-3xl&quot;>📚</div>\');this.remove();">' +
      '<div class="px-3 py-3 bg-white flex items-center justify-between"><span class="text-[13px] font-bold text-ink truncate" ' + attr('hero.lessonLabel') + '>' + esc(ht.lessonLabel) + '</span>' +
      '<span ' + attr('hero.interactive') + ' class="text-[11px] font-bold text-brand bg-brand/10 px-2 py-1 rounded-full shrink-0">' + esc(ht.interactive) + '</span></div></div></div>' +

      '<div class="floaty-slow absolute -bottom-8 -left-10 sm:-left-12 w-52 sm:w-60 bg-white rounded-2xl shadow-lift p-2 rotate-3 overflow-hidden">' +
      '<img ' + imgAttr('hero.photoSrc') + ' alt="' + esc(ht.photoAlt) + '" class="w-full h-40 object-cover object-top rounded-xl" src="' + esc(ht.photoSrc) + '" onerror="this.parentElement.insertAdjacentHTML(\'beforeend\',\'<div class=&quot;w-full h-40 bg-brand/10 grid place-items-center text-brand text-3xl&quot;>&#127891;</div>\');this.remove();">' +
      '<div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent rounded-xl flex flex-col justify-end p-2.5 text-white">' +
      '<span class="text-[10px] uppercase font-bold tracking-widest text-amber-300" ' + attr('hero.photoCaption') + '>' + esc(ht.photoCaption) + '</span>' +
      '<p class="text-[13px] font-bold leading-tight" ' + attr('hero.photoName') + '>' + esc(ht.photoName) + '</p>' +
      '<p class="text-[11px] text-white/80" ' + attr('hero.photoSub') + '>' + esc(ht.photoSub) + '</p></div></div>' +

      '<div class="floaty absolute -top-5 -right-2 sm:-right-6 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lift flex items-center gap-3" style="animation-delay:1.2s">' +
      '<div class="w-10 h-10 rounded-full bg-brand/15 grid place-items-center text-brand"><span class="material-symbols-outlined text-[22px]">verified</span></div>' +
      '<div><p class="text-[13px] font-bold text-ink" ' + attr('hero.badgeTitle') + '>' + esc(ht.badgeTitle) + '</p>' +
      '<p class="text-[11px] text-mute font-medium" ' + attr('hero.badgeSub') + '>' + esc(ht.badgeSub) + '</p></div></div>' +
      '</div></div></div></section>';
  }

  function logos() {
    var arr = DATA.logos.slice().concat(DATA.logos.slice());
    var items = arr.map(function (l, i) {
      return '<span data-edit="logos.' + (i % DATA.logos.length) + '" class="text-ink/50 hover:text-brand font-extrabold uppercase tracking-widest text-sm whitespace-nowrap transition-colors">' + esc(l) + '</span>';
    }).join('');
    return '<section class="py-8 border-y border-soft bg-white"><div class="max-w-7xl mx-auto px-4 md:px-6"><p ' + attr('logosTitle') + ' class="text-center text-xs uppercase tracking-widest text-mute font-bold mb-5">' + esc(DATA.logosTitle) + '</p>' +
      '<div class="marquee paused"><div class="marquee-track items-center">' + items + '</div></div></div></section>';
  }

  function counters(p) { return '<span class="font-display font-bold text-[40px] sm:text-5xl leading-none text-brand" data-count="' + p.value + '" data-suffix="' + esc(p.suffix) + '">0</span>'; }

  function metrics() {
    var cells = DATA.metrics.map(function (m, i) {
      return '<div class="text-center px-2 py-6 rv" style="--d:' + (i * 0.07) + 's"><div ' + attr('metrics.' + i + '.value') + '>' + counters(m) + '</div>' +
        '<p class="mt-2 text-sm text-mute font-medium" ' + attr('metrics.' + i + '.label') + '>' + esc(m.label) + '</p></div>';
    }).join('');
    return '<section class="bg-white shadow-sm"><div class="max-w-7xl mx-auto px-4 md:px-6"><div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-soft">' + cells + '</div></div></section>';
  }

  function programs() {
    var cards = DATA.programs.items.map(function (p, i) {
      var feats = p.features.map(function (f, j) {
        return '<li class="flex items-start gap-2 text-mute"><span class="material-symbols-outlined text-brand text-[18px] mt-0.5">check_circle</span><span data-edit="programs.items.' + i + '.features.' + j + '">' + esc(f) + '</span></li>';
      }).join('');
      return '<div class="glow-card relative bg-white rounded-2xl p-6 shadow-card hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col group rv" style="--d:' + (i * 0.07) + 's">' +
        (p.hot ? '<span class="absolute -top-3 right-5 bg-accent text-white px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide">Más Rápido</span>' : '') +
        '<div class="flex items-center justify-between mb-3"><span ' + attr('programs.items.' + i + '.tag') + ' class="px-2.5 py-1 rounded-lg bg-soft text-brand text-[12px] font-bold">' + esc(p.tag) + '</span>' +
        '<span class="material-symbols-outlined text-[30px] text-brand group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">' + esc(p.icon) + '</span></div>' +
        '<h3 class="text-xl font-bold tracking-tight group-hover:text-brand transition-colors" ' + attr('programs.items.' + i + '.title') + '>' + esc(p.title) + '</h3>' +
        '<p class="mt-2 text-sm text-mute leading-relaxed" ' + attr('programs.items.' + i + '.desc') + '>' + esc(p.desc) + '</p>' +
        '<ul class="mt-4 space-y-2 text-sm flex-1">' + feats + '</ul>' +
        '<a href="#contacto" class="mt-6 inline-flex items-center justify-center py-2.5 rounded-xl bg-soft text-brand font-bold hover:bg-brand hover:text-white transition-colors text-sm">' +
        '<span ' + attr('programs.items.' + i + '.cta') + '>' + esc(p.cta) + '</span></a></div>';
    }).join('');
    return '<section id="programas" class="py-20 lg:py-24"><div class="max-w-7xl mx-auto px-4 md:px-6">' +
      '<div class="text-center max-w-3xl mx-auto mb-14 space-y-3"><span ' + attr('programs.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.programs.eyebrow) + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('programs.title') + '>' + esc(DATA.programs.title) + '</h2>' +
      '<p class="text-mute" ' + attr('programs.body') + '>' + esc(DATA.programs.body) + '</p></div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' + cards + '</div></div></section>';
  }

  function method() {
    var f = DATA.method.features.map(function (x, i) {
      return '<div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-card rv" style="--d:' + (i * 0.08) + 's">' +
        '<div class="w-11 h-11 rounded-xl bg-brand/15 grid place-items-center text-brand shrink-0"><span class="material-symbols-outlined">' + esc(x.icon) + '</span></div>' +
        '<div><h4 class="font-bold" ' + attr('method.features.' + i + '.title') + '>' + esc(x.title) + '</h4>' +
        '<p class="text-sm text-mute mt-1" ' + attr('method.features.' + i + '.text') + '>' + esc(x.text) + '</p></div></div>';
    }).join('');
    return '<section id="metodologia" class="py-20 lg:py-24 bg-soft/60"><div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">' +
      '<div class="lg:col-span-6"><span ' + attr('method.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.method.eyebrow) + '</span>' +
      '<h2 class="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('method.title') + '>' + esc(DATA.method.title) + '</h2>' +
      '<p class="mt-4 text-mute leading-relaxed" ' + attr('method.body') + '>' + DATA.method.body + '</p>' +
      '<div class="mt-6 space-y-3">' + f + '</div>' +
      '<a href="#contacto" class="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand2 hover:shadow-glow transition-all">' +
      '<span class="material-symbols-outlined">play_circle</span><span ' + attr('method.cta') + '>' + esc(DATA.method.cta) + '</span></a></div>' +
      '<div class="lg:col-span-6 space-y-4 mt-10 lg:mt-0">' +
      '<div class="rounded-2xl bg-white shadow-lift overflow-hidden tilt-inner rv"><div class="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white/90 text-[13px] rounded-t-2xl">' +
      '<span class="flex items-center gap-2 font-semibold"><span class="material-symbols-outlined text-green-400 text-[18px]">videocam</span><span ' + attr('method.screenLabel') + '>' + esc(DATA.method.screenLabel) + '</span></span>' +
      '<span class="text-xs bg-white/20 px-2 py-0.5 rounded" ' + attr('method.screenBadge') + '>' + esc(DATA.method.screenBadge) + '</span></div>' +
      '<img ' + imgAttr('method.screenSrc') + ' alt="' + esc(DATA.method.screenAlt) + '" class="w-full h-72 sm:h-80 object-cover object-top rounded-b-2xl" src="' + esc(DATA.method.screenSrc) + '" onerror="this.insertAdjacentHTML(\'afterend\',\'<div class=&quot;w-full h-72 bg-soft grid place-items-center text-brand text-3xl&quot;>🎥</div>\');this.remove();"></div>' +
      '<div class="bg-gradient-to-r from-brand to-brand2 text-white p-5 rounded-2xl shadow-glow flex items-center justify-between gap-4 rv">' +
      '<div class="flex items-center gap-3"><span class="material-symbols-outlined text-[30px] text-white/90">headphones</span>' +
      '<div><p class="font-bold" ' + attr('method.bannerTitle') + '>' + esc(DATA.method.bannerTitle) + '</p><p class="text-[13px] text-white/80" ' + attr('method.bannerText') + '>' + esc(DATA.method.bannerText) + '</p></div></div>' +
      '<span class="bars text-white/95 flex-1 max-w-[90px]"><span></span><span></span><span></span><span></span><span></span></span></div></div></div></section>';
  }

  function team() {
    var cards = DATA.team.items.map(function (t, i) {
      var tags = t.tags.map(function (tg, j) {
        return '<span data-edit="team.items.' + i + '.tags.' + j + '" class="px-2 py-0.5 rounded-full bg-soft text-[11px] font-semibold text-mute">' + esc(tg) + '</span>';
      }).join('');
      return '<div class="bg-white rounded-2xl p-6 shadow-card hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 flex flex-col rv" style="--d:' + (i * 0.08) + 's">' +
        '<div class="flex items-center gap-4"><span class="w-16 h-16 rounded-full bg-gradient-to-br from-brand/80 to-brand grid place-items-center text-white text-2xl font-extrabold shadow-glow" ' + attr('team.items.' + i + '.init') + '>' + esc(t.init) + '</span>' +
        '<div><h3 class="text-xl font-bold" ' + attr('team.items.' + i + '.name') + '>' + esc(t.name) + '</h3>' +
        '<p class="text-sm font-semibold text-brand" ' + attr('team.items.' + i + '.role') + '>' + esc(t.role) + '</p>' +
        '<span class="text-[12px] text-mute" ' + attr('team.items.' + i + '.note') + '>' + esc(t.note) + '</span></div></div>' +
        '<p class="mt-4 text-sm text-mute leading-relaxed italic flex-1" ' + attr('team.items.' + i + '.bio') + '>' + esc(t.bio) + '</p>' +
        '<div class="flex flex-wrap gap-1.5 mt-4">' + tags + '</div>' +
        '<a href="' + waLink(t.wa === 2 ? DATA.contact.wa2 : DATA.contact.wa1) + '?text=Hola%20' + encodeURIComponent(t.name.split(' ')[0]) + '%2C%20quiero%20informaci%C3%B3n" target="_blank" rel="noopener" class="mt-5 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-soft text-brand font-bold hover:bg-brand hover:text-white transition-colors text-sm">' +
        '<span class="material-symbols-outlined text-[16px]">chat</span><span ' + attr('team.items.' + i + '.cta') + '>' + esc(t.cta) + '</span></a></div>';
    }).join('');
    return '<section id="equipo" class="py-20 lg:py-24"><div class="max-w-7xl mx-auto px-4 md:px-6">' +
      '<div class="text-center max-w-3xl mx-auto mb-14 space-y-3"><span ' + attr('team.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.team.eyebrow) + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('team.title') + '>' + esc(DATA.team.title) + '</h2>' +
      '<p class="text-mute" ' + attr('team.body') + '>' + esc(DATA.team.body) + '</p></div>' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' + cards + '</div></div></section>';
  }

  function pricing() {
    var plans = DATA.pricing.plans.map(function (p, i) {
      var feats = p.features.map(function (f, j) {
        return '<li class="flex items-start gap-2 ' + (p.featured ? 'text-ink/70' : 'text-mute') + '"><span class="material-symbols-outlined text-[18px] mt-0.5 ' + (p.featured ? 'text-accent' : 'text-brand') + '">check_circle</span><span data-edit="pricing.plans.' + i + '.features.' + j + '.0">' + esc(f[0]) + '</span></li>';
      }).join('');
      var badge = p.badge ? '<span class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-[13px] font-bold shadow-glowA whitespace-nowrap" ' + attr('pricing.plans.' + i + '.badge') + '>' + esc(p.badge) + '</span>' : '';
      return '<div class="relative bg-white rounded-2xl p-7 ' + (p.featured ? 'shadow-lift lg:scale-105 ring-2 ring-accent/70' : 'shadow-card hover:shadow-lift') + ' flex flex-col ' + (p.featured ? 'rg-brand' : '') + ' rv" style="--d:' + (i * 0.08) + 's">' + badge +
        '<div><span ' + attr('pricing.plans.' + i + '.tag') + ' class="px-2.5 py-1 rounded-lg bg-soft text-brand text-[12px] font-bold">' + esc(p.tag) + '</span>' +
        '<h3 class="mt-3 text-xl font-bold" ' + attr('pricing.plans.' + i + '.name') + '>' + esc(p.name) + '</h3>' +
        '<p class="text-sm text-mute mt-1" ' + attr('pricing.plans.' + i + '.desc') + '>' + esc(p.desc) + '</p>' +
        '<div class="mt-4 flex items-baseline gap-1.5"><span class="font-display font-bold text-[40px] ' + (p.featured ? 'text-accent' : 'text-ink') + '" ' + attr('pricing.plans.' + i + '.price') + '>' + esc(p.price) + '</span>' +
        '<span class="text-mute font-medium" ' + attr('pricing.plans.' + i + '.per') + '>' + esc(p.per) + '</span></div></div>' +
        '<ul class="mt-5 space-y-2.5 text-sm flex-1">' + feats + '</ul>' +
        '<a href="#contacto" class="mt-7 inline-flex items-center justify-center py-3 rounded-xl font-bold text-sm ' + (p.featured ? 'shine bg-accent text-white shadow-glowA hover:-translate-y-0.5' : 'bg-soft text-brand hover:bg-brand hover:text-white') + ' transition-all">' +
        '<span ' + attr('pricing.plans.' + i + '.cta') + '>' + esc(p.cta) + '</span></a></div>';
    }).join('');
    return '<section id="precios" class="py-20 lg:py-24 bg-soft/60"><div class="max-w-7xl mx-auto px-4 md:px-6">' +
      '<div class="text-center max-w-3xl mx-auto mb-14 space-y-3"><span ' + attr('pricing.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.pricing.eyebrow) + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('pricing.title') + '>' + esc(DATA.pricing.title) + '</h2>' +
      '<p class="text-mute" ' + attr('pricing.body') + '>' + esc(DATA.pricing.body) + '</p></div>' +
      '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-5xl mx-auto">' + plans + '</div>' +
      '<p class="text-center text-sm text-mute mt-8 max-w-2xl mx-auto" ' + attr('pricing.guarantee') + '>' + esc(DATA.pricing.guarantee) + '</p></div></section>';
  }

  function testCard(t, i) {
    var cols = initialsColors[t.bg] || 'bg-brand/15 text-brand';
    var g = t.google ? '<span class="g-badge text-white text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ml-auto">Google</span>' : '';
    return '<div class="bg-white rounded-2xl p-5 shadow-card flex flex-col min-w-[300px] sm:min-w-[340px] max-w-[360px] flex-none">' +
      '<div class="flex items-center gap-1 mb-3">' + stars(5) + g + '</div>' +
      '<p class="text-sm text-ink/85 leading-relaxed italic">«' + esc(t.quote) + '»</p>' +
      '<div class="flex items-center gap-3 mt-4 pt-4 border-t border-soft"><span class="w-10 h-10 rounded-full grid place-items-center font-extrabold text-sm ' + cols + '">' + esc(t.init) + '</span>' +
      '<div class="min-w-0"><p class="font-bold text-sm truncate">' + esc(t.name) + '</p><p class="text-[12px] text-mute truncate">' + esc(t.role) + '</p></div></div></div>';
  }

  function testimonials() {
    var featured = DATA.testimonials.items.filter(function (t) { return t.google; });
    var rest = DATA.testimonials.items.filter(function (t) { return !t.google; });
    var frow = featured.map(testCard).join('');
    var rrow = rest.map(testCard).join('');
    var row2 = rrow + rrow;
    return '<section id="testimonios" class="py-20 lg:py-24 overflow-hidden"><div class="max-w-7xl mx-auto px-4 md:px-6">' +
      '<div class="text-center max-w-3xl mx-auto mb-14 space-y-3"><span ' + attr('testimonials.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.testimonials.eyebrow) + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('testimonials.title') + '>' + esc(DATA.testimonials.title) + '</h2>' +
      '<p class="text-mute" ' + attr('testimonials.body') + '>' + esc(DATA.testimonials.body) + '</p></div>' +
      '<div class="flex justify-center mb-10"><div class="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-card">' +
      '<span class="w-9 h-9 rounded-full g-badge grid place-items-center text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12v2.5h5.2c-.4 2.1-2.2 3.4-5.2 3.4-3.1 0-5.7-2.6-5.7-5.7S9 5.6 12 5.6c1.6 0 3 .6 4 1.6l1.8-1.8C16.3 4.1 14.2 3 12 3 7 3 3.1 7 3.1 12S7 21 12 21c5.1 0 8.4-3.6 8.4-8.7 0-.7-.1-1.2-.25-2.2z"/></svg></span>' +
      '<div><p class="font-bold leading-tight" ' + attr('testimonials.ratingTitle') + '>' + esc(DATA.testimonials.ratingTitle) + '</p>' +
      '<p class="text-[12px] text-mute" ' + attr('testimonials.ratingText') + '>' + esc(DATA.testimonials.ratingText) + '</p></div>' +
      '<span class="text-amber-400 text-lg ml-1">★★★★★</span>' +
      '<a class="ml-2 inline-flex items-center gap-1 text-[12px] font-bold text-brand hover:underline shrink-0" href="' + esc(DATA.contact.google) + '" target="_blank" rel="noopener"><span class="material-symbols-outlined text-[15px]">open_in_new</span>Ver reseñas</a></div></div></div>' +
      '<div class="marquee paused mb-5"><div class="marquee-track">' + frow + frow + '</div></div>' +
      '<div class="marquee paused reverse"><div class="marquee-track" style="--speed:38s">' + row2 + '</div></div></section>';
  }

  function venues() {
    var cards = DATA.venues.items.map(function (v, i) {
      var img = v.imgSrc ? '<img ' + imgAttr('venues.items.' + i + '.imgSrc') + ' alt="' + esc(v.imgAlt) + '" class="w-full h-52 object-cover" src="' + esc(v.imgSrc) + '" onerror="this.insertAdjacentHTML(\'afterend\',\'<div class=&quot;w-full h-52 bg-brand/10 grid place-items-center text-brand text-3xl&quot;>📍</div>\');this.remove();">' :
        '<div ' + imgAttr('venues.items.' + i + '.imgSrc') + ' class="w-full h-52 bg-gradient-to-br from-brand/85 to-brand grid place-items-center"><span class="text-white text-5xl">📍</span></div>';
      return '<div class="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-lift transition-all duration-300 rv" style="--d:' + (i * 0.1) + 's">' + img +
        '<div class="p-6"><h3 class="text-xl font-bold" ' + attr('venues.items.' + i + '.place') + '>' + esc(v.place) + '</h3>' +
        '<p class="mt-2 text-sm text-mute flex items-start gap-2"><span class="material-symbols-outlined text-brand text-[18px]">place</span><span ' + attr('venues.items.' + i + '.address') + '>' + esc(v.address) + '</span></p>' +
        '<p class="mt-1 text-sm text-mute flex items-start gap-2"><span class="material-symbols-outlined text-brand text-[18px]">schedule</span><span ' + attr('venues.items.' + i + '.hours') + '>' + esc(v.hours) + '</span></p>' +
        '<div class="mt-4 flex flex-wrap gap-2"><a href="' + esc(v.maps) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand2 transition-colors">' +
        '<span class="material-symbols-outlined text-[16px]">map</span>Cómo llegar</a>' +
        '<a href="' + telLink(v.phone.replace(/[^0-9]/g, '')) + '" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-soft text-brand text-sm font-bold hover:bg-brand hover:text-white transition-colors">' +
        '<span class="material-symbols-outlined text-[16px]">call</span><span ' + attr('venues.items.' + i + '.phone') + '>' + esc(v.phone) + '</span></a></div></div></div>';
    }).join('');
    return '<section id="sedes" class="py-20 lg:py-24 bg-soft/60"><div class="max-w-7xl mx-auto px-4 md:px-6">' +
      '<div class="text-center max-w-3xl mx-auto mb-14 space-y-3"><span ' + attr('venues.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.venues.eyebrow) + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('venues.title') + '>' + esc(DATA.venues.title) + '</h2>' +
      '<p class="text-mute" ' + attr('venues.body') + '>' + esc(DATA.venues.body) + '</p></div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">' + cards + '</div></div></section>';
  }

  function faq() {
    var items = DATA.faq.items.map(function (f, i) {
      return '<div class="faq-item bg-white rounded-2xl shadow-card overflow-hidden rv" style="--d:' + (i * 0.05) + 's">' +
        '<details' + (i === 0 ? ' open' : '') + '><summary class="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-soft/50 transition-colors">' +
        '<span class="font-bold text-[15px]" ' + attr('faq.items.' + i + '.q') + '>' + esc(f.q) + '</span>' +
        '<span class="chev material-symbols-outlined text-brand shrink-0">expand_more</span></summary>' +
        '<div class="faq-body"><div><p class="px-5 pb-5 text-sm text-mute leading-relaxed" ' + attr('faq.items.' + i + '.a') + '>' + esc(f.a) + '</p></div></div></details></div>';
    }).join('');
    return '<section id="faq" class="py-20 lg:py-24"><div class="max-w-3xl mx-auto px-4 md:px-6">' +
      '<div class="text-center mb-12 space-y-3"><span ' + attr('faq.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.faq.eyebrow) + '</span>' +
      '<h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('faq.title') + '>' + esc(DATA.faq.title) + '</h2></div>' +
      '<div class="space-y-3">' + items + '</div></div></section>';
  }

  function ctaForm() {
    var fm = DATA.cta.form;
    var courseOpts = fm.courseOptions.map(function (o, i) { return '<option data-edit="cta.form.courseOptions.' + i + '" value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('');
    var modalOpts = fm.modalOptions.map(function (o, i) { return '<option data-edit="cta.form.modalOptions.' + i + '" value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('');
    var terms = DATA.cta.terms.map(function (t, i) {
      return '<span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/90"><span class="material-symbols-outlined text-[16px]">verified</span><span data-edit="cta.terms.' + i + '">' + esc(t) + '</span></span>';
    }).join('');
    var steps = DATA.cta.steps.map(function (s, i) {
      return '<div class="flex gap-4 items-start">' +
        (i < DATA.cta.steps.length - 1 ? '<div class="flex flex-col items-center"><span class="w-10 h-10 rounded-full bg-white/15 grid place-items-center font-display font-bold text-white border border-white/20 shrink-0">' + esc(s.n) + '</span><span class="w-0.5 flex-1 bg-white/20 mt-1"></span></div>' :
          '<span class="w-10 h-10 rounded-full bg-white/15 grid place-items-center font-display font-bold text-white border border-white/20 shrink-0">' + esc(s.n) + '</span>') +
        '<div class="pb-6"><p class="font-bold text-white" data-edit="cta.steps.' + i + '.title">' + esc(s.title) + '</p>' +
        '<p class="text-sm text-white/75" data-edit="cta.steps.' + i + '.text">' + esc(s.text) + '</p></div></div>';
    }).join('');
    return '<section id="contacto" class="relative overflow-hidden py-20 lg:py-24 bg-gradient-to-br from-brand via-[#023e3e] to-slate-900 text-white">' +
      '<div class="blob absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-accent/30" data-para="0.15"></div>' +
      '<div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">' +
      '<div><span ' + attr('cta.eyebrow') + ' class="inline-block px-3 py-1 rounded-full bg-white/15 text-[12px] font-bold uppercase tracking-widest">' + esc(DATA.cta.eyebrow) + '</span>' +
      '<h2 class="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight" ' + attr('cta.title') + '>' + esc(DATA.cta.title) + '</h2>' +
      '<div class="mt-5 flex flex-wrap gap-3">' + terms + '</div>' +
      '<div class="mt-9">' + steps + '</div>' +
      '<div class="mt-2 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15">' +
      '<p class="font-bold" ' + attr('cta.asideTitle') + '>' + esc(DATA.cta.asideTitle) + '</p>' +
      '<p class="text-sm text-white/75 mt-1" ' + attr('cta.asideText') + '>' + esc(DATA.cta.asideText) + '</p>' +
      '<div class="mt-4 flex flex-wrap gap-3">' +
      '<a href="' + waLink(DATA.contact.wa1) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e] text-white font-bold hover:scale-105 transition-transform"><span class="material-symbols-outlined text-[18px]">chat</span>' + esc(DATA.contact.phone1) + '</a>' +
      '<a href="' + telLink(DATA.contact.phone2.replace(/[^0-9]/g, '')) + '" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 text-white font-bold hover:bg-white/25 transition-colors"><span class="material-symbols-outlined text-[18px]">call</span>' + esc(DATA.contact.phone2) + '</a></div></div></div>' +

      '<div class="bg-white text-ink rounded-3xl p-7 sm:p-9 shadow-lift rv"><form id="lead-form" novalidate>' +
      '<h3 class="text-2xl font-extrabold tracking-tight">Empieza hoy, sin compromiso</h3>' +
      '<p class="text-sm text-mute mt-1" ' + attr('cta.form.note') + '>' + esc(fm.note) + '</p>' +
      '<div class="mt-6 space-y-4">' +
      '<label class="block"><span class="text-[12px] font-bold uppercase tracking-wide text-mute">' + esc(fm.name) + '</span>' +
      '<input id="f-name" type="text" required placeholder="Ej. Cristina García" class="mt-1.5 w-full h-12 px-4 rounded-xl border-0 ring-1 ring-mute/30 bg-soft/60 focus:ring-2 focus:ring-brand outline-none transition-all"></label>' +
      '<label class="block"><span class="text-[12px] font-bold uppercase tracking-wide text-mute">' + esc(fm.phone) + '</span>' +
      '<input id="f-phone" type="tel" required inputmode="tel" placeholder="Ej. 675 512 216" class="mt-1.5 w-full h-12 px-4 rounded-xl border-0 ring-1 ring-mute/30 bg-soft/60 focus:ring-2 focus:ring-brand outline-none transition-all"></label>' +
      '<label class="block"><span class="text-[12px] font-bold uppercase tracking-wide text-mute">' + esc(fm.course) + '</span>' +
      '<select id="f-course" required class="mt-1.5 w-full h-12 px-3 rounded-xl border-0 ring-1 ring-mute/30 bg-soft/60 focus:ring-2 focus:ring-brand outline-none transition-all"><option value="">Selecciona…</option>' + courseOpts + '</select></label>' +
      '<label class="block"><span class="text-[12px] font-bold uppercase tracking-wide text-mute">' + esc(fm.modality) + '</span>' +
      '<select id="f-mode" required class="mt-1.5 w-full h-12 px-3 rounded-xl border-0 ring-1 ring-mute/30 bg-soft/60 focus:ring-2 focus:ring-brand outline-none transition-all"><option value="">Selecciona…</option>' + modalOpts + '</select></label>' +
      '<button type="submit" id="f-btn" class="shine w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-white font-extrabold shadow-glowA hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">' +
      '<span class="material-symbols-outlined">rocket_launch</span><span ' + attr('cta.form.submit') + '>' + esc(fm.submit) + '</span></button></div>' +
      '<div id="f-success" class="hidden mt-5 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold text-center"></div>' +
      '<p class="text-[11px] text-mute mt-4 text-center">Al enviar aceptas ser contactado/a por WhatsApp o teléfono.</p></form></div></div></section>';
  }

  function footer() {
    var cols = DATA.footer.cols.map(function (c, i) {
      var links = c.links.map(function (l, j) {
        return '<li><a data-edit="footer.cols.' + i + '.links.' + j + '.0" class="text-mute hover:text-brand transition-colors" href="' + esc(l[1]) + '">' + esc(l[0]) + '</a></li>';
      }).join('');
      return '<div><h4 class="font-bold mb-3" data-edit="footer.cols.' + i + '.title">' + esc(c.title) + '</h4><ul class="space-y-2 text-sm">' + links + '</ul></div>';
    }).join('');
    return '<footer class="bg-white border-t border-soft pt-14 pb-8"><div class="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">' +
      '<div class="lg:col-span-2"><div class="flex items-center gap-2.5"><span class="w-9 h-9 rounded-full bg-brand/10 ring-2 ring-brand/40 grid place-items-center font-extrabold text-brand">M+</span>' +
      '<span class="font-extrabold text-xl tracking-tight">' + esc(DATA.brand.name) + '<span class="text-accent">' + esc(DATA.brand.mark) + '</span> <span class="text-[10px] font-extrabold uppercase bg-soft text-brand px-1.5 py-0.5 rounded-full align-middle">' + esc(DATA.brand.tag) + '</span></span></div>' +
      '<p class="mt-4 text-sm text-mute max-w-md leading-relaxed" ' + attr('footer.about') + '>' + esc(DATA.footer.about) + '</p>' +
      '<div class="mt-5 inline-flex items-center gap-2 bg-soft px-3.5 py-2 rounded-xl text-sm font-bold text-brand"><span class="material-symbols-outlined text-[18px]">workspace_premium</span>Official Exam Prep · Cambridge &amp; APTIS</div></div>' +
      cols +
      '<div><h4 class="font-bold mb-3">Contacto</h4><ul class="space-y-2 text-sm text-mute">' +
      '<li class="flex items-center gap-2"><span class="material-symbols-outlined text-brand text-[18px]">call</span><a class="hover:text-brand" href="' + waLink(DATA.contact.wa1) + '">' + esc(DATA.contact.phone1) + '</a></li>' +
      '<li class="flex items-center gap-2"><span class="material-symbols-outlined text-brand text-[18px]">call</span><a class="hover:text-brand" href="' + telLink(DATA.contact.phone2.replace(/[^0-9]/g, '')) + '">' + esc(DATA.contact.phone2) + '</a></li>' +
      '<li class="flex items-center gap-2"><span class="material-symbols-outlined text-brand text-[18px]">mail</span><a class="hover:text-brand" href="mailto:' + esc(DATA.contact.email) + '">' + esc(DATA.contact.email) + '</a></li>' +
      '<li class="flex items-start gap-2"><span class="material-symbols-outlined text-brand text-[18px]">public</span><span><a class="hover:text-brand" href="' + esc(DATA.contact.web) + '" target="_blank" rel="noopener">' + esc(DATA.contact.web) + '</a></span></li>' +
      '<li class="flex items-center gap-2"><span class="material-symbols-outlined text-brand text-[18px]">photo_camera</span><a class="hover:text-brand" href="' + esc(DATA.contact.instagram) + '" target="_blank" rel="noopener">@magicesplus</a></li>' +
      '<li class="flex items-center gap-2"><span class="material-symbols-outlined text-brand text-[18px]">thumb_up</span><a class="hover:text-brand" href="' + esc(DATA.contact.facebook) + '" target="_blank" rel="noopener">Magic+ en Facebook</a></li>' +
      '<li class="flex items-center gap-2"><span class="material-symbols-outlined text-brand text-[18px]">star</span><a class="hover:text-brand" href="' + esc(DATA.contact.google) + '" target="_blank" rel="noopener">Deja tu reseña en Google</a></li>' +
      '<li class="flex items-start gap-2"><span class="material-symbols-outlined text-brand text-[18px]">place</span><span>' + esc(DATA.contact.places || 'Solares y Sarón · Cantabria') + '</span></li></ul></div></div>' +
      '<div class="mt-10 pt-6 border-t border-soft text-center text-[12px] text-mute" ' + attr('footer.legal') + '>' + esc(DATA.footer.legal) + '</div></footer>';
  }

  /* ---------- Edición: botón flotante + panel ---------- */
  function makeEditor() {
    var btn = document.createElement('button');
    btn.id = 'edit-fab';
    btn.innerHTML = '<span class="material-symbols-outlined">edit</span>';
    btn.title = 'Modo edición visual (activa para cambiar textos, imágenes y colores)';
    btn.setAttribute('aria-label', 'Activar modo edición visual');
    btn.className = 'fixed bottom-5 right-5 z-[60] w-12 h-12 rounded-full bg-ink text-white grid place-items-center shadow-lift hover:scale-110 active:scale-95 transition-transform hidden md:grid';
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.id = 'edit-panel';
    panel.className = 'hidden fixed top-0 right-0 z-[70] h-full w-[320px] bg-white shadow-lift border-l border-soft flex-col';
    panel.innerHTML =
      '<div class="p-5 bg-ink text-white"><p class="font-extrabold text-lg">Modo edición visual</p>' +
      '<p class="text-[12px] text-white/70 mt-1">Haz clic en cualquier texto o imagen para cambiarlo. También puedes cambiar los colores de la marca.</p></div>' +
      '<div class="flex-1 overflow-y-auto p-5 space-y-4">' +
      '<div><p class="text-[12px] font-bold uppercase tracking-wide text-mute mb-2">Colores de marca</p>' +
      '<div class="flex items-center gap-3"><label class="flex-1 flex items-center gap-2 text-sm font-semibold"><input type="color" id="c-brand" class="w-9 h-9 rounded cursor-pointer border border-soft"> Teal</label>' +
      '<label class="flex-1 flex items-center gap-2 text-sm font-semibold"><input type="color" id="c-accent" class="w-9 h-9 rounded cursor-pointer border border-soft"> Naranja</label></div></div>' +
      '<div class="bg-soft rounded-xl p-4 text-[12px] text-mute leading-relaxed">1. Haz clic sobre cualquier <b>texto</b> para editarlo.<br/>2. Haz clic sobre cualquier <b>imagen</b> para pegar una nueva URL.<br/>3. Pulsa <b>Guardar</b> para descargar el archivo actualizado y subirlo a tu web (o guárdalo en este navegador).</div>' +
      '<button id="act-local" class="w-full py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:opacity-90">Guardar en este navegador</button>' +
      '<button id="act-download" class="w-full py-2.5 rounded-xl bg-accent text-white font-bold text-sm hover:opacity-90">Descargar content.js (para publicar)</button>' +
      '<button id="act-reset" class="w-full py-2.5 rounded-xl bg-soft text-mute font-bold text-sm hover:bg-red-50 hover:text-red-600">Restablecer contenido original</button>' +
      '<details id="json-details"><summary class="cursor-pointer text-[12px] font-bold text-brand">Importar / Exportar configuración (JSON)</summary>' +
      '<textarea id="json-box" class="mt-2 w-full h-32 p-3 text-[11px] rounded-xl border border-soft font-mono"></textarea>' +
      '<button id="act-import" class="mt-2 w-full py-2 rounded-lg bg-soft text-brand font-bold text-sm">Aplicar JSON pegado</button></details>' +
      '<p class="text-[11px] text-mute">Los cambios se guardan como previsualización local y como archivo descargable. Tu web pública se actualiza cuando subes <code>content.js</code> a GitHub.</p></div>' +
      '<div class="p-4 border-t border-soft"><button id="act-exit" class="w-full py-3 rounded-xl bg-soft text-ink font-bold">Cerrar editor</button></div>';

    document.body.appendChild(panel);

    /* helpers */
    function r2x(v) { return '#' + [0, 1, 2].map(function (i) { return (parseInt(v[i]) || 0).toString(16).padStart(2, '0'); }).join(''); }
    function x2r(h) { var m = h.replace('#', '').match(/.{2}/g); return (parseInt(m[0], 16) + ',' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16)); }
    function saveOverlay() {
      try { localStorage.setItem(EDIT_KEY, JSON.stringify(DATA)); } catch (e) {}
    }
    function renderJSONBox() { panel.querySelector('#json-box').value = JSON.stringify(DATA, null, 2); }
    function toast(msg) {
      var t = document.createElement('div');
      t.className = 'fixed bottom-20 right-5 z-[80] bg-ink text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lift animate-pulse';
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 2600);
    }

    function setEditable(on) {
      var src = document.getElementById('app');
      var all = src ? src.querySelectorAll('[data-edit]') : [];
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.tagName === 'OPTION' || el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') continue;
        if (on) el.setAttribute('contenteditable', 'true');
        else el.removeAttribute('contenteditable');
      }
    }

    btn.onclick = function () {
      var on = !document.body.classList.contains('editing');
      document.body.classList.toggle('editing', on);
      panel.classList.toggle('hidden', !on);
      panel.classList.toggle('flex', on);
      btn.innerHTML = on ? '<span class="material-symbols-outlined">close</span>' : '<span class="material-symbols-outlined">edit</span>';
      btn.title = on ? 'Salir del modo edición' : 'Modo edición visual';
      setEditable(on);
      if (on) {
        renderJSONBox();
        panel.querySelector('#c-brand').value = r2x(DATA.colors.brand.split(','));
        panel.querySelector('#c-accent').value = r2x(DATA.colors.accent.split(','));
        document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
      }
    };
    document.getElementById('act-exit').onclick = btn.onclick;

    /* colores */
    function applyColor(which) {
      var val = document.getElementById('c-' + which).value;
      var prop = which === 'brand' ? 'brand' : 'accent';
      var rgb = x2r(val);
      DATA.colors[prop] = rgb;
      document.documentElement.style.setProperty('--' + prop, rgb);
      if (prop === 'brand') {
        var dark = shade(rgb, 0.82);
        DATA.colors['brand-2'] = dark;
        document.documentElement.style.setProperty('--brand-2', dark);
      }
      saveOverlay();
      toast('Color actualizado en previsualización');
    }
    panel.querySelector('#c-brand').oninput = function () { applyColor('brand'); };
    panel.querySelector('#c-accent').oninput = function () { applyColor('accent'); };

    document.getElementById('act-local').onclick = function () { saveOverlay(); renderJSONBox(); toast('Guardado en este navegador ✓'); };
    document.getElementById('act-reset').onclick = function () {
      if (!confirm('¿Eliminar todos tus cambios locales y volver al contenido original?')) return;
      localStorage.removeItem(EDIT_KEY);
      location.reload();
    };
    document.getElementById('act-download').onclick = function () {
      saveOverlay();
      var txt = '/* MAGIC+ ENGLISH ACADEMY — contienenido generado desde el editor visual */\nwindow.MAGIC_CONTENT = ' + JSON.stringify(DATA, null, 2) + ';';
      var blob = new Blob([txt], { type: 'text/javascript' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'content.js';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      toast('content.js descargado — súbelo a tu repositorio');
    };
    document.getElementById('act-import').onclick = function () {
      try {
        var o = JSON.parse(panel.querySelector('#json-box').value);
        DATA = deepMerge(C, o);
        try { localStorage.setItem(EDIT_KEY, JSON.stringify(DATA)); } catch (e) {}
        location.reload();
      } catch (e) { alert('El JSON no es válido.'); }
    };

    /* edición inline de textos */
    document.getElementById('app').addEventListener('input', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-edit]') : null;
      if (!el || !document.body.classList.contains('editing')) return;
      var p = el.getAttribute('data-edit');
      if (!p) return;
      var val = (el.textContent || '').replace(/^\s+|\s+$/g, '');
      var count = el.querySelector('[data-count]');
      if (count) {
        var n = parseInt(val.replace(/[^\d-]/g, ''), 10);
        if (isNaN(n)) return;
        count.setAttribute('data-count', String(n));
        pathSet(DATA, p, n);
      } else {
        pathSet(DATA, p, val);
      }
      saveOverlay();
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('editing')) return;
      var t = e.target;
      if (!t || !t.closest) return;
      var img = t.closest('[data-img]');
      if (img) {
        e.preventDefault();
        var p = img.getAttribute('data-img');
        var cur = pathGet(DATA, p) || '';
        var url = prompt('Pega la URL de la nueva imagen (o déjalo vacío):', cur);
        if (url === null) return;
        var cls = img.className || '';
        var hcls = (cls.match(/\bh-\d+(?: sm:h-\d+)?/g) || []).join(' ');
        if (img.tagName === 'IMG') {
          if (!url) {
            var fb = document.createElement('div');
            fb.className = 'w-full ' + (hcls || 'h-52') + ' bg-brand/10 grid place-items-center text-brand text-3xl';
            fb.textContent = '🖼️';
            img.replaceWith(fb);
          } else img.src = url;
        } else if (url) {
          var nh = hcls || 'h-52';
          img.outerHTML = '<img data-img="' + p.replace(/"/g, '&quot;') + '" class="w-full ' + nh + ' object-cover" src="' + esc(url) + '" alt="">';
        }
        pathSet(DATA, p, url);
        saveOverlay();
        toast(url ? 'Imagen actualizada' : 'Imagen restablecida');
        return;
      }
      var sm = t.closest('summary');
      if (sm) { e.preventDefault(); e.stopPropagation(); return; }
      var a = t.closest('a[href]');
      if (a) { e.preventDefault(); return; }
      var ed = t.closest('[data-edit]');
      if (ed) { if (ed.tagName === 'A') e.preventDefault(); }
    });

    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (e.key === 'e' && !['input', 'textarea', 'select'].includes(tag) && !e.target.isContentEditable) {
        btn.onclick();
      }
      if (e.key === 'Escape' && document.body.classList.contains('editing')) btn.onclick();
    });
  }

  /* ---------- Animaciones ---------- */
  function initAnimations() {
    var revealAll = false;
    if (!('IntersectionObserver' in window)) {
      revealAll = true;
      document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('rv-in'); });
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('rv-in');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { if (!revealAll) obs.observe(el); });

    /* contadores */
    var cObs = new IntersectionObserver(function (entries, self) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        self.unobserve(en.target);
        var target = +en.target.getAttribute('data-count');
        var suffix = en.target.getAttribute('data-suffix') || '';
        var dur = reduceMotion ? 0 : 1400;
        var t0 = performance.now();
        function tick(now) {
          var k = Math.min((now - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - k, 3);
          en.target.textContent = Math.round(target * eased).toLocaleString('es-ES') + suffix;
          if (k < 1) requestAnimationFrame(tick);
        }
        if (dur === 0) { en.target.textContent = target.toLocaleString('es-ES') + suffix; return; }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (reduceMotion || revealAll) el.textContent = (+el.getAttribute('data-count')).toLocaleString('es-ES') + (el.getAttribute('data-suffix') || '');
      else cObs.observe(el);
    });

    /* parallax layers */
    var moving = !reduceMotion && !isTouch;
    var layers = document.querySelectorAll('[data-para]');
    if (moving && layers.length) {
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var py = window.pageYOffset;
          layers.forEach(function (l) {
            var s = parseFloat(l.getAttribute('data-para'));
            l.style.transform = 'translate3d(0,' + (py * s) + 'px,0)';
          });
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* tilt hero */
    var zone = document.getElementById('tilt-zone');
    if (zone && !isTouch && !reduceMotion) {
      zone.addEventListener('mousemove', function (e) {
        var r = zone.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        zone.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg)';
      });
      zone.addEventListener('mouseleave', function () { zone.style.transform = ''; });
    }
  }

  /* ---------- Interacciones ---------- */
  function initUI() {
    var menuBtn = document.getElementById('menu-btn');
    var menu = document.getElementById('mobile-menu');
    menuBtn.onclick = function () {
      var open = menu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!open));
      document.getElementById('menu-icon').textContent = open ? 'menu' : 'close';
    };
    document.querySelectorAll('#mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        document.getElementById('menu-icon').textContent = 'menu';
      });
    });

    /* header shrink + scroll progress */
    var nav = document.getElementById('site-nav');
    var prog = document.createElement('div');
    prog.id = 'scroll-progress';
    prog.className = 'absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-brand z-10';
    nav.style.position = 'relative';
    nav.appendChild(prog);
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1);
        prog.style.transform = 'scaleX(' + scrolled + ')';
        if (h.scrollTop > 40) nav.classList.add('shadow-lift'); else nav.classList.remove('shadow-lift');
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* nav activa */
    var links = document.querySelectorAll('.navlink');
    var map = {};
    links.forEach(function (l) {
      var h = l.getAttribute('href');
      if (h && h.charAt(0) === '#') {
        (map[h] = map[h] || []).push(l);
      }
    });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(map).forEach(function (k) {
          var active = k === '#' + en.target.id;
          map[k].forEach(function (l) {
            l.classList.toggle('text-brand', active);
            l.classList.toggle('bg-soft', active);
            l.classList.toggle('text-mute', !active);
          });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (k) { var el = document.querySelector(k); if (el) secObs.observe(el); });

    /* form */
    var form = document.getElementById('lead-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = document.getElementById('f-btn');
      var orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Enviando…';
      setTimeout(function () {
        btn.classList.add('hidden');
        var ok = document.getElementById('f-success');
        ok.textContent = DATA.cta.form.success;
        ok.classList.remove('hidden');
        confetti();
        setTimeout(function () {
          form.reset(); btn.classList.remove('hidden'); btn.innerHTML = orig; btn.disabled = false; ok.classList.add('hidden');
        }, 6000);
      }, 1400);
    });
  }

  function confetti() {
    var cv = document.getElementById('confetti-canvas');
    var ctx = cv.getContext('2d');
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    var parts = [], colors = ['#006a69', '#0ea5a4', '#f16d0d', '#f59e0b', '#22c55e'];
    for (var i = 0; i < 90; i++) {
      parts.push({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.6, w: 6 + Math.random() * 6, h: 8 + Math.random() * 6, c: colors[i % colors.length], vy: 3 + Math.random() * 4, rot: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .2 });
    }
    var frames = 0;
    (function step() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(function (p) {
        p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      frames++;
      if (frames < 160) requestAnimationFrame(step); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  /* ---------- SEO / JSON-LD ---------- */
  function seo() {
    var t = DATA.meta;
    document.title = t.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t.description);
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Magic+ English Academy',
      url: 'https://magic-plus-academy.vercel.app/',
      telephone: '+34' + DATA.contact.phone1,
      email: DATA.contact.email,
      sameAs: [
        'https://instagram.com/magicesplus/',
        'https://www.facebook.com/magicplus.es/',
        'https://g.page/r/CQYgrD4uKPgVEAg/review'
      ],
      address: [
        { '@type': 'PostalAddress', streetAddress: 'Av. Oviedo 11, Bloque 2, bajo 1', addressLocality: 'Solares', addressRegion: 'Cantabria', postalCode: '39710', addressCountry: 'ES' },
        { '@type': 'PostalAddress', streetAddress: 'Travesía San Lázaro 18', addressLocality: 'Sarón', addressRegion: 'Cantabria', postalCode: '39620', addressCountry: 'ES' }
      ],
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '15' }
    });
    document.head.appendChild(ld);
  }

  /* Colores y accesibilidad aplicados en el arranque */
  function applyBootColors() {
    var root = document.documentElement;
    var cs = DATA.colors || {};
    if (cs.brand) {
      root.style.setProperty('--brand', cs.brand);
      root.style.setProperty('--brand-2', cs['brand-2'] || shade(cs.brand, 0.82));
    }
    if (cs.accent) root.style.setProperty('--accent', cs.accent);
  }
  function ariaPass() {
    var src = document.getElementById('app');
    if (!src) return;
    var ic = src.querySelectorAll('.material-symbols-outlined');
    for (var i = 0; i < ic.length; i++) ic[i].setAttribute('aria-hidden', 'true');
  }

  /* ---------- Boot ---------- */
  function boot() {
    applyBootColors();
    document.getElementById('app').innerHTML =
      header() + hero() + logos() + metrics() + programs() + method() + team() + pricing() + testimonials() + venues() + faq() + ctaForm() + footer();
    ariaPass();
    seo();
    initUI();
    initAnimations();
    makeEditor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();