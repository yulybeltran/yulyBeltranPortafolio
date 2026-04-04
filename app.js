// ── CURSOR ──────────────────────────────────────────────────
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function loop() {
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, .spill, .pcard').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '16px'; cur.style.height = '16px'; ring.style.width = '44px'; ring.style.height = '44px'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '8px'; cur.style.height = '8px'; ring.style.width = '32px'; ring.style.height = '32px'; });
});

// ── HAMBURGER MENU ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('drawer');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
});

function closeDrawer() {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

// cerrar con Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// ── PARTÍCULAS FLOTANTES ─────────────────────────────────────
(function () {
  const canvas = document.getElementById('nebula-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  const COLORS = [
    [180, 77, 255],
    [224,  0, 255],
    [255, 68, 204],
    [210, 140, 255],
  ];

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const N = Math.min(100, Math.floor(W * H / 12000));
    pts = Array.from({ length: N }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r:  Math.random() * 1.8 + .4,
      a:  Math.random() * .6 + .2,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // líneas de conexión
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180,77,255,${(1 - d / 110) * .14})`;
          ctx.lineWidth = .5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // puntos
    pts.forEach(p => {
      ctx.beginPath();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = `rgb(${p.col[0]},${p.col[1]},${p.col[2]})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
})();

// ── FADE IN AL HACER SCROLL ──────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.06 });
document.querySelectorAll('.fadein').forEach(el => io.observe(el));
