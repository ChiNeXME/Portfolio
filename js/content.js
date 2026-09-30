(function () {
  "use strict";

  var TYPES = {
    devlogs: {
      dir: "devlogs", page: "devlog.html", index: "devlogs.html",
      list: "postList", article: "postContent", all: "All devlogs",
      emptyTitle: "No devlogs yet",
      emptyText: "The first one is still being written. Until then, the projects page shows what I’m working on.",
      emptyLink: ["projects.html", "See projects"]
    },
    projects: {
      dir: "projects", page: "project.html", index: "projects.html",
      list: "projectList", article: "postContent", all: "All projects"
    }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(https?:\/\/|[a-z0-9_./-]+$)/i.test(u) ? u : "";
  }

  function getItems(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.posts)) return data.posts;
    return [];
  }

  function fmtDate(d) {
    if (!d) return "";
    var dt = new Date(d);
    if (isNaN(dt)) return d;
    return new Intl.DateTimeFormat("en-SG", { year: "numeric", month: "short", day: "numeric" }).format(dt);
  }

  function loadManifest(t) {
    return fetch(t.dir + "/manifest.json", { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("manifest " + r.status);
      return r.json();
    });
  }

  function stripFrontMatter(md) {
    return md.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  }

  function done(el) { el.setAttribute("aria-busy", "false"); }

  function tagsHtml(tags) {
    var chips = (tags || []).map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("");
    return chips ? '<div class="tags">' + chips + "</div>" : "";
  }

  function renderDevlogs(t) {
    var el = document.getElementById(t.list);
    if (!el) return;
    loadManifest(t).then(function (data) {
      var items = getItems(data).slice().sort(function (a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });
      done(el);
      if (!items.length) {
        el.innerHTML = '<div class="empty"><h2>' + esc(t.emptyTitle) + "</h2><p>" + esc(t.emptyText) + "</p>" +
          '<a class="text-link" href="' + t.emptyLink[0] + '">' + esc(t.emptyLink[1]) + '<i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>';
        return;
      }
      el.innerHTML = items.map(function (p) {
        var img = safeUrl(p.image);
        return '<a class="post-item' + (img ? " has-thumb" : "") + '" href="' + t.page + "?slug=" + encodeURIComponent(p.slug) + '">' +
          (img ? '<img class="post-thumb" src="' + esc(img) + '" alt="" loading="lazy" decoding="async" />' : "") +
          '<time datetime="' + esc(p.date) + '">' + esc(fmtDate(p.date)) + "</time>" +
          "<h2>" + esc(p.title) + "</h2>" +
          '<i class="ph ph-arrow-up-right" aria-hidden="true"></i>' +
          (p.summary ? "<p>" + esc(p.summary) + "</p>" : "") + tagsHtml(p.tags) + "</a>";
      }).join("");
    }).catch(function (err) {
      done(el);
      console.warn("Could not load " + t.dir + "/manifest.json (" + err.message + "). Serve the site over http, e.g. `python -m http.server`.");
      el.innerHTML = '<div class="empty"><h2>Devlogs didn\'t load</h2><p>Refresh the page to try again.</p></div>';
    });
  }

  function renderProjects(t) {
    var el = document.getElementById(t.list);
    if (!el) return;
    loadManifest(t).then(function (data) {
      var items = getItems(data).slice().sort(function (a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });
      done(el);
      if (!items.length) { el.hidden = true; return; }
      el.innerHTML = items.map(function (p) {
        var img = safeUrl(p.image);
        return '<a class="project-card" href="' + t.page + "?slug=" + encodeURIComponent(p.slug) + '">' +
          (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async" />' : "") +
          '<div class="project-body"><h3>' + esc(p.title) + "</h3>" +
          (p.summary ? "<p>" + esc(p.summary) + "</p>" : "") + tagsHtml(p.tags) + "</div></a>";
      }).join("");
    }).catch(function () { done(el); el.hidden = true; });
  }

  function notFound(el, t) {
    done(el);
    el.innerHTML = '<div class="empty"><h2>Not found</h2><p>The link may be wrong, or it was removed.</p>' +
      '<a class="text-link" href="' + t.index + '">' + esc(t.all) + '<i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>';
  }

  function renderArticle(t) {
    var el = document.getElementById(t.article);
    if (!el) return;
    var slug = new URLSearchParams(location.search).get("slug");
    if (!slug || !/^[a-z0-9-]+$/i.test(slug)) { notFound(el, t); return; }

    loadManifest(t).then(function (data) {
      var meta = getItems(data).filter(function (p) { return p.slug === slug; })[0];
      return fetch(t.dir + "/" + slug + ".md", { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("md " + r.status);
        return r.text();
      }).then(function (md) {
        var title = (meta && meta.title) || slug;
        document.title = title + " | Muhammad Zulhilmi";
        var body = stripFrontMatter(md);
        var html = (window.DOMPurify && window.marked)
          ? window.DOMPurify.sanitize(window.marked.parse(body))
          : "<p>" + esc(body) + "</p>";
        var link = meta && safeUrl(meta.link);
        var source = meta && safeUrl(meta.source);
        function btn(href, label, cls, icon) {
          return href ? '<a class="btn ' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(label) +
            '<span class="btn-icon" aria-hidden="true"><i class="ph ' + icon + '"></i></span>' +
            '<span class="visually-hidden"> (opens in a new tab)</span></a>' : "";
        }
        done(el);
        el.innerHTML =
          "<h1>" + esc(title) + "</h1>" +
          (meta && meta.date ? '<p class="meta"><time datetime="' + esc(meta.date) + '">' + esc(fmtDate(meta.date)) + "</time></p>" : "") +
          (meta ? tagsHtml(meta.tags) : "") +
          '<div class="markdown">' + html + "</div>" +
          (link || source ? '<p class="article-link">' + btn(link, (meta && meta.linkLabel) || "Open project", "btn-primary", "ph-arrow-up-right") +
            btn(source, (meta && meta.sourceLabel) || "Source code", "btn-quiet", "ph-github-logo") + "</p>" : "");
      });
    }).catch(function () { notFound(el, t); });
  }

  window.contentInit = function (mode) {
    if (mode === "devlogs") renderDevlogs(TYPES.devlogs);
    else if (mode === "devlog") renderArticle(TYPES.devlogs);
    else if (mode === "projects") renderProjects(TYPES.projects);
    else if (mode === "project") renderArticle(TYPES.projects);
  };
})();
