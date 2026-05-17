/* =========================================
   パーソルテンプスタッフ 新卒A案
   Scroll-driven hero animation

   タイムライン（progress 0→1 / 総距離 300vh-100vh=200vh）
   ├ 0.00 〜 0.20 : FV → 第2画像クロスフェード
   ├ 0.14 〜 0.40 : 右サイドオーバーレイ フェードイン
   ├ 0.20 〜 0.65 : ボディコピーが右から流れ込む
   └ 0.65 〜 1.00 : 静止
========================================= */
(function () {
  'use strict';

  /* --- 要素 --- */
  const header    = document.getElementById('header');
  const scene     = document.getElementById('scrollHero');
  const bg1       = document.querySelector('.scene-bg--1');
  const bg2       = document.querySelector('.scene-bg--2');
  const scrollInd = document.getElementById('scrollInd');

  /* --- ボディコピー --- */
  const copyLines  = Array.from(document.querySelectorAll('.hero-copy__line'));
  const COPY_START = 0.20;
  const COPY_END   = 0.60;

  /* --- ユーティリティ --- */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
  function prog(p, s, e) { return easeInOut(clamp((p - s) / (e - s), 0, 1)); }

  /* --- メインアップデート --- */
  function update() {
    const sy = window.scrollY;

    /* ヘッダー: スクロール開始で表示、FVアウト後に白背景へ */
    header.classList.toggle('visible', sy > 80);
    header.classList.toggle('scrolled', sy > window.innerHeight * 0.75);

    /* SCROLL インジケーター: 少し下にスクロールしたら隠す */
    if (scrollInd) scrollInd.classList.toggle('hidden', sy > 60);

    if (!scene) return;

    const rect    = scene.getBoundingClientRect();
    const scrolled = -rect.top;                         // section内スクロール量(px)
    const total    = scene.offsetHeight - window.innerHeight; // アニメーション総距離
    const p        = clamp(scrolled / total, 0, 1);

    /* ── Layer2 下からフェードイン: 0.00 → 0.20 ── */
    const fade = prog(p, 0, 0.20);
    if (bg1) bg1.style.opacity = String(1 - fade);
    if (bg2) {
      bg2.style.opacity = String(fade);
      bg2.style.transform = `translateY(${(1 - fade) * 60}px)`;
    }

    /* ── ボディコピー 上から順次フェードイン: 0.20 → 0.60 (双方向) ── */
    const lineCount = copyLines.length - 1 || 1;
    copyLines.forEach((el, i) => {
      const threshold = COPY_START + (i / lineCount) * (COPY_END - COPY_START);
      if (p >= threshold) {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      } else {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(-8px)';
      }
    });

  }

  window.addEventListener('scroll', update, { passive: true });
  update(); /* 初期状態セット */

  /* =========================================
     Section reveal (IntersectionObserver)
  ========================================= */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

}());
