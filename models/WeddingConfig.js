const mongoose = require('mongoose');

const weddingConfigSchema = new mongoose.Schema({
    mempelaiPria: { type: String, required: true, default: 'Raga' },
    mempelaiWanita: { type: String, required: true, default: 'Maya' },
    
    // --- TAMBAHAN BARU: FOTO, ORTU, & IG MEMPELAI ---
    urlFotoPria: { type: String, default: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400' },
    urlFotoWanita: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400' },
    ortuPria: { type: String, default: 'Bapak Pria & Ibu Pria' },
    ortuWanita: { type: String, default: 'Bapak Wanita & Ibu Wanita' },
    igPria: { type: String, default: 'https://instagram.com/' },
    igWanita: { type: String, default: 'https://instagram.com/' },
    // ------------------------------------------------
    
    tanggalAcara: { type: String, required: true, default: 'Minggu, 15 November 2026' },
    jamAkad: { type: String, default: '08.00 WIB - Selesai' },
    alamatAkad: { type: String, default: 'Masjid Raya Jakarta, Jl. Sudirman No. 1' },
    mapsAkad: { type: String, default: 'https://maps.google.com' },
    jamResepsi: { type: String, default: '11.00 WIB - 14.00 WIB' },
    alamatResepsi: { type: String, default: 'Grand Ballroom Hotel, Jl. Sudirman No. 1' },
    mapsResepsi: { type: String, default: 'https://maps.google.com' },
    namaBank: { type: String, default: 'Bank BCA' },
    noRekening: { type: String, default: '1234567890' },
    atasNamaRekening: { type: String, default: 'Raga' },
    urlFotoHero: { type: String, default: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1080' },
    
    // Galeri ditutup rapi dulu di sini
    urlFotoGaleri: { type: [String], default: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600'
    ]},
    
    // --- TAMBAHAN BARU: KISAH CINTA ---
    ceritaCinta: {
        type: [{
            judul: String,
            tanggal: String,
            deskripsi: String
        }],
        default: [
            { judul: "Awal Bertemu", tanggal: "Januari 2024", deskripsi: "Berawal dari obrolan singkat di sebuah event, kami mulai mengenal satu sama lain." },
            { judul: "Komitmen", tanggal: "Agustus 2025", deskripsi: "Setelah melalui banyak hal bersama, kami memutuskan untuk mengikat janji dalam sebuah pertunangan." }
        ]
    }
});

module.exports = mongoose.model('WeddingConfig', weddingConfigSchema);