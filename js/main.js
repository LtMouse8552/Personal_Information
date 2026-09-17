  (function () {
    "use strict";
    const d = window.SITE_DATA;
    const $ = (id) => document.getElementById(id);

    // ---------- 转义工具 ----------
    const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g,
      (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

    // ============ Hero 基础信息 ============
    document.title = d.name + " — 个人主页";
    $("logo-name").textContent = "~/" + (d.logoText || "portfolio");
    $("hero-name").textContent = d.name;
    $("hero-tagline").textContent = d.tagline || "";
    $("hero-hello").textContent = d.heroHello || "你好,世界";
    document.querySelector(".term-bar .title").textContent = "whoami — zsh — 80×24";

    // ============ Hero 右侧视觉:抽象节点图(Canvas 神经网络) ============
    (function heroVisual() {
      const host = $("hero-visual");
      const canvas = document.createElement("canvas");
      canvas.width = 480; canvas.height = 480;
      canvas.style.maxWidth = "100%";
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const N = 26;
      const nodes = Array.from({ length: N }, () => ({
        x: Math.random() * 480, y: Math.random() * 480,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: 1.5 + Math.random() * 2.5,
        hue: [185, 262, 82][Math.floor(Math.random() * 3)]
      }));
      let raf, visible = true;
      function frame() {
        if (!visible) return;
        ctx.clearRect(0, 0, 480, 480);
        for (const n of nodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > 480) n.vx *= -1;
          if (n.y < 0 || n.y > 480) n.vy *= -1;
        }
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.strokeStyle = "rgba(124,58,237," + (0.14 * (1 - dist / 130)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        for (const n of nodes) {
          ctx.fillStyle = "hsl(" + n.hue + ",80%,65%)";
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        }
        raf = requestAnimationFrame(frame);
      }
      // 页面不可见时暂停,尊重 60fps 且省电
      document.addEventListener("visibilitychange", () => {
        visible = !document.hidden;
        if (visible) frame(); else cancelAnimationFrame(raf);
      });
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting && !document.hidden;
        if (visible) frame(); else cancelAnimationFrame(raf);
      });
      io.observe(canvas);
      frame();
    })();

    // ============ 终端打字机 ============
    (function typewriter() {
      const body = $("term-body");
      const seq = (d.terminal && d.terminal.length ? d.terminal : [
        { type: "cmd", text: "whoami" },
        { type: "out", text: d.name + " · " + (d.school || "") },
        { type: "out", text: d.tagline || "" },
        { type: "cmd", text: "cat ./contact.txt" },
        { type: "out", html: '<span class="hl-c">' + esc((d.contacts && d.contacts[0] && d.contacts[0].text) || "") + "</span>" },
      ]);
      let li = 0, ci = 0, lineEl = null;
      function nextLine() {
        if (li >= seq.length) {
          const c = document.createElement("span");
          c.className = "caret";
          body.appendChild(c);
          return;
        }
        const item = seq[li];
        lineEl = document.createElement("div");
        lineEl.className = "term-line";
        if (item.type === "cmd") {
          lineEl.innerHTML = '<span class="prompt">$ </span><span class="cmd"></span><span class="caret"></span>';
        } else {
          lineEl.innerHTML = item.html ? item.html : '<span class="out"></span>';
        }
        body.appendChild(lineEl);
        ci = 0;
        type();
      }
      function type() {
        const item = seq[li];
        if (item.type === "cmd") {
          const target = lineEl.querySelector(".cmd");
          ci++;
          target.textContent = item.text.slice(0, ci);
          if (ci < item.text.length) { setTimeout(type, 65 + Math.random() * 60); return; }
        }
        li++;
        const c = lineEl.querySelector(".caret");
        if (c) c.remove();
        setTimeout(nextLine, item.type === "cmd" ? 350 : 180);
      }
      nextLine();
    })();

    // ============ About:Bento 渲染 ============
    (function about() {
      const a = d.about || {};
      // JSON 卡片
      const jsonLines = [
        '<span class="jc">// about.md — 自动生成于 ' + new Date().getFullYear() + '</span>',
        '<span class="jk">const</span> <span class="jf">me</span> = {',
        '  <span class="jk">name</span>: <span class="js">"' + esc(a.name || d.name) + '"</span>,',
        '  <span class="jk">school</span>: <span class="js">"' + esc(a.school || d.school || "") + '"</span>,',
        '  <span class="jk">major</span>: <span class="js">"' + esc(a.major || "") + '"</span>,',
        '  <span class="jk">role</span>: <span class="js">"' + esc(a.role || "") + '"</span>,',
        '  <span class="jk">bio</span>: [',
        (a.bioLines || []).map((l) => '    <span class="js">"' + esc(l) + '"</span>').join(",\n") + ",",
        '  ],',
        '  <span class="jk">openToWork</span>: <span class="jn">' + (a.openToWork !== false) + "</span>,",
        "};",
      ];
      $("about-json").innerHTML = jsonLines.join("\n");
      $("about-status").textContent = a.status || "";
      $("about-chips").innerHTML = (a.keywords || [])
        .map((k) => '<span class="chip"># ' + esc(k) + "</span>").join("");
      $("about-facts").innerHTML = (a.facts || [])
        .map((f) => "<li>" + esc(f) + "</li>").join("");
    })();

    // ============ Skills:package.json ============
    (function skills() {
      const groups = d.skillGroups || [];
      const fmt = (k) => '<span class="jk">"' + esc(k) + '"</span>:';
      $("pkg-body").innerHTML = groups.map((g) =>
        '<div class="pkg-deps">' +
        '<div class="pkg-head">' + fmt(g.key) + " {" + "</div>" +
        '<div class="dep-row">' +
        g.items.map((it) =>
          '<div class="dep" tabindex="0">' +
          '<span class="name">"' + esc(it.name) + '"</span><span class="ver">' + esc(it.level || "") + "</span>" +
          '<span class="tip">' + (it.tip ? esc(it.tip) + "<br>" : "") +
          '<span class="lvl">proficiency: ' + esc(it.level || "—") + "</span></span>" +
          "</div>").join("") +
        "</div><div>}</div></div>"
      ).join("");
    })();

    // ============ Experience:git log ============
    (function experience() {
      const items = d.experience || [];
      const badgeClass = { feat: "badge-feat", fix: "badge-fix", refactor: "badge-refactor", merge: "badge-merge", docs: "badge-docs" };
      $("git-log").innerHTML = items.map((e) =>
        '<div class="commit">' +
        '<div><span class="hash">commit ' + esc(e.hash || "f4262e7") + '</span>' +
        '<span class="badge ' + (badgeClass[e.tag] || "badge-feat") + '">' + esc(e.tag || "feat") + "</span></div>" +
        "<h3>" + esc(e.title) + "</h3>" +
        '<div class="time">' + esc(e.time || "") + "</div>" +
        (e.description ? "<p>" + esc(e.description) + "</p>" : "") +
        "</div>"
      ).join("");
    })();

    // ============ Projects:repo cards ============
    (function projects() {
      const LANG_COLORS = {
        "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Python": "#3572A5",
        "Java": "#b07219", "C": "#555555", "C++": "#f34b7d", "C#": "#178600",
        "HTML": "#e34c26", "CSS": "#563d7c", "Vue": "#41b883", "Go": "#00ADD8",
        "Rust": "#dea584", "Shell": "#89e051", "Kotlin": "#A97BFF", "Swift": "#F05138",
      };
      const starSvg = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>';
      const forkSvg = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';
      const bookSvg = '<svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>';
      $("repo-grid").innerHTML = (d.projects || []).map((p) => {
        const langs = p.languages || [];
        const colors = langs.map((l) => LANG_COLORS[l] || "#8b8b9e");
        const main = langs[0] || "";
        return '<article class="card repo reveal tilt">' +
          '<div class="lang-bar">' + colors.map((c) => '<span style="background:' + c + '"></span>').join("") + "</div>" +
          '<div class="repo-body">' +
          "<h3>" + bookSvg + esc(p.name) + "</h3>" +
          '<p class="desc">' + esc(p.description || "") + "</p>" +
          '<div class="repo-meta">' +
          (main ? '<span class="l"><span class="lang-dot" style="background:' + (LANG_COLORS[main] || "#8b8b9e") + '"></span>' + esc(main) + "</span>" : "") +
          '<span class="l">' + starSvg + esc(p.stars || "0") + "</span>" +
          '<span class="l">' + forkSvg + esc(p.forks || "0") + "</span>" +
          "</div>" +
          '<div class="chips">' + (p.tech || []).map((t) => '<span class="chip">' + esc(t) + "</span>").join("") + "</div>" +
          '<div class="repo-links">' +
          (p.links || []).map((l) => '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>").join("") +
          "</div></div></article>";
      }).join("");
    })();

    // ============ Contact ============
    (function contact() {
      const mail = (d.contacts || []).find((c) => /@/.test(c.text)) || {};
      $("big-mail").textContent = mail.text || "";
      $("big-mail").href = "mailto:" + (mail.text || "");
      $("socials").innerHTML = (d.contacts || [])
        .filter((c) => /^https?:\/\//.test(c.text))
        .map((c) => '<a class="social-btn" href="' + esc(c.text) + '" target="_blank" rel="noopener">' + esc(c.label || c.text) + " ↗</a>")
        .join("");

      $("contact-form").addEventListener("submit", () => {
        const name = $("f-name").value.trim();
        const email = $("f-email").value.trim();
        const msg = $("f-msg").value.trim();
        const resp = $("resp");
        if (!name || !email || !msg) {
          resp.className = "resp err";
          resp.textContent = "HTTP 400 Bad Request\n{ \"error\": \"所有字段均必填\" }";
          return;
        }
        resp.className = "resp ok";
        resp.textContent = "HTTP/1.1 201 Created\n{ \"message\": \"收到!我会尽快回复 " + name + " ~\" }";
        $("contact-form").reset();
      });
    })();

    // ============ Footer / 状态栏 ============
    $("footer-year").textContent = new Date().getFullYear();
    $("footer-text").innerHTML = (d.footer || "build with") + " <span class='heart'>❤</span> and code · © " + new Date().getFullYear() + " " + esc(d.name);
    $("sb-version").textContent = d.version || "1.0.0";
    setInterval(() => {
      $("sb-time").textContent = new Date().toLocaleTimeString("zh-CN", { hour12: false });
    }, 1000);

    // ============ 主题切换(IDE Dark+ / Light+) ============
    (function theme() {
      const btn = $("theme-toggle");
      const apply = (light) => {
        document.documentElement.classList.toggle("light", light);
        btn.textContent = light ? "☀ light+" : "☾ dark+";
        $("sb-theme").textContent = light ? "Light+" : "Dark+";
      };
      apply(localStorage.getItem("ide-theme") === "light");
      btn.addEventListener("click", () => {
        const light = !document.documentElement.classList.contains("light");
        apply(light);
        localStorage.setItem("ide-theme", light ? "light" : "dark");
      });
    })();

    // ============ Tab 高亮 + 平滑锚点 ============
    (function tabs() {
      const tabsArr = Array.from(document.querySelectorAll(".tab"));
      const sections = tabsArr.map((t) => $(t.dataset.target)).filter(Boolean);
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          tabsArr.forEach((t) => t.classList.toggle("active", t.dataset.target === en.target.id));
        });
      }, { rootMargin: "-35% 0px -55% 0px" });
      sections.forEach((s) => io.observe(s));
    })();

    // ============ 滚动渐入 ============
    (function reveal() {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      // git 分支线生长
      const log = $("git-log");
      const io2 = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) { log.classList.add("drawn"); io2.disconnect(); }
      }, { threshold: 0.25 });
      io2.observe(log);
    })();

    // ============ 鼠标跟随光晕 ============
    (function glow() {
      const g = $("cursor-glow");
      let x = 0, y = 0, tx = 0, ty = 0, raf = null;
      window.addEventListener("mousemove", (e) => {
        tx = e.clientX; ty = e.clientY; g.style.opacity = "1";
        if (!raf) loop();
      });
      function loop() {
        x += (tx - x) * 0.08; y += (ty - y) * 0.08;
        g.style.left = x + "px"; g.style.top = y + "px";
        raf = Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5 ? requestAnimationFrame(loop) : null;
      }
    })();

    // ============ 卡片 3D tilt ============
    (function tilt() {
      if (window.matchMedia("(hover: none)").matches) return;
      document.querySelectorAll(".tilt, .term").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - .5) * -5;
          const ry = ((e.clientX - r.left) / r.width - .5) * 5;
          el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
      });
    })();

    // ============ 彩蛋:Konami Code + sudo ============
    (function easter() {
      const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
      let ki = 0, typed = "";
      const box = $("easter");
      const show = (msg) => {
        $("easter-extra").textContent = msg || "";
        box.classList.add("show");
      };
      const hide = () => box.classList.remove("show");
      box.addEventListener("click", hide);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { hide(); return; }
        if (e.key === KONAMI[ki]) {
          ki++;
          if (ki === KONAMI.length) { ki = 0; show("↑↑↓↓←→←→BA — 老玩家的暗号。"); }
        } else { ki = (e.key === KONAMI[0]) ? 1 : 0; }
        if (e.target.matches("input, textarea")) return;
        typed = (typed + e.key).slice(-10).toLowerCase();
        if (typed.endsWith("sudo")) show("$ sudo make me a sandwich 🥪");
      });
    })();

    // ============ 状态栏 Ln/Col(跟随滚动位置,小趣味) ============
    (function lnCol() {
      window.addEventListener("scroll", () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        $("sb-ln").textContent = "Ln " + (1 + Math.round(p * 99)) + ", Col 1";
      }, { passive: true });
    })();
  })();
  