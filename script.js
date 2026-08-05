/* Latrice Latrice — catalog, product view, cart */
(function () {
  'use strict';

  var TEE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  var SET_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  var PRODUCTS = [
    {
      id: 'roots-united',
      collection: 'Heritage',
      name: 'Roots — United Heritage',
      meta: 'Unisex tee · White',
      price: 38,
      img: '/products/p01.png',
      sizes: TEE_SIZES,
      desc: 'The continent rendered in adinkra, indigo and clay. Drum, fist and cotton boll, printed edge to edge on midweight combed cotton.'
    },
    {
      id: 'roots-renaissance',
      collection: 'Heritage',
      name: 'Roots & Renaissance',
      meta: 'Unisex tee · White',
      price: 38,
      img: '/products/p02.png',
      sizes: TEE_SIZES,
      desc: 'Nigeria × African American, drawn in indigo mudcloth and brass. Saxophone, guitar and djembe — the instruments the story travelled on.'
    },
    {
      id: 'infinite',
      collection: 'Heritage',
      name: 'Infinite',
      meta: 'Unisex tee · Black',
      price: 38,
      img: '/products/p03.png',
      sizes: TEE_SIZES,
      desc: 'Two profiles bound in one unbroken line. A quieter piece from the Heritage line, printed in warm bronze on heavyweight black.'
    },
    {
      id: 'll-hooded-set',
      collection: 'Essentials',
      name: 'L&L Hooded Set',
      meta: 'Hoodie + jogger · Rose',
      price: 120,
      img: '/products/p05.png',
      sizes: SET_SIZES,
      desc: 'Brushed-back fleece in dusty rose with a contrast side stripe. Monogram at the chest and thigh. Sold as a set.'
    },
    {
      id: 'll-cargo-jogger',
      collection: 'Essentials',
      name: 'L&L Cargo Jogger',
      meta: 'Jogger · Bone',
      price: 64,
      img: '/products/p07.png',
      sizes: SET_SIZES,
      desc: 'Relaxed cargo jogger in bone fleece. Drawcord waist, ribbed cuff, script monogram on the pocket flap.'
    },
    {
      id: 'll-cap',
      collection: 'Essentials',
      name: 'LL Pinstripe Cap',
      meta: 'Adjustable · Black',
      price: 34,
      img: '/products/p10.png',
      sizes: ['One Size'],
      desc: 'Six-panel cap in black pinstripe twill. Chenille LL at the front, script embroidery at the side, adjustable strap.'
    }
  ];

  var FREE_SHIP_AT = 100;
  var SHIP_FLAT = 8;

  var cart = [];
  var current = null;
  var qty = 1;
  var size = null;
  var lastFocus = null;

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return '$' + n.toFixed(2).replace(/\.00$/, ''); };

  /* ---------- storage ---------- */
  function load() {
    try {
      var raw = localStorage.getItem('ll_cart');
      if (raw) cart = JSON.parse(raw) || [];
    } catch (e) { cart = []; }
  }
  function save() {
    try { localStorage.setItem('ll_cart', JSON.stringify(cart)); } catch (e) {}
  }

  /* ---------- catalog ---------- */
  function card(p) {
    var el = document.createElement('button');
    el.className = 'card';
    el.type = 'button';
    el.setAttribute('aria-label', 'View ' + p.name);
    el.innerHTML =
      '<span class="card__img"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></span>' +
      '<span class="card__body">' +
        '<span class="card__title">' + p.name + '</span>' +
        '<span class="card__meta">' + p.meta + '</span>' +
        '<span class="card__price">' + money(p.price) + '</span>' +
      '</span>' +
      '<span class="card__hint">View</span>';
    el.addEventListener('click', function () { openProduct(p, el); });
    return el;
  }

  function renderCatalog() {
    var h = $('gridHeritage'), e = $('gridEssentials');
    PRODUCTS.forEach(function (p) {
      (p.collection === 'Heritage' ? h : e).appendChild(card(p));
    });
  }

  /* ---------- product view ---------- */
  function openProduct(p, origin) {
    current = p;
    qty = 1;
    size = p.sizes.length === 1 ? p.sizes[0] : null;
    lastFocus = origin || null;

    $('modalImg').src = p.img;
    $('modalImg').alt = p.name;
    $('modalCollection').textContent = p.collection;
    $('modalTitle').textContent = p.name;
    $('modalPrice').textContent = money(p.price);
    $('modalDesc').textContent = p.desc;
    $('qtyVal').textContent = '1';

    var wrap = $('modalSizes');
    wrap.innerHTML = '';
    p.sizes.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'size' + (size === s ? ' is-on' : '');
      b.textContent = s;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', size === s ? 'true' : 'false');
      b.addEventListener('click', function () {
        size = s;
        [].forEach.call(wrap.children, function (c) {
          var on = c === b;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        $('addToCart').textContent = 'Add to Cart';
      });
      wrap.appendChild(b);
    });

    $('addToCart').textContent = 'Add to Cart';
    $('modal').hidden = false;
    document.body.classList.add('is-locked');
    setTimeout(function () { $('addToCart').focus(); }, 40);
  }

  function closeProduct() {
    $('modal').hidden = true;
    if (!$('cart').hidden) return;
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- cart ---------- */
  function addCurrent() {
    if (!current) return;
    if (!size) {
      $('addToCart').textContent = 'Select a size first';
      $('modalSizes').classList.add('shake');
      setTimeout(function () { $('modalSizes').classList.remove('shake'); }, 450);
      return;
    }
    var key = current.id + '|' + size;
    var found = null;
    cart.forEach(function (i) { if (i.key === key) found = i; });

    if (found) {
      found.qty += qty;
    } else {
      cart.push({
        key: key, id: current.id, name: current.name, img: current.img,
        price: current.price, size: size, qty: qty
      });
    }
    save();
    paintCart();
    closeProduct();
    toast(current.name + ' added to cart');
    openCart();
  }

  function paintCart() {
    var count = cart.reduce(function (n, i) { return n + i.qty; }, 0);
    var badge = $('cartCount');
    badge.textContent = count;
    badge.hidden = count === 0;

    var box = $('cartItems');
    box.innerHTML = '';

    cart.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'citem';
      row.innerHTML =
        '<div class="citem__img"><img src="' + item.img + '" alt="' + item.name + '"></div>' +
        '<div class="citem__info">' +
          '<p class="citem__name">' + item.name + '</p>' +
          '<p class="citem__meta">Size ' + item.size + '</p>' +
          '<div class="citem__ctrl">' +
            '<button class="qty__btn" data-dec aria-label="Decrease quantity">&minus;</button>' +
            '<span class="qty__val">' + item.qty + '</span>' +
            '<button class="qty__btn" data-inc aria-label="Increase quantity">+</button>' +
            '<button class="citem__rm" data-rm>Remove</button>' +
          '</div>' +
        '</div>' +
        '<p class="citem__price">' + money(item.price * item.qty) + '</p>';

      row.querySelector('[data-dec]').addEventListener('click', function () {
        item.qty -= 1;
        if (item.qty < 1) cart = cart.filter(function (i) { return i.key !== item.key; });
        save(); paintCart();
      });
      row.querySelector('[data-inc]').addEventListener('click', function () {
        item.qty += 1; save(); paintCart();
      });
      row.querySelector('[data-rm]').addEventListener('click', function () {
        cart = cart.filter(function (i) { return i.key !== item.key; });
        save(); paintCart();
      });

      box.appendChild(row);
    });

    var sub = cart.reduce(function (n, i) { return n + i.price * i.qty; }, 0);
    var ship = sub === 0 ? 0 : (sub >= FREE_SHIP_AT ? 0 : SHIP_FLAT);

    $('cartSubtotal').textContent = money(sub);
    $('cartShip').textContent = sub === 0 ? '—' : (ship === 0 ? 'Free' : money(ship));
    $('cartTotal').textContent = money(sub + ship);

    var empty = cart.length === 0;
    $('cartEmpty').hidden = !empty;
    $('cartFoot').hidden = empty;
    if (!empty) $('cartDone').hidden = true;
  }

  function openCart() {
    $('cart').hidden = false;
    $('cartDone').hidden = true;
    if (cart.length) $('cartFoot').hidden = false;
    document.body.classList.add('is-locked');
  }
  function closeCart() {
    $('cart').hidden = true;
    if (!$('modal').hidden) return;
    document.body.classList.remove('is-locked');
  }

  function checkout() {
    if (!cart.length) return;
    cart = [];
    save();
    paintCart();
    $('cartFoot').hidden = true;
    $('cartEmpty').hidden = true;
    $('cartDone').hidden = false;
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }

  /* ---------- signup ---------- */
  function initSignup() {
    var form = $('notifyForm'), status = $('notifyStatus');
    if (!form || !status) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('email');
      var value = (input.value || '').trim();
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        status.dataset.ok = '0';
        status.textContent = 'That email doesn’t look right — try again.';
        input.focus();
        return;
      }
      try {
        var list = JSON.parse(localStorage.getItem('ll_list') || '[]');
        if (list.indexOf(value) === -1) list.push(value);
        localStorage.setItem('ll_list', JSON.stringify(list));
      } catch (err) {}
      status.dataset.ok = '1';
      status.textContent = 'You’re on the list. See you at the drop.';
      form.reset();
    });
  }

  /* ---------- wire up ---------- */
  function init() {
    load();
    renderCatalog();
    paintCart();
    initSignup();

    $('qtyMinus').addEventListener('click', function () {
      if (qty > 1) { qty -= 1; $('qtyVal').textContent = qty; }
    });
    $('qtyPlus').addEventListener('click', function () {
      if (qty < 10) { qty += 1; $('qtyVal').textContent = qty; }
    });
    $('addToCart').addEventListener('click', addCurrent);
    $('cartOpen').addEventListener('click', openCart);
    $('checkout').addEventListener('click', checkout);

    [].forEach.call(document.querySelectorAll('[data-close]'), function (el) {
      el.addEventListener('click', closeProduct);
    });
    [].forEach.call(document.querySelectorAll('[data-cart-close]'), function (el) {
      el.addEventListener('click', closeCart);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('modal').hidden) closeProduct();
      else if (!$('cart').hidden) closeCart();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
