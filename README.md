# bayumas-app

Halaman pembungkus untuk web app **Pukis Bayumas**, supaya alamat yang
dibuka lewat HP berupa `bayumas.github.io` dan bukan URL Apps Script yang
panjang dan sulit diingat.

**Repo ini sengaja publik** karena GitHub Pages pada paket Free hanya
berjalan untuk repo publik. Isinya hanya halaman pembungkus — tidak ada
logika bisnis, tidak ada data, tidak ada kredensial.

Kode sistemnya ada di repo privat terpisah: `Bayumas/pukis-bayumas`.

## Alamat

| Halaman | Alamat | Pengaman |
|---|---|---|
| Menu | `https://bayumas.github.io/app/` | — |
| Kasir | `https://bayumas.github.io/app/kasir/` | PIN cabang, bila sudah diatur |
| Dashboard Owner | `https://bayumas.github.io/app/owner/` | PIN owner |
| Kelola Data | `https://bayumas.github.io/app/admin/` | PIN owner |

Hanya tiga halaman. Laporan toko titip ada sebagai tab di Dashboard
Owner, dan pengeluaran ada di Kelola Data - bukan halaman terpisah,
supaya tidak ada dua pintu menuju hal yang sama.

## Catatan keamanan halaman kasir

Halaman kasir bisa **menulis** data penjualan, barang masuk, dan waste ke
spreadsheet. Selama PIN cabang belum diatur, siapa pun yang menemukan
alamat ini bisa memasukkan data palsu — dan alamat yang rapi jauh lebih
mudah ditemukan daripada URL Apps Script yang panjang dan acak.

PIN cabang diatur owner lewat halaman Kelola Data, tab **Cabang**. Berlaku
per cabang: begitu satu cabang diberi PIN, cabang itu langsung terlindungi
tanpa perlu deploy ulang. Cabang yang belum diatur ditandai merah di sana.

## Cara kerjanya

Tiap halaman memuat web app Apps Script di dalam sebuah `iframe` satu layar
penuh, sehingga alamat yang terlihat di address bar tetap alamat GitHub.
Ini bekerja karena `doGet` di sisi Apps Script memakai
`setXFrameOptionsMode(ALLOWALL)`.

## Kalau URL deployment berubah

`clasp update-deployment` mempertahankan URL, jadi biasanya tidak perlu
diubah. Tapi kalau suatu saat dibuat deployment baru dengan URL berbeda,
ganti `src` pada `owner/index.html` dan `admin/index.html`.

## Catatan

- Di iPhone dengan "Prevent Cross-Site Tracking" aktif, penyimpanan sesi di
  dalam iframe kadang diblokir Safari. Efeknya: PIN diminta lagi setiap kali
  halaman di-refresh. Tidak merusak apa pun.
- `robots: noindex` dipasang supaya halaman ini tidak muncul di hasil
  pencarian Google.
