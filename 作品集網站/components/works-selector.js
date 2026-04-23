(function () {
  var mount = document.getElementById('works-selector');
  if (!mount) return;

  var works = [
    { href: 'case-TmCDF.html', title: 'TmCDF 官網' },
    { href: 'case-judian.html', title: '聚典資訊 官網' },
    { href: 'case-metro.html', title: '台北捷運Go' },
    { href: 'case-fitness.html', title: '我的健身工廠' }
  ];

  var currentPath = (window.location.pathname.split('/').pop() || '').toLowerCase();
  var idx = works.findIndex(function (w) {
    return w.href.toLowerCase() === currentPath;
  });
  if (idx === -1) return;

  var prev = works[(idx - 1 + works.length) % works.length];
  var next = works[(idx + 1) % works.length];

  mount.innerHTML =
    '<nav class="works-nav" aria-label="作品切換">' +
    '  <a href="' + prev.href + '" class="works-nav-item works-nav-prev">' +
    '    <span class="works-nav-title">' + prev.title + '</span>' +
    '    <span class="works-nav-btn" aria-hidden="true">' +
    '      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>' +
    '    </span>' +
    '  </a>' +
    '  <a href="' + next.href + '" class="works-nav-item works-nav-next">' +
    '    <span class="works-nav-title">' + next.title + '</span>' +
    '    <span class="works-nav-btn" aria-hidden="true">' +
    '      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
    '    </span>' +
    '  </a>' +
    '</nav>';
})();
