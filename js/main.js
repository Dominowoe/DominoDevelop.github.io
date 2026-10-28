(() => {
    const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

    // Theme
    $('.theme').onclick = () => {
      const d = document.documentElement, t = d.dataset.theme === 'dark' ? 'light' : 'dark';
        d.dataset.theme = t; try { localStorage.setItem('theme', t); } catch (e) {}
        };

        // Mobile nav + year
        const nav = $('#nav'), bg = $('.burger');
        bg.onclick = () => bg.setAttribute('aria-expanded', nav.classList.toggle('open'));
        nav.onclick = e => { if (e.target.closest('a')) { nav.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); } };
        $('#y').textContent = new Date().getFullYear();

        // Reveal + counters
        const count = el => {
          const n = +el.dataset.n, s = el.dataset.s || '';
            if (reduce) return;
              let t0; const f = t => { t0 ??= t; const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(n * (1 - (1 - p) ** 3)) + s; if (p < 1) requestAnimationFrame(f); };
                requestAnimationFrame(f);
                };
                const io = new IntersectionObserver(es => es.forEach(e => {
                  if (!e.isIntersecting) return;
                    e.target.classList.add('in'); io.unobserve(e.target); $$('[data-n]', e.target).forEach(count);
                    }), { threshold: .15 });
                    $$('.rv').forEach(el => io.observe(el));

                    // Active nav link
                    const links = $$('#nav a');
                    const so = new IntersectionObserver(es => es.forEach(e => {
                      if (e.isIntersecting) links.forEach(a => a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
                      }), { rootMargin: '-45% 0px -50% 0px' });
                      links.forEach(a => { const s = $(a.hash); if (s) so.observe(s); });

                      // Card spotlight
                      document.addEventListener('pointermove', e => {
                        const c = e.target.closest?.('.card');
                          if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }
                          });

                          // Carousel (controls hide automatically when everything fits)
                          const tr = $('.track'), sl = $$('li', tr), dots = $('.dots'), ctrl = $('.ctrl'), [pv, nx] = $$('.nav', ctrl);
                          const idx = () => Math.round(tr.scrollLeft / (sl[0].offsetWidth + 20));
                          const go = i => tr.scrollTo({ left: sl[Math.max(0, Math.min(i, sl.length - 1))].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
                          sl.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Reference ' + (i + 1)); b.onclick = () => go(i); dots.append(b); });
                          const upd = () => { ctrl.hidden = tr.scrollWidth <= tr.clientWidth + 2; $$('button', dots).forEach((b, i) => i === idx() ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')); };
                          pv.onclick = () => go(idx() - 1); nx.onclick = () => go(idx() + 1);
                          tr.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();

                          // Contact form
                          const f = $('form'), st = $('.status', f);
                          f.addEventListener('submit', async e => {
                            e.preventDefault();
                              if (f.website.value) return; // honeypot
                                $$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid'));
                                  const bad = [...f.elements].filter(x => x.willValidate && !x.checkValidity());
                                    if (bad.length) { bad.forEach(x => x.setAttribute('aria-invalid', 'true')); bad[0].focus(); st.textContent = 'Vyplň prosím zvýrazněná pole.'; return; }
                                      const d = new FormData(f), ep = f.dataset.endpoint;
                                        if (!ep) {
                                            location.href = `mailto:dominikdurcek@seznam.cz?subject=${encodeURIComponent(d.get('subject') + ' – ' + d.get('name'))}&body=${encodeURIComponent(d.get('msg') + '\n\n' + d.get('name') + ' <' + d.get('email') + '>')}`;
                                                st.textContent = 'Otevírám e-mailového klienta…'; return;
                                                  }
                                                    st.textContent = 'Odesílám…';
                                                      try { const r = await fetch(ep, { method: 'POST', body: d, headers: { Accept: 'application/json' } }); if (!r.ok) throw 0; f.reset(); st.textContent = 'Díky! Zpráva byla odeslána, ozvu se ti co nejdřív.'; }
                                                        catch { st.textContent = 'Odeslání se nepovedlo. Napiš mi prosím přímo na e-mail.'; }
                                                        });

                                                        // Particles (Canvas 2D, pauses when tab is hidden, static with reduced motion)
                                                        const cv = $('#fx'), cx = cv.getContext('2d'); let W, H, P = [], raf; const m = { x: -1e3, y: -1e3 };
                                                        const size = () => {
                                                          const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
                                                            P = Array.from({ length: Math.min(80, W * H / 16000 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
                                                            };
                                                            const draw = () => {
                                                              cx.clearRect(0, 0, W, H); cx.fillStyle = 'rgba(80,170,255,.7)';
                                                                for (const p of P) {
                                                                    p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
                                                                        const dx = p.x - m.x, dy = p.y - m.y; if (dx * dx + dy * dy < 14400) { p.x += dx * .02; p.y += dy * .02; }
                                                                            cx.fillRect(p.x, p.y, 1.6, 1.6);
                                                                              }
                                                                                for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
                                                                                    const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = dx * dx + dy * dy;
                                                                                        if (d < 14000) { cx.strokeStyle = `rgba(60,150,255,${.16 * (1 - d / 14000)})`; cx.beginPath(); cx.moveTo(P[i].x, P[i].y); cx.lineTo(P[j].x, P[j].y); cx.stroke(); }
                                                                                          }
                                                                                            if (!reduce) raf = requestAnimationFrame(draw);
                                                                                            };
                                                                                            size(); draw();
                                                                                            addEventListener('resize', () => { size(); if (reduce) draw(); });
                                                                                            addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; }, { passive: true });
                                                                                            document.addEventListener('visibilitychange', () => document.hidden ? cancelAnimationFrame(raf) : !reduce && draw());

                                                                                            // Portraits: particles assemble into the image once (hero on load, About when scrolled into view); skipped with reduced motion
                                                                                            const assemble = (fig, onView) => {
                                                                                              const pic = fig && $('img', fig);
                                                                                                if (!pic || reduce) return;
                                                                                                  pic.style.opacity = 0;
                                                                                                    const show = () => { pic.style.transition = 'opacity .9s'; pic.style.opacity = 1; };
                                                                                                      const run = () => {
                                                                                                          if (pic.hidden || !pic.naturalWidth) return;
                                                                                                              const W = fig.clientWidth, H = fig.clientHeight, d = Math.min(devicePixelRatio || 1, 2);
                                                                                                                  const s = Math.min(W / pic.naturalWidth, H / pic.naturalHeight), w = pic.naturalWidth * s, h = pic.naturalHeight * s, offX = (W - w) / 2, offY = H - h;
                                                                                                                      const step = W < 480 ? 4 : 3, cols = w / step | 0, rows = h / step | 0;
                                                                                                                          const tmp = document.createElement('canvas'); tmp.width = cols; tmp.height = rows;
                                                                                                                              const tx = tmp.getContext('2d', { willReadFrequently: true }); tx.imageSmoothingQuality = 'high'; tx.drawImage(pic, 0, 0, cols, rows);
                                                                                                                                  let px; try { px = tx.getImageData(0, 0, cols, rows).data; } catch (e) { return show(); } // file:// taints the canvas, so skip the effect
                                                                                                                                      let P = [];
                                                                                                                                          for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
                                                                                                                                                const i = (y * cols + x) * 4, r = px[i], g = px[i + 1], b = px[i + 2];
                                                                                                                                                      if (Math.max(r, g, b) < 70) continue;
                                                                                                                                                            const hx = offX + (x + .5) * step, hy = offY + (y + .5) * step, a = Math.random() * 6.28, rad = 80 + Math.random() * 320;
                                                                                                                                                                  P.push({ hx, hy, sx: hx - rad * Math.abs(Math.cos(a)) - 40, sy: hy + rad * Math.sin(a), dl: ((1 - x / cols) * .5 + Math.random() * .5) * 600, k: (r >> 6) << 4 | (g >> 6) << 2 | b >> 6 });
                                                                                                                                                                      }
                                                                                                                                                                          const cap = W < 480 ? 3500 : 6500; if (P.length > cap) P = P.filter(() => Math.random() < cap / P.length);
                                                                                                                                                                              P.sort((p, q) => p.k - q.k); // grouped by colour: few fillStyle switches per frame
                                                                                                                                                                                  const pal = Array.from({ length: 64 }, (_, k) => { const r = (k >> 4) * 64 + 32, g = (k >> 2 & 3) * 64 + 32, b = (k & 3) * 64 + 32; return `rgb(${r * .4 | 0},${g * .5 + 70 | 0},${Math.min(255, b * .6 + 130) | 0})`; }); // blue-shifted to match the site
                                                                                                                                                                                      const cv = document.createElement('canvas'); cv.className = 'assemble'; cv.setAttribute('aria-hidden', 'true');
                                                                                                                                                                                          cv.width = W * d; cv.height = H * d; pic.after(cv);
                                                                                                                                                                                              const cx = cv.getContext('2d'); cx.setTransform(d, 0, 0, d, 0, 0);
                                                                                                                                                                                                  const T = 2000, t0 = performance.now(); let shown = false, gone = false;
                                                                                                                                                                                                      const f = now => {
                                                                                                                                                                                                            const t = now - t0; let last = -1; cx.clearRect(0, 0, W, H);
                                                                                                                                                                                                                  for (const p of P) {
                                                                                                                                                                                                                          const u = Math.min(Math.max((t - p.dl) / T, 0), 1), e = 1 - (1 - u) ** 3;
                                                                                                                                                                                                                                  if (p.k !== last) cx.fillStyle = pal[last = p.k];
                                                                                                                                                                                                                                          cx.fillRect(p.sx + (p.hx - p.sx) * e, p.sy + (p.hy - p.sy) * e, 2, 2);
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                      if (t > 1500 && !shown) { shown = true; show(); }
                                                                                                                                                                                                                                                            if (t > 2300 && !gone) { gone = true; cv.style.transition = 'opacity .7s'; cv.style.opacity = 0; }
                                                                                                                                                                                                                                                                  t < 3200 ? requestAnimationFrame(f) : cv.remove();
                                                                                                                                                                                                                                                                      };
                                                                                                                                                                                                                                                                          requestAnimationFrame(f);
                                                                                                                                                                                                                                                                            };
                                                                                                                                                                                                                                                                              const go = () => { setTimeout(show, 5000); pic.complete && pic.naturalWidth ? run() : pic.addEventListener('load', run, { once: true }); }; // timer = safety net
                                                                                                                                                                                                                                                                                if (!onView) return go();
                                                                                                                                                                                                                                                                                  new IntersectionObserver((es, o) => { if (es.some(e => e.isIntersecting)) { o.disconnect(); go(); } }, { threshold: .35 }).observe(fig);
                                                                                                                                                                                                                                                                                  };
                                                                                                                                                                                                                                                                                  assemble($('.hero-art'));
                                                                                                                                                                                                                                                                                  assemble($('.about .art'), true);
                                                                                                                                                                                                                                                                                  })();