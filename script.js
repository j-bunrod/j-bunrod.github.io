/* =========================================================
   j-bunrod · personal universe — script.js
   ทุกฟังก์ชันต้องไม่พังถ้า element ไม่มีอยู่
   ========================================================= */
(function () {
  'use strict';

  var FB_URL   = 'https://www.facebook.com/j.bunrod';
  var FB_SHORT = 'facebook.com/j.bunrod';

  /* ---------- ปีในฟุตเตอร์ ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- เมนูมือถือ ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    });

    navMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- สปอตไลท์ตามเมาส์/นิ้ว ---------- */
  var spotlight = document.getElementById('spotlight');
  if (spotlight && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      spotlight.style.setProperty('--mx', e.clientX + 'px');
      spotlight.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }

  /* ---------- พิมพ์คำแนะนำทีละตัว ---------- */
  var taglineEl = document.getElementById('tagline');
  if (taglineEl) {
    var lines = [
      'สร้าง · เรียนรู้ · แบ่งปัน',
      'คนที่ชอบทำเว็บบนมือถือ',
      'ทุกอย่างเริ่มจากศูนย์'
    ];
    var li = 0, ci = 0, deleting = false;

    var cursor = document.createElement('span');
    cursor.className = 'typed';

    var caret = document.createElement('span');
    caret.className = 'caret';

    taglineEl.appendChild(cursor);
    taglineEl.appendChild(caret);

    function typeLoop() {
      var line = lines[li];
      var full = line + ' ';

      if (!deleting) {
        cursor.textContent = line.slice(0, ci);
        ci++;
        if (ci > line.length) {
          deleting = true;
          setTimeout(typeLoop, 1700);
          return;
        }
        setTimeout(typeLoop, 62);
      } else {
        cursor.textContent = line.slice(0, ci);
        ci--;
        if (ci < 0) {
          ci = 0;
          deleting = false;
          li = (li + 1) % lines.length;
          setTimeout(typeLoop, 320);
          return;
        }
        setTimeout(typeLoop, 32);
      }
    }
    setTimeout(typeLoop, 500);
  }

  /* ---------- เผยเนื้อหาเมื่อเลื่อนถึง ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 3) * 90 + 'ms';
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ---------- นับตัวเลข ---------- */
  var counters = document.querySelectorAll('.stat-num');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el  = entry.target;
        var end = parseInt(el.getAttribute('data-count'), 10) || 0;
        var cur = 0;
        var step = Math.max(1, Math.round(end / 34));

        var timer = setInterval(function () {
          cur += step;
          if (cur >= end) { cur = end; clearInterval(timer); }
          el.textContent = String(cur);
        }, 28);

        cio.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- คัดลอกลิงก์ Facebook ---------- */
  var copyBtn  = document.getElementById('copyBtn');
  var copyText = document.getElementById('copyText');

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.textContent = 'คัดลอกแล้ว ✓';
        copyBtn.classList.add('done');
        setTimeout(function () {
          copyBtn.textContent = 'คัดลอก';
          copyBtn.classList.remove('done');
        }, 1900);
      };
      var fail = function () {
        copyBtn.textContent = 'คัดลอกไม่สำเร็จ';
        setTimeout(function () { copyBtn.textContent = 'คัดลอก'; }, 1900);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(FB_URL).then(done).catch(fallback);
      } else {
        fallback();
      }

      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = FB_URL;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.top = '-1000px';
          document.body.appendChild(ta);
          ta.select();
          ta.setSelectionRange(0, ta.value.length);
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          ok ? done() : fail();
        } catch (err) {
          fail();
        }
      }
    });
  }

  /* ---------- ปุ่ม copy สลับข้อความสั้น/เต็ม ---------- */
  if (copyText) {
    copyText.title = FB_SHORT;
  }

  /* ---------- เอฟเฟกต์พาร์ติเคิลเบาๆ ตอนเลื่อน ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < 600) {
        hero.style.transform = 'translateY(' + (y * 0.16) + 'px)';
        hero.style.opacity = String(Math.max(0, 1 - y / 520));
      }
    }, { passive: true });
  }

})();
