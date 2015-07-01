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

    // We need the twitter app to be loaded
    setTimeout(function() {
      var target = document.querySelector('#view-tweets');
      var observer = new MutationObserver(function(mutations) {
        window.scrollTo(0, 75);
      });
      var config = { attributes: true, childList: false, characterData: false };
      observer.observe(target, config);
    }, 1000);

    var scrolling = false;
    var scrollingTimeout = null;

    window.addEventListener('scroll', function(evt) {
      var wasScrolling = scrolling;
      scrolling = true;

      clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(function() {
        scrolling = false;
      }, 300);

      if (!wasScrolling || (evt.pageY !== 0)) {
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
      var script = document.createElement('script');
      script.setAttribute('type', 'application/javascript');

      var scriptText = document.createTextNode([
        'TWITTER.use("view-registry", function(e) {e.getViewInstance("tweets").refreshContent()});',
        'TWITTER.use("view-registry", function(e) {e.getViewInstance("connect").refreshContent()});'
      ].join('\n'))

      script.appendChild(scriptText);
      document.body.appendChild(script);
  }
}());
