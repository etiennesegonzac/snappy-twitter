(function () {

  if (document.documentElement) {
    initialize();
  } else {
    window.addEventListener('load', initialize);
  }

  function initialize() {

    var SHEET_ID = 'snappy-tweaks';
    var SHEET_SELECTOR = 'style#' + SHEET_ID;

    var existing = document.head.querySelector(SHEET_SELECTOR);
    if (existing) {
      return;
    }

    var sheet = document.createElement('style');
    sheet.setAttribute('id', SHEET_ID);
    sheet.setAttribute('type', 'text/css');

    var styleText = document.createTextNode([
      '.view-tweets .stream-container, .view-connect .stream-container { margin-top: 70px; }',
      'body { scroll-snap-destination: 0 80px; scroll-snap-type: mandatory; }',
      '.stream-item { scroll-snap-coordinate: 50% 0, 50% 100%; }',
      '.navbar .navItem.glow { background-position: 50% 100% }'
    ].join('\n'))

    sheet.appendChild(styleText);
    document.head.appendChild(sheet);

    var scrolling = false;
    window.addEventListener('touchstart', function() {
      scrolling = true;
    });
    window.addEventListener('touchend', function() {
      scrolling = false;
    });
    window.addEventListener('touchcancel', function() {
      scrolling = false;
    });

    window.addEventListener('scroll', function(evt) {
      if (evt.pageY !== 0) {
        return;
      }

      if (!scrolling) {
        document.documentElement.scrollBy({top: 70, behavior: 'smooth'})
        return;
      }

      var title = document.querySelector('.title');
      if (title.dataset.real) {
        // Already reloading
        return;
      }

      reload();

      title.dataset.real = title.textContent;
      title.textContent = '…';

      setTimeout(function() {
        title.textContent = title.dataset.real;
        title.dataset.real = '';
      }, 1500);
    });
  }

  function reload() {
      var SCRIPT_ID = 'snappy-reload';
      var SCRIPT_SELECTOR = 'script#' + SCRIPT_ID;

      var existing = document.body.querySelector(SCRIPT_SELECTOR);
      if (existing) {
        existing.remove();
      }

      var script = document.createElement('script');
      script.setAttribute('id', SCRIPT_ID);
      script.setAttribute('type', 'application/javascript');

      var scriptText = document.createTextNode([
        'TWITTER.use("view-registry", function(e) {var v = e.getViewInstance("tweets"); v && v.refreshContent()});',
        'TWITTER.use("view-registry", function(e) {var v = e.getViewInstance("connect"); v && v.refreshContent()});'
      ].join('\n'))

      script.appendChild(scriptText);
      document.body.appendChild(script);
  }
}());
