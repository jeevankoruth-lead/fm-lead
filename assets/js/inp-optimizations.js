(function () {
  var selector = "a.fm-home-cta-button, .focus-ops-card-title a, a.focus-ops-card-cta";
  var prefetched = new Set();

  function isPrefetchSupported() {
    var link = document.createElement("link");
    return !!(link.relList && link.relList.supports && link.relList.supports("prefetch"));
  }

  function normalizeURL(href) {
    if (!href || href.charAt(0) === "#") return "";
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return "";
      if (url.pathname === window.location.pathname && !url.search) return "";
      return url.href;
    } catch (e) {
      return "";
    }
  }

  function prefetch(href) {
    var url = normalizeURL(href);
    if (!url || prefetched.has(url)) return;

    var link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = url;
    document.head.appendChild(link);
    prefetched.add(url);
  }

  function prefetchFromElement(target) {
    if (!target) return;
    var link = target.closest("a");
    if (!link) return;
    prefetch(link.href);
  }

  function bindHoverPrefetch() {
    document.addEventListener(
      "pointerenter",
      function (event) {
        var node = event.target.closest(selector);
        if (!node) return;
        prefetchFromElement(node);
      },
      true
    );

    document.addEventListener(
      "touchstart",
      function (event) {
        var node = event.target.closest(selector);
        if (!node) return;
        prefetchFromElement(node);
      },
      { passive: true, capture: true }
    );
  }

  function prefetchVisibleLinks() {
    if (!("IntersectionObserver" in window)) return;
    var nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          prefetchFromElement(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "180px 0px" }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function run() {
    if (!isPrefetchSupported()) return;
    bindHoverPrefetch();

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchVisibleLinks, { timeout: 1200 });
    } else {
      window.setTimeout(prefetchVisibleLinks, 500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
