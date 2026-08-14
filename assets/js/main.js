/* =========================================================
   Quoph · Lógica del sitio
   Carrito, filtros de catálogo, agenda y navegación.
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const CLP = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', maximumFractionDigits: 0
  });
  const precio = n => CLP.format(n).replace(/\s/g, ' ');

  const waLink = (numero, texto) =>
    `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

  /* =========================================================
     1. Navegación
     ========================================================= */
  const header  = $('#siteHeader');
  const nav     = $('#siteNav');
  const menuBtn = $('#menuBtn');

  menuBtn.addEventListener('click', () => {
    const abierto = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(abierto));
  });

  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#year').textContent = new Date().getFullYear();

  /* Enlaces de WhatsApp declarativos */
  $$('[data-wa-store]').forEach(a => {
    a.href = waLink(CONFIG.waTienda, '¡Hola Quoph! Vengo desde la página web y quiero hacer una consulta.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-wa-tarot]').forEach(a => {
    a.href = waLink(CONFIG.waTarot, '¡Hola Simón! Vengo desde la página web y quiero consultar por una lectura de Tarot.');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* =========================================================
     2. Toast
     ========================================================= */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
  }

  /* =========================================================
     3. Catálogo
     ========================================================= */
  const grid       = $('#productGrid');
  const filtrosEl  = $('#filters');
  const buscador   = $('#searchInput');
  const emptyState = $('#emptyState');

  let filtroActivo = 'todos';
  let busqueda = '';

  function pintarFiltros() {
    const items = [{ id: 'todos', nombre: 'Todo' }, ...CATEGORIAS];
    filtrosEl.innerHTML = items.map(c =>
      `<button class="chip${c.id === filtroActivo ? ' is-active' : ''}" data-cat="${c.id}">${c.nombre}</button>`
    ).join('');
  }

  function media(p) {
    if (p.img) return `<img src="${p.img}" alt="${p.nombre}" loading="lazy">`;
    return `<svg class="glyph" viewBox="0 0 48 48" aria-hidden="true">${GLYPHS[p.cat] || ''}</svg>`;
  }

  function pintarProductos() {
    const q = busqueda.trim().toLowerCase();
    const lista = PRODUCTOS.filter(p => {
      const okCat = filtroActivo === 'todos' || p.cat === filtroActivo;
      const okTxt = !q || (p.nombre + ' ' + p.desc).toLowerCase().includes(q);
      return okCat && okTxt;
    });

    emptyState.hidden = lista.length > 0;

    grid.innerHTML = lista.map(p => {
      const cat = CATEGORIAS.find(c => c.id === p.cat);

      /* Productos sin precio: se consultan por WhatsApp, no van al carrito */
      const valor = p.precio
        ? `<span class="card-price">${precio(p.precio)}</span>`
        : `<span class="card-price card-price--consultar">Consultar</span>`;
      const accion = p.precio
        ? `<button class="add-btn" data-add="${p.id}">Agregar</button>`
        : `<a class="add-btn" target="_blank" rel="noopener"
              href="${waLink(CONFIG.waTienda, `¡Hola Quoph! Quiero consultar el valor de: ${p.nombre}.`)}">Consultar</a>`;

      return `
      <article class="card">
        <div class="card-media">
          ${media(p)}
          <span class="card-tag">${cat ? cat.nombre : ''}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.nombre}</h3>
          <p class="card-desc">${p.desc}</p>
          <div class="card-foot">
            ${valor}
            ${accion}
          </div>
        </div>
      </article>`;
    }).join('');
  }

  filtrosEl.addEventListener('click', e => {
    const chip = e.target.closest('[data-cat]');
    if (!chip) return;
    filtroActivo = chip.dataset.cat;
    pintarFiltros();
    pintarProductos();
  });

  buscador.addEventListener('input', e => {
    busqueda = e.target.value;
    pintarProductos();
  });

  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    agregar(btn.dataset.add);
    btn.textContent = 'Agregado ✓';
    btn.classList.add('is-added');
    setTimeout(() => { btn.textContent = 'Agregar'; btn.classList.remove('is-added'); }, 1400);
  });

  /* =========================================================
     4. Carrito
     ========================================================= */
  const STORAGE_KEY = 'quoph_carrito_v1';
  const drawer  = $('#cartDrawer');
  const overlay = $('#overlay');
  const cartBody = $('#cartBody');
  const cartTotal = $('#cartTotal');
  const cartBadge = $('#cartBadge');

  let carrito = cargarCarrito();

  function cargarCarrito() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      // Descarta productos que ya no existen en el catálogo
      return Array.isArray(data)
        ? data.filter(i => i.qty > 0 && PRODUCTOS.some(p => p.id === i.id && p.precio))
        : [];
    } catch { return []; }
  }

  function guardarCarrito() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); } catch {}
  }

  function agregar(id) {
    const prod = PRODUCTOS.find(x => x.id === id);
    if (!prod || !prod.precio) return;          // los "a consultar" no van al carrito
    const item = carrito.find(i => i.id === id);
    if (item) item.qty += 1;
    else carrito.push({ id, qty: 1 });
    guardarCarrito();
    pintarCarrito();
    toast(`${prod.nombre} · agregado al carrito`);
  }

  function cambiarQty(id, delta) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) carrito = carrito.filter(i => i.id !== id);
    guardarCarrito();
    pintarCarrito();
  }

  function quitar(id) {
    carrito = carrito.filter(i => i.id !== id);
    guardarCarrito();
    pintarCarrito();
  }

  const total = () => carrito.reduce((acc, i) => {
    const p = PRODUCTOS.find(x => x.id === i.id);
    return acc + (p ? p.precio * i.qty : 0);
  }, 0);

  function pintarCarrito() {
    const unidades = carrito.reduce((a, i) => a + i.qty, 0);
    cartBadge.textContent = unidades;
    cartBadge.hidden = unidades === 0;

    if (!carrito.length) {
      cartBody.innerHTML = `<p class="cart-empty">Tu carrito está vacío.<br>Explora el catálogo y arma tu pedido.</p>`;
    } else {
      cartBody.innerHTML = carrito.map(i => {
        const p = PRODUCTOS.find(x => x.id === i.id);
        const thumb = p.img
          ? `<img src="${p.img}" alt="">`
          : `<svg viewBox="0 0 48 48" aria-hidden="true">${GLYPHS[p.cat] || ''}</svg>`;
        return `
        <div class="cart-item">
          <div class="thumb">${thumb}</div>
          <div>
            <h5>${p.nombre}</h5>
            <span class="unit">${precio(p.precio)} c/u</span>
            <div class="qty">
              <button data-qty="-1" data-id="${p.id}" aria-label="Quitar una unidad de ${p.nombre}">−</button>
              <span>${i.qty}</span>
              <button data-qty="1" data-id="${p.id}" aria-label="Agregar una unidad de ${p.nombre}">+</button>
            </div>
          </div>
          <div>
            <div class="line-total">${precio(p.precio * i.qty)}</div>
            <button class="remove" data-remove="${p.id}">Quitar</button>
          </div>
        </div>`;
      }).join('');
    }
    cartTotal.textContent = precio(total());
  }

  cartBody.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    if (q) return cambiarQty(q.dataset.id, Number(q.dataset.qty));
    const r = e.target.closest('[data-remove]');
    if (r) return quitar(r.dataset.remove);
  });

  function abrirCarrito() {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#cartClose').focus();
  }

  function cerrarCarrito() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, 300);
  }

  $('#cartBtn').addEventListener('click', abrirCarrito);
  $('#cartClose').addEventListener('click', cerrarCarrito);
  overlay.addEventListener('click', cerrarCarrito);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) cerrarCarrito();
  });

  $('#checkoutBtn').addEventListener('click', () => {
    if (!carrito.length) { toast('Tu carrito está vacío'); return; }
    const lineas = carrito.map(i => {
      const p = PRODUCTOS.find(x => x.id === i.id);
      return `• ${i.qty} × ${p.nombre} — ${precio(p.precio * i.qty)}`;
    }).join('\n');

    const msg =
      `¡Hola Tienda Esotérica Quoph! Quiero hacer este pedido:\n\n` +
      `${lineas}\n\n` +
      `Total: ${precio(total())}\n\n` +
      `¿Me confirman stock y forma de entrega?`;

    window.open(waLink(CONFIG.waTienda, msg), '_blank', 'noopener');
  });

  /* =========================================================
     5. Servicios
     ========================================================= */
  function pintarServicios() {
    $('#tarotGrid').innerHTML = SERVICIOS_TAROT.map(s => `
      <article class="svc${s.destacado ? ' is-featured' : ''}">
        ${s.destacado ? `<span class="svc-flag">${s.destacado}</span>` : ''}
        <h4>${s.nombre}</h4>
        <div class="svc-price">${precio(s.precio)}</div>
        <div class="svc-meta">${s.duracion}</div>
        <p>${s.desc}</p>
        <ul>${s.incluye.map(x => `<li>${x}</li>`).join('')}</ul>
        <a class="btn ${s.destacado ? 'btn-gold' : 'btn-line'}" href="#agenda" data-servicio="${s.id}">Agendar</a>
      </article>`).join('');

    $('#otrosGrid').innerHTML = SERVICIOS_OTROS.map(s => `
      <article class="svc">
        <h4>${s.nombre}</h4>
        <div class="svc-meta">${s.precio ? precio(s.precio) : 'Valor a consultar'}</div>
        <p>${s.desc}</p>
        <a class="btn btn-line" href="#agenda" data-servicio="${s.id}">Consultar</a>
      </article>`).join('');
  }

  /* Al pulsar "Agendar" en una tarjeta, se preselecciona el servicio */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-servicio]');
    if (!a) return;
    const select = $('#f-servicio');
    if (select) select.value = a.dataset.servicio;
  });

  /* =========================================================
     6. Agenda
     ========================================================= */
  const form      = $('#bookingForm');
  const selServ   = $('#f-servicio');
  const selModal  = $('#f-modalidad');
  const selHora   = $('#f-hora');
  const inpFecha  = $('#f-fecha');
  const errorEl   = $('#formError');

  function pintarSelectServicios() {
    const tarot = SERVICIOS_TAROT.map(s =>
      `<option value="${s.id}">Tarot · ${s.nombre} — ${precio(s.precio)}</option>`).join('');
    const otros = SERVICIOS_OTROS.map(s =>
      `<option value="${s.id}">${s.nombre}${s.precio ? ' — ' + precio(s.precio) : ''}</option>`).join('');
    selServ.innerHTML =
      `<optgroup label="Lecturas de Tarot">${tarot}</optgroup>` +
      `<optgroup label="Otros servicios">${otros}</optgroup>`;
  }

  function nombreServicio(id) {
    const s = [...SERVICIOS_TAROT, ...SERVICIOS_OTROS].find(x => x.id === id);
    if (!s) return id;
    const grupo = SERVICIOS_TAROT.includes(s) ? 'Tarot · ' : '';
    return `${grupo}${s.nombre}${s.precio ? ' (' + precio(s.precio) + ')' : ''}`;
  }

  function reglas() {
    return selModal.value === 'Presencial'
      ? CONFIG.horarios.presencial
      : CONFIG.horarios.online;
  }

  function pintarHoras() {
    const { desde, hasta } = reglas();
    let html = '';
    for (let h = desde; h < hasta; h++) {
      const et = String(h).padStart(2, '0');
      html += `<option value="${et}:00">${et}:00 hrs</option>`;
      html += `<option value="${et}:30">${et}:30 hrs</option>`;
    }
    selHora.innerHTML = html;
  }

  /* Fecha mínima: hoy (en hora local) */
  function hoyISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  inpFecha.min = hoyISO();
  inpFecha.value = hoyISO();

  selModal.addEventListener('change', pintarHoras);

  const aFecha = str => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  function diaValido(fechaStr) {
    return reglas().dias.includes(aFecha(fechaStr).getDay());
  }

  /* "jueves 13 de agosto de 2026" */
  function fechaLegible(fechaStr) {
    return aFecha(fechaStr).toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    errorEl.hidden = true;

    const datos = Object.fromEntries(new FormData(form).entries());

    if (!datos.nombre.trim() || !datos.contacto.trim()) {
      errorEl.textContent = 'Por favor completa tu nombre y un medio de contacto.';
      errorEl.hidden = false;
      return;
    }
    if (!datos.fecha) {
      errorEl.textContent = 'Selecciona una fecha para tu sesión.';
      errorEl.hidden = false;
      return;
    }
    if (!diaValido(datos.fecha)) {
      errorEl.textContent = datos.modalidad === 'Presencial'
        ? 'La atención presencial es de lunes a viernes. Elige otro día o cambia a modalidad online.'
        : 'Ese día no está disponible. Por favor elige otra fecha.';
      errorEl.hidden = false;
      return;
    }

    const horario = datos.modalidad === 'Presencial'
      ? 'lunes a viernes, 11:00 a 19:00 hrs'
      : 'lunes a domingo, 11:00 a 23:00 hrs';

    const msg =
      `¡Hola Simón! Quiero agendar una sesión.\n\n` +
      `• Nombre: ${datos.nombre}\n` +
      `• Contacto: ${datos.contacto}\n` +
      `• Servicio: ${nombreServicio(datos.servicio)}\n` +
      `• Modalidad: ${datos.modalidad}\n` +
      `• Fecha: ${fechaLegible(datos.fecha)}\n` +
      `• Hora preferida: ${datos.hora}\n` +
      (datos.mensaje.trim() ? `• Consulta: ${datos.mensaje.trim()}\n` : '') +
      `\n(Horario de atención ${datos.modalidad.toLowerCase()}: ${horario})`;

    window.open(waLink(CONFIG.waTarot, msg), '_blank', 'noopener');
    toast('Abriendo WhatsApp con tu solicitud…');
  });

  /* =========================================================
     7. Animación de entrada
     ========================================================= */
  function observarReveal() {
    const objetivos = $$('.section-head, .card, .svc, .booking-form, .history-quote, .lineage-card, .about-photo, .about-copy, .gallery-item, .flyers figure');
    objetivos.forEach(el => el.classList.add('reveal'));

    /* Barrido ligado al scroll en vez de IntersectionObserver: se revela todo
       lo que esté en pantalla o por encima. Así, si alguien entra con un enlace
       directo (#historia, #local…), las secciones de más arriba nunca quedan en
       blanco — el observador no avisaba de esos casos. */
    let pendientes = objetivos.slice();
    let enCola = false;

    function barrer() {
      enCola = false;
      const limite = window.innerHeight - 60;
      pendientes = pendientes.filter(el => {
        if (el.getBoundingClientRect().top < limite) {
          el.classList.add('is-in');
          return false;
        }
        return true;
      });
      if (!pendientes.length) {
        window.removeEventListener('scroll', pedir);
        window.removeEventListener('resize', pedir);
      }
    }

    function pedir() {
      if (enCola) return;
      enCola = true;
      setTimeout(barrer, 80);
    }

    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    window.addEventListener('load', barrer);
    barrer();
  }

  /* =========================================================
     Init
     ========================================================= */
  pintarFiltros();
  pintarProductos();
  pintarServicios();
  pintarSelectServicios();
  pintarHoras();
  pintarCarrito();
  observarReveal();
})();
