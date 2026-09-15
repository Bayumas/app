// Service worker pembungkus Pukis Bayumas.
//
// Yang disimpan di HP HANYA halaman pembungkus dan ikon - supaya app
// yang dipasang di layar utama langsung menampilkan layar pembuka
// walau sinyal jelek. Aplikasinya sendiri (kasir, dashboard, kelola
// data) tetap dimuat dari Google setiap kali dibuka: permintaan ke
// alamat lain tidak disentuh sama sekali.
var VERSI = 'bayumas-pembungkus-v1';
var INTI = [
  './', './kasir/', './owner/', './admin/',
  './ikon/kasir-192.png', './ikon/owner-192.png', './ikon/admin-192.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(INTI); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (daftar) {
    return Promise.all(daftar.filter(function (k) { return k !== VERSI; })
                             .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Halaman: ambil yang terbaru dulu, simpanan hanya kalau tidak ada sinyal.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var salin = res.clone();
      caches.open(VERSI).then(function (c) { c.put(req, salin); });
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || Response.error(); });
    }));
    return;
  }

  // Ikon & manifest: jarang berubah, pakai simpanan lalu segarkan.
  e.respondWith(caches.match(req).then(function (ada) {
    var baru = fetch(req).then(function (res) {
      if (res && res.ok) { var salin = res.clone(); caches.open(VERSI).then(function (c) { c.put(req, salin); }); }
      return res;
    }).catch(function () { return ada || Response.error(); });
    return ada || baru;
  }));
});
