import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, CheckCircle2, X, Plus, Trash2, Presentation, Tag } from 'lucide-react';

// Data katalog dari JSON yang Anda berikan
const catalogData = [
  {
    kategori: "Human Capital & SDM Profesional",
    target_pasar: "HR Specialist, HR Manager, Business Owner",
    produk: [
      { id: "HC-001", nama_produk: "PPT Masterpiece Talent Acquisition & Onboarding Kit", deskripsi: "Template PPT strategi rekrutmen modern, employer branding, panduan wawancara BEI/STAR, dan checklist onboarding karyawan baru.", harga_normal: 150000, harga_sale: 75000, fitur: ["Editable Chart", "30+ Slides", "Bonus Form Wawancara PDF"] },
      { id: "HC-002", nama_produk: "PPT Implementasi KPI & OKR Framework", deskripsi: "Panduan visual menyusun Key Performance Indicators dan Objectives & Key Results dari level perusahaan hingga individu.", harga_normal: 180000, harga_sale: 89000, fitur: ["100% Vector Icon", "45+ Slides", "Template Excel KPI Tracker"] },
      { id: "HC-003", nama_produk: "PPT Penyusunan Struktur & Skala Upah (3P Concept)", deskripsi: "Materi kompensasi dan benefit berdasarkan Pay for Position, Person, dan Performance beserta metode Job Evaluation.", harga_normal: 250000, harga_sale: 125000, fitur: ["Premium Infographics", "35+ Slides", "Rumus Skala Upah"] },
      { id: "HC-004", nama_produk: "PPT Hubungan Industrial & UU Ketenagakerjaan", deskripsi: "Ringkasan regulasi ketenagakerjaan, aturan PKWT/PKWTT, tata cara PHK, dan perhitungan pesangon terbaru.", harga_normal: 150000, harga_sale: 69000, fitur: ["Clean Design", "40+ Slides", "Update Regulasi Terbaru"] }
    ]
  },
  {
    kategori: "Aparatur Sipil Negara (ASN) & Birokrasi",
    target_pasar: "Pegawai Negeri Sipil (PNS), PPPK, Pegawai Instansi Pemerintah",
    produk: [
      { id: "ASN-LH-001", nama_produk: "PPT Sosialisasi AMDAL & Tata Kelola Lingkungan Hidup", deskripsi: "Template presentasi untuk kedinasan mengenai Analisis Mengenai Dampak Lingkungan, pelestarian alam, dan regulasi hijau.", harga_normal: 140000, harga_sale: 65000, fitur: ["Tema Warna Alam/Hijau", "35+ Slides", "Peta Konsep Regulasi"] },
      { id: "ASN-SDM-002", nama_produk: "PPT Sistem Merit & Manajemen Kinerja PNS (PermenPANRB)", deskripsi: "Materi edukasi internal instansi mengenai penilaian kinerja ASN, sasaran kinerja pegawai (SKP), dan pengembangan kompetensi birokrasi.", harga_normal: 160000, harga_sale: 79000, fitur: ["Standar Format Kedinasan", "40+ Slides", "Diagram Alur Merit"] },
      { id: "ASN-UM-003", nama_produk: "PPT Pelayanan Publik Prima (Excellent Service) Instansi", deskripsi: "Panduan pelatihan internal untuk meningkatkan kualitas pelayanan masyarakat di loket atau instansi pemerintah.", harga_normal: 120000, harga_sale: 55000, fitur: ["Visual Animasi Menarik", "30+ Slides", "Studi Kasus Pelayanan"] }
    ]
  },
  {
    kategori: "Akademik (Pelajar & Mahasiswa)",
    target_pasar: "Siswa SMA/SMK, Mahasiswa D3/S1/S2",
    produk: [
      { id: "MHS-001", nama_produk: "PPT Template Sidang Skripsi & Tesis Minimalis", deskripsi: "Template PPT siap pakai untuk presentasi sidang akhir. Struktur lengkap dari Bab 1 Pendahuluan hingga Bab 5 Penutup.", harga_normal: 70000, harga_sale: 35000, fitur: ["Struktur Akademik Standar", "20+ Slides", "Ratio 16:9 Widescreen"] },
      { id: "MHS-002", nama_produk: "PPT Infografis Metodologi Penelitian & Statistik", deskripsi: "Template visual untuk menjelaskan metode penelitian kualitatif, kuantitatif, uji hipotesis, dan pengolahan data.", harga_normal: 80000, harga_sale: 39000, fitur: ["Mudah Edit Grafik", "25+ Slides", "Dark & Light Mode"] },
      { id: "MHS-003", nama_produk: "PPT Tugas Kelompok & Presentation Pitch Deck", deskripsi: "Desain PPT estetik dan modern untuk tugas kuliah harian, analisis kasus, atau kompetisi bisnis mahasiswa.", harga_normal: 60000, harga_sale: 29000, fitur: ["Pop-Culture/Aesthetic Style", "25+ Slides", "Drag & Drop Image"] }
    ]
  },
  {
    kategori: "Umum & Profesional Lainnya",
    target_pasar: "Freelancer, Pembuat Konten, Trainer, Umum",
    produk: [
      { id: "GEN-001", nama_produk: "PPT Public Speaking & Teknik Presentasi Memukau", deskripsi: "Materi edukasi umum cara mengatasi gugup, teknik vokal, dan bahasa tubuh saat berbicara di depan audiens.", harga_normal: 100000, harga_sale: 49000, fitur: ["Kaya Visual & Ilustrasi", "30+ Slides", "Tips Praktis Lembar Catatan"] },
      { id: "GEN-002", nama_produk: "PPT Manajemen Keuangan Pribadi & Investasi Pemula", deskripsi: "Template edukasi mengatur gaji bulanan, budgeting 50/30/20, serta pengenalan reksa dana dan saham untuk awam.", harga_normal: 110000, harga_sale: 49000, fitur: ["Editable Financial Chart", "32+ Slides", "Kalkulator Budgeting Sederhana"] }
    ]
  }
];

// Gabungkan semua produk ke dalam satu array untuk memudahkan pemrosesan rendering dan filter
const allProducts = catalogData.reduce((acc, curr) => {
  const productsWithCategory = curr.produk.map(p => ({
    ...p,
    kategori_induk: curr.kategori
  }));
  return [...acc, ...productsWithCategory];
}, []);

// Ekstrak nama kategori yang unik untuk filter tab
const categories = ["Semua Kategori", ...catalogData.map(c => c.kategori)];

// Fungsi pembantu pemformatan mata uang ke format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Efek untuk menyembunyikan toast/notifikasi secara otomatis setelah 3 detik
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Memfilter data produk berdasarkan tab kategori yang aktif & kata kunci pada pencarian
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchCategory = activeCategory === "Semua Kategori" || product.kategori_induk === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = product.nama_produk.toLowerCase().includes(searchLower) || 
                          product.deskripsi.toLowerCase().includes(searchLower);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Menangani penambahan produk ke keranjang belanja
  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(`Berhasil menambahkan "${product.nama_produk}"`);
  };

  // Menangani penghapusan item dari keranjang
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Kalkulasi total keranjang dan item
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.harga_sale * item.quantity), 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* Toast Notifikasi Kustom */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Navbar dan Area Pencarian */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer group" 
              onClick={() => { setActiveCategory('Semua Kategori'); setSearchQuery(''); }}
            >
              <div className="bg-blue-600 p-2.5 rounded-xl group-hover:bg-blue-700 transition-colors">
                <Presentation className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-blue-950">
                PPT<span className="text-blue-600">Store</span>
              </span>
            </div>

            {/* Kotak Pencarian Utama (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm shadow-inner"
                placeholder="Cari kebutuhan template presentasi Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tombol Keranjang */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-full transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="hidden sm:inline font-semibold">Keranjang</span>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 sm:-right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-500 rounded-full border-2 border-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Kotak Pencarian Mobile (Tampil di layar kecil) */}
          <div className="md:hidden pb-4">
             <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="Cari presentasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Banner Utama */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 relative z-10 leading-tight">
            Level-Up Presentasi Anda!
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg relative z-10">
            Dapatkan puluhan template premium terstruktur untuk audiens korporat, pemerintah, maupun akademik.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-3 scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-blue-200 shadow-md ring-2 ring-blue-600 ring-offset-2' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {}
        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                
                {/* Visual Placeholder Atas */}
                <div className="h-44 bg-slate-900 p-5 flex flex-col justify-between relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black">
                  <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                    <Tag size={12} />
                    <span>Hemat {Math.round(((product.harga_normal - product.harga_sale) / product.harga_normal) * 100)}%</span>
                  </div>
                  <Presentation className="h-10 w-10 text-white/20" />
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest bg-black/30 w-fit px-2 py-1 rounded">
                    {product.id}
                  </span>
                </div>
                
                {/* Konten Kartu */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-blue-600 mb-2 truncate bg-blue-50 w-fit px-2 py-1 rounded">
                    {product.kategori_induk}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">
                    {product.nama_produk}
                  </h3>
                  <p className="text-sm text-slate-500 mb-5 line-clamp-3 flex-1 leading-relaxed">
                    {product.deskripsi}
                  </p>
                  
                  {/* List Fitur */}
                  <ul className="space-y-2 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {product.fitur.map((fitur, idx) => (
                      <li key={idx} className="flex items-start text-xs font-medium text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                        <span>{fitur}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Harga & Tombol Aksi */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 line-through font-medium">
                        {formatRupiah(product.harga_normal)}
                      </span>
                      <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {formatRupiah(product.harga_sale)}
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 text-white hover:bg-blue-700 p-3 rounded-xl transition-colors shadow-md shadow-blue-200 group flex items-center justify-center"
                      title="Tambah ke Keranjang"
                    >
                      <Plus className="h-5 w-5 group-hover:scale-125 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Search className="h-16 w-16 mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Template Tidak Ditemukan</h3>
              <p className="text-slate-500 max-w-md mx-auto">Kami tidak dapat menemukan produk yang sesuai dengan pencarian Anda. Coba gunakan kata kunci lain.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('Semua Kategori')}}
                className="mt-6 bg-slate-100 text-slate-700 font-semibold px-6 py-2.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </main>

      {}
      {/* Overlay & Sidebar Keranjang Belanja */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Latar Gelap */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Panel Samping (Sidebar) */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            {/* Header Sidebar */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-blue-700" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Keranjang Anda</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Daftar Item */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                  <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-2">
                     <ShoppingCart className="h-12 w-12 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Keranjang Kosong</h3>
                  <p className="text-slate-500 text-sm">Belum ada template yang ditambahkan.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 mt-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                  >
                    Cari Template
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shrink-0">
                      <Presentation className="h-7 w-7 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-900 truncate pr-6" title={item.nama_produk}>
                        {item.nama_produk}
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm font-extrabold text-blue-700">
                          {formatRupiah(item.harga_sale)}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bagian Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-500 text-sm font-medium">
                    <span>Total Item</span>
                    <span>{totalItems} Template</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-xl pt-3 border-t border-dashed border-slate-200">
                    <span>Total Pembayaran</span>
                    <span className="text-blue-700">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setCart([]);
                    setToastMessage("🎉 Pembayaran Berhasil! Cek email Anda untuk mengunduh template.");
                  }}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200/50 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Bayar & Unduh Sekarang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity">
             <div className="bg-blue-600 p-1.5 rounded-lg">
                <Presentation className="h-5 w-5 text-white" />
              </div>
            <span className="font-bold text-lg text-slate-900">PPT<span className="text-blue-600">Store</span></span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} PPT Store. Desain oleh Anda.
          </p>
        </div>
      </footer>
      
    </div>
  );
}