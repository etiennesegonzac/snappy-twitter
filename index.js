(function() {

  if (document.documentElement) {
    initialize();
  } else {
    window.addEventListener('load', initialize);
  }

  function initialize() {

    var TWITTER_COLOUR = '#55ACEE';
    var SHEET_ID = 'snappy-tweaks';
    var SHEET_SELECTOR = 'style#' + SHEET_ID;

    var existing = document.head.querySelector(SHEET_SELECTOR);
    if (existing) {
      return;
    }

    var themeColourMetaTag = document.createElement('meta');
    themeColourMetaTag.setAttribute('name', 'theme-color');
    themeColourMetaTag.setAttribute('content', TWITTER_COLOUR);
    document.head.appendChild(themeColourMetaTag);

    var sheet = document.createElement('style');
    sheet.setAttribute('id', SHEET_ID);
    sheet.setAttribute('type', 'text/css');

    var styleText = document.createTextNode([
      '.view-tweets .stream-container, .view-connect .stream-container { margin-top: 70px; }',
      'body { scroll-snap-destination: 0 80px; scroll-snap-type: mandatory; }',
      '#view-tweets .stream-item, #view-connect .stream-item { scroll-snap-coordinate: 50% 0, 50% 100%; }',
      '.navbar .navItem.glow { background-position: 50% 100% }'
    ].join('\n'));

    sheet.appendChild(styleText);
    document.head.appendChild(sheet);

    var scrolling = false;
    var position = 0;
    window.addEventListener('touchstart', function() {
      scrolling = true;
    });
    window.addEventListener('touchend', function() {
      scrolling = false;
      if (position < 4) {
        var showing = document.querySelector('[showing=true]').id;
        if (['view-tweets', 'view-connect'].indexOf(showing) === -1) {
          return;
        }
        reload();
      }
    });
    window.addEventListener('touchcancel', function() {
      scrolling = false;
    });

    window.addEventListener('scroll', function(evt) {
      position = evt.pageY;

      if (position >= 4) {
        cleanRotate();
        return;
      }

      var showing = document.querySelector('[showing=true]').id;
      if (['view-tweets', 'view-connect'].indexOf(showing) === -1) {
        return;
      }

      if (!scrolling) {
        document.documentElement.scrollBy({top: 70, behavior: 'smooth'});
        return;
      }

      rotate();
    });
  }

  function rotate() {
    var nudges = document.querySelectorAll('[showing=true] .reload-nudge');
    for (var nudge of nudges) {
      nudge.style.transform = 'rotate(-90deg)';
    }
  }

  function cleanRotate() {
    var nudges = document.querySelectorAll('[showing=true] .reload-nudge');
    for (var nudge of nudges) {
      if (nudge.style.transform) {
        nudge.style.transform = '';
      }
    }
  }

  function reload() {
    var tab = document.querySelector('.active').getAttribute('tab');
    if (["tweets", "connect"].indexOf(tab) === -1) {
      return;
    }

    var title = document.querySelector('.title');
    if (title.dataset.real) {
      // Already reloading
      return;
    }

    title.dataset.real = title.textContent;
    title.textContent = '…';

    setTimeout(function() {
      title.textContent = title.dataset.real;
      title.dataset.real = '';
    }, 1500);

    var SCRIPT_ID = 'snappy-reload';
    var SCRIPT_SELECTOR = 'script#' + SCRIPT_ID;

    var existing = document.body.querySelector(SCRIPT_SELECTOR);
    if (existing) {
      existing.remove();
    }

    var script = document.createElement('script');
    script.setAttribute('id', SCRIPT_ID);
    script.setAttribute('type', 'application/javascript');

    var toReload = (tab == 'Home') ? 'tweets' : 'connect';

    var scriptText = document.createTextNode(
      'TWITTER.use("view-registry", function(e) {var v = e.getViewInstance("' +
      toReload +
      '"); v && v.refreshContent()});');

    script.appendChild(scriptText);
    document.body.appendChild(script);
  }
}());
