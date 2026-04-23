(function () {
  var mount = document.getElementById('site-header');
  if (!mount) return;

  var path = (window.location.pathname.split('/').pop() || '').toLowerCase();
  var isIndex = path === '' || path === 'index.html';
  var prefix = isIndex ? '' : 'index.html';
  var navClass = isIndex ? 'nav' : 'nav scrolled';

  var langSvg =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '  <circle cx="12" cy="12" r="10" />' +
    '  <line x1="2" y1="12" x2="22" y2="12" />' +
    '  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />' +
    '</svg>';

  mount.innerHTML =
    '<nav class="' + navClass + '" id="nav">' +
    '  <div class="nav-inner">' +
    '    <a href="' + prefix + '#hero" class="nav-logo">ERIN CHEN</a>' +
    '    <div class="nav-links">' +
    '      <a href="' + prefix + '#featured" class="nav-link' + (isIndex ? ' active' : '') + '" data-i18n="nav.projects">專案</a>' +
    '      <a href="' + prefix + '#works-grid" class="nav-link" data-i18n="nav.works">作品</a>' +
    '      <a href="' + prefix + '#about" class="nav-link" data-i18n="nav.about">關於我</a>' +
    '      <button class="nav-lang" type="button" aria-label="Switch language">' + langSvg + '<span>EN</span></button>' +
    '    </div>' +
    '    <button class="nav-menu-btn" id="navMenuBtn" aria-label="Toggle menu">' +
    '      <span></span><span></span>' +
    '    </button>' +
    '  </div>' +
    '</nav>' +
    '<div class="mobile-menu" id="mobileMenu">' +
    '  <a href="' + prefix + '#featured" data-i18n="nav.projects">專案</a>' +
    '  <a href="' + prefix + '#works-grid" data-i18n="nav.works">作品</a>' +
    '  <a href="' + prefix + '#about" data-i18n="nav.about">關於我</a>' +
    '  <button class="nav-lang" type="button" aria-label="Switch language">' + langSvg + '<span>EN</span></button>' +
    '</div>';
})();
