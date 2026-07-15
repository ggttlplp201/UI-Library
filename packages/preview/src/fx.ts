/**
 * Interaction EFFECTS — behaviors attached to a host element, per the design
 * handoff's classification (INVENTORY.md): "effects are behaviors attached to
 * a host element — never standalone components." The Studio applies them to
 * any placed component; this one module feeds BOTH the preview harness and
 * the HTML export runtime, so canvas and exported site behave identically.
 *
 * FX_JS defines `__ssFxAttach(el, cfg) -> cleanup()`. It is embedded into
 * template literals, so it must contain no backticks and no `${`.
 * Logic is ported verbatim from code/kinetic-lab-effects.md.
 */

export interface FxDef {
  id: string
  name: string
  description: string
  /** Effect animates the host's text content (text param applies) */
  textBased?: boolean
}

export const FX_CATALOG: FxDef[] = [
  { id: 'magnetic', name: 'Magnetic', description: 'Pulls toward the cursor, springs back on leave.' },
  { id: 'ripple', name: 'Ripple', description: 'Ink ripple spawns from the click point.' },
  { id: 'confetti', name: 'Confetti', description: 'Physics particle burst on every click.' },
  { id: 'tilt', name: '3D Tilt', description: 'Parallax tilt with a moving specular glare.' },
  { id: 'border', name: 'Living border', description: 'A conic beam orbits the edge, forever.' },
  { id: 'scramble', name: 'Text scramble', description: 'Characters scramble, then resolve — on hover.', textBased: true },
  { id: 'countup', name: 'Count-up', description: 'Numbers ease up from 0 on entrance.', textBased: true },
  { id: 'stagger', name: 'Stagger reveal', description: 'Children cascade in one after another.' },
  { id: 'glitch', name: 'Glitch text', description: 'Clipped clones slice and jitter in bursts.', textBased: true },
  { id: 'typewriter', name: 'Typewriter', description: 'Types itself out with a blinking caret.', textBased: true },
]

export const FX_CSS = `
@keyframes ssfx-ripple{to{transform:scale(4);opacity:0}}
@keyframes ssfx-orbit{to{transform:rotate(360deg)}}
@keyframes ssfx-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
@keyframes ssfx-glitchtop{0%{clip-path:inset(0 0 90% 0);transform:translate(0)}2%{clip-path:inset(18% 0 55% 0);transform:translate(-5px,-2px)}4%{clip-path:inset(60% 0 22% 0);transform:translate(5px,2px)}6%{clip-path:inset(8% 0 78% 0);transform:translate(-4px,1px)}8%{clip-path:inset(45% 0 33% 0);transform:translate(4px,-1px)}10%,100%{clip-path:inset(0 0 100% 0);transform:translate(0)}}
@keyframes ssfx-glitchbot{0%{clip-path:inset(90% 0 0 0);transform:translate(0)}3%{clip-path:inset(55% 0 20% 0);transform:translate(5px,2px)}5%{clip-path:inset(22% 0 60% 0);transform:translate(-5px,-2px)}7%{clip-path:inset(75% 0 10% 0);transform:translate(4px,-1px)}9%{clip-path:inset(33% 0 45% 0);transform:translate(-4px,1px)}11%,100%{clip-path:inset(100% 0 0 0);transform:translate(0)}}
`

export const FX_JS = `
function __ssFxAttach(el, cfg) {
  if (!el || !cfg || !cfg.id) return function () {};
  var accent = cfg.accent || '#E3B23C';
  var cleanups = [];
  var on = function (target, ev, fn) {
    target.addEventListener(ev, fn);
    cleanups.push(function () { target.removeEventListener(ev, fn); });
  };
  var savedStyle = el.getAttribute('style');
  cleanups.push(function () {
    if (savedStyle === null) el.removeAttribute('style');
    else el.setAttribute('style', savedStyle);
  });

  if (cfg.id === 'magnetic') {
    el.style.transition = 'transform .35s cubic-bezier(.34,1.8,.5,1)';
    on(el, 'mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      el.style.transform = 'translate(' + x * 0.4 + 'px,' + y * 0.4 + 'px) scale(1.04)';
    });
    on(el, 'mouseleave', function () { el.style.transform = 'translate(0,0) scale(1)'; });

  } else if (cfg.id === 'ripple') {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    on(el, 'click', function (e) {
      var r = el.getBoundingClientRect();
      var d = Math.max(r.width, r.height) * 2;
      var s = document.createElement('span');
      s.style.cssText = 'position:absolute;left:' + (e.clientX - r.left) + 'px;top:' + (e.clientY - r.top) + 'px;width:' + d + 'px;height:' + d + 'px;margin-left:' + (-d / 2) + 'px;margin-top:' + (-d / 2) + 'px;border-radius:50%;background:rgba(255,255,255,.4);pointer-events:none;transform:scale(0);animation:ssfx-ripple .6s ease-out forwards';
      el.appendChild(s);
      setTimeout(function () { s.remove(); }, 640);
    });

  } else if (cfg.id === 'confetti') {
    on(el, 'click', function (e) {
      for (var i = 0; i < 34; i++) {
        var p = document.createElement('div');
        var sz = 6 + Math.random() * 8;
        p.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:' + sz + 'px;height:' + sz + 'px;background:' + accent + ';border-radius:' + (Math.random() < 0.5 ? '50%' : '2px') + ';pointer-events:none;z-index:9999;transform:translate(-50%,-50%)';
        document.body.appendChild(p);
        var ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 150;
        var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
        var a = p.animate([
          { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
          { transform: 'translate(calc(-50% + ' + dx.toFixed(0) + 'px), calc(-50% + ' + (dy + 100).toFixed(0) + 'px)) rotate(' + ((Math.random() * 720 - 360) | 0) + 'deg)', opacity: 0 }
        ], { duration: 750 + Math.random() * 550, easing: 'cubic-bezier(.15,.6,.3,1)' });
        (function (node) { a.onfinish = function () { node.remove(); }; })(p);
      }
    });

  } else if (cfg.id === 'tilt') {
    var parent = el.parentElement;
    var savedPersp = parent ? parent.style.perspective : '';
    if (parent) parent.style.perspective = '900px';
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var glare = document.createElement('div');
    glare.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;z-index:5';
    el.appendChild(glare);
    cleanups.push(function () { glare.remove(); if (parent) parent.style.perspective = savedPersp; });
    on(el, 'mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .08s linear';
      el.style.transform = 'rotateY(' + (px * 22).toFixed(2) + 'deg) rotateX(' + (-py * 22).toFixed(2) + 'deg) scale(1.05)';
      glare.style.background = 'radial-gradient(circle at ' + ((px + 0.5) * 100).toFixed(0) + '% ' + ((py + 0.5) * 100).toFixed(0) + '%, rgba(255,255,255,.4), transparent 55%)';
    });
    on(el, 'mouseleave', function () {
      el.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
      glare.style.background = 'none';
    });

  } else if (cfg.id === 'border') {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var ring = document.createElement('div');
    var radius = getComputedStyle(el).borderRadius || '16px';
    ring.style.cssText = 'position:absolute;inset:-2px;border-radius:' + radius + ';overflow:hidden;pointer-events:none;z-index:4;padding:2px;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude';
    var beam = document.createElement('div');
    beam.style.cssText = 'position:absolute;top:50%;left:50%;width:300%;aspect-ratio:1;background:conic-gradient(' + accent + ' 0deg 70deg,transparent 70deg 360deg);transform:translate(-50%,-50%);animation:ssfx-orbit 4s linear infinite';
    ring.appendChild(beam);
    el.appendChild(ring);
    cleanups.push(function () { ring.remove(); });

  } else if (cfg.id === 'scramble') {
    var target = cfg.text || (el.textContent || '').trim() || 'DECODE ME';
    var iv = null;
    var play = function () {
      clearInterval(iv);
      var chars = '!<>-_\\\\/[]{}=+*^?#________';
      var frame = 0;
      iv = setInterval(function () {
        var out = '';
        for (var i = 0; i < target.length; i++) {
          if (target[i] === ' ') { out += ' '; continue; }
          out += (i < frame / 2.2) ? target[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = out;
        frame++;
        if (frame / 2.2 >= target.length) { clearInterval(iv); el.textContent = target; }
      }, 40);
    };
    on(el, 'mouseenter', play);
    var savedText = el.innerHTML;
    cleanups.push(function () { clearInterval(iv); el.innerHTML = savedText; });

  } else if (cfg.id === 'countup') {
    var raw = cfg.text || (el.textContent || '').replace(/[^0-9.]/g, '') || '100';
    var num = parseFloat(raw); if (isNaN(num)) num = 100;
    var decimals = String(raw).indexOf('.') >= 0;
    var savedHtml = el.innerHTML;
    var rafId = 0;
    cleanups.push(function () { cancelAnimationFrame(rafId); el.innerHTML = savedHtml; });
    var start = performance.now(), dur = 1600;
    var tick = function (now) {
      var p = Math.min(1, (now - start) / dur), e2 = 1 - Math.pow(1 - p, 3), v = num * e2;
      el.textContent = decimals ? v.toFixed(1) : Math.round(v).toLocaleString();
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

  } else if (cfg.id === 'stagger') {
    var anims = [];
    Array.prototype.forEach.call(el.children, function (ch, i) {
      if (ch.animate) anims.push(ch.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 500, delay: i * 90, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'backwards' }));
    });
    cleanups.push(function () { anims.forEach(function (a) { try { a.cancel(); } catch (e2) {} }); });

  } else if (cfg.id === 'glitch') {
    var word = cfg.text || (el.textContent || '').trim() || 'GLITCH';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var mk = function (anim) {
      var c = document.createElement('span');
      c.setAttribute('aria-hidden', 'true');
      c.textContent = word;
      c.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:' + accent + ';animation:' + anim + ' 4s steps(1) infinite;pointer-events:none';
      el.appendChild(c);
      return c;
    };
    var c1 = mk('ssfx-glitchtop'), c2 = mk('ssfx-glitchbot');
    cleanups.push(function () { c1.remove(); c2.remove(); });

  } else if (cfg.id === 'typewriter') {
    var text = cfg.text || (el.textContent || '').trim() || 'KINETIC MOTION';
    var savedInner = el.innerHTML;
    el.textContent = '';
    var caret = document.createElement('span');
    caret.style.cssText = 'display:inline-block;width:2px;height:1em;background:' + accent + ';margin-left:2px;vertical-align:text-bottom;animation:ssfx-blink 1s steps(1) infinite';
    var host = document.createElement('span');
    el.appendChild(host);
    el.appendChild(caret);
    var timers = [];
    var t = 0;
    for (var i = 0; i < text.length; i++) {
      (function (ch) {
        t += ch === ' ' ? 90 + Math.random() * 120 : 45 + Math.random() * 165;
        timers.push(setTimeout(function () { host.textContent += ch; }, t));
      })(text[i]);
    }
    cleanups.push(function () { timers.forEach(clearTimeout); el.innerHTML = savedInner; });
  }

  return function () { cleanups.forEach(function (fn) { fn(); }); };
}
`
