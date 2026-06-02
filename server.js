const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const Guest = require('./models/Guest');
const WeddingConfig = require('./models/WeddingConfig');

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// 1. Session Secret langsung ditanam di sini
app.use(session({
    secret: 'kuncirahasiaundangan123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// 2. Link MongoDB Atlas langsung ditanam di sini
const mongoURI = 'mongodb+srv://undangan_digital:raga151204@cluster0.rutgg.mongodb.net/undangan_digital?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Terkoneksi Mantap!'))
    .catch(err => console.error('Gagal koneksi MongoDB:', err));

const isAdmin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Akses ditolak.' });
    }
};

// ==================== API TAMU / UNDANGAN ====================
app.get('/api/wedding-info', async (req, res) => {
    try {
        let config = await WeddingConfig.findOne();
        if (!config) {
            config = new WeddingConfig();
            await config.save();
        }
        res.json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/rsvp', async (req, res) => {
    try {
        const { name, attendance, message } = req.body;
        const newGuest = new Guest({ name, attendance, message });
        await newGuest.save();
        res.status(201).json({ success: true, message: 'RSVP Berhasil' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== API ADMIN ====================
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // 3. Username dan Password Admin ditanam langsung di sini
    if (username === 'adminnikah' && password === 'rahasiabanget') {
        req.session.isLoggedIn = true;
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Kredensial salah' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/admin/guests', isAdmin, async (req, res) => {
    try {
        const guests = await Guest.find().sort({ createdAt: -1 });
        res.json({ success: true, data: guests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/update-info', isAdmin, async (req, res) => {
    try {
        // 1. Tarik SATU-SATU semua data dari request payload
        const {
            mempelaiPria, mempelaiWanita,
            urlFotoPria, urlFotoWanita, // <-- Ini tersangka utamanya
            ortuPria, ortuWanita, igPria, igWanita,
            tanggalAcara, jamAkad, alamatAkad, mapsAkad,
            jamResepsi, alamatResepsi, mapsResepsi,
            namaBank, noRekening, atasNamaRekening,
            urlFotoHero, urlFotoGaleri, ceritaCinta
        } = req.body;

        // 2. Rapikan data galeri
        let galeriArray = [];
        if (Array.isArray(urlFotoGaleri)) {
            galeriArray = urlFotoGaleri;
        } else if (typeof urlFotoGaleri === 'string') {
            galeriArray = urlFotoGaleri.split(',').map(url => url.trim());
        }

        // 3. Tembak ke MongoDB (Pastikan urlFoto masuk ke sini)
        const updated = await WeddingConfig.findOneAndUpdate({}, {
            mempelaiPria, mempelaiWanita,
            urlFotoPria, urlFotoWanita, // <-- WAJIB MASUK SINI
            ortuPria, ortuWanita, igPria, igWanita,
            tanggalAcara, jamAkad, alamatAkad, mapsAkad,
            jamResepsi, alamatResepsi, mapsResepsi,
            namaBank, noRekening, atasNamaRekening,
            urlFotoHero, 
            urlFotoGaleri: galeriArray,
            ceritaCinta
        }, { new: true, upsert: true });

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error saat update database:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ON di port ${PORT}`));
