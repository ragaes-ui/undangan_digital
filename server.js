const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Guest = require('./models/Guest');
const WeddingConfig = require('./models/WeddingConfig');

// MENGUBAH AKUN DARI KODE MATI MENJADI DATABASE
const adminSchema = new mongoose.Schema({
    username: { type: String, default: 'adminnikah' },
    password: { type: String, default: 'rahasiabanget' }
});
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminSchema);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoURI = 'mongodb+srv://undangan_digital:raga151204@cluster0.rutgg.mongodb.net/undangan_digital?retryWrites=true&w=majority';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Terbangun dan Terkoneksi!');
    } catch (err) {
        console.error('Gagal membangunkan MongoDB:', err);
    }
};

const isAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === 'TOKEN_RAHASIA_RAGA_2026') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Akses ditolak.' });
    }
};

// ==================== API TAMU / UNDANGAN ====================
app.get('/api/wedding-info', async (req, res) => {
    try {
        await connectDB(); 
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
        await connectDB(); 
        const { name, attendance, message } = req.body;
        const newGuest = new Guest({ name, attendance, message });
        await newGuest.save();
        res.status(201).json({ success: true, message: 'RSVP Berhasil' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== API ADMIN ====================
app.post('/api/admin/login', async (req, res) => {
    try {
        await connectDB();
        const { username, password } = req.body;
        
        let admin = await AdminUser.findOne();
        if (!admin) {
            admin = new AdminUser();
            await admin.save();
        }
        
        if (username === admin.username && password === admin.password) {
            res.json({ success: true, token: 'TOKEN_RAHASIA_RAGA_2026' });
        } else {
            res.status(400).json({ success: false, message: 'Kredensial salah' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mengambil Username Saat Ini
app.get('/api/admin/credentials', isAdmin, async (req, res) => {
    try {
        await connectDB();
        let admin = await AdminUser.findOne();
        if (!admin) admin = new AdminUser();
        res.json({ success: true, username: admin.username });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mengubah Username & Password
app.post('/api/admin/change-credentials', isAdmin, async (req, res) => {
    try {
        await connectDB();
        const { newUsername, newPassword } = req.body;
        
        let admin = await AdminUser.findOne();
        if (!admin) admin = new AdminUser();
        
        if (newUsername) admin.username = newUsername;
        if (newPassword) admin.password = newPassword;
        
        await admin.save();
        res.json({ success: true, message: 'Kredensial berhasil diubah' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/guests', isAdmin, async (req, res) => {
    try {
        await connectDB(); 
        const guests = await Guest.find().sort({ createdAt: -1 });
        res.json({ success: true, data: guests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/admin/guests/:id', isAdmin, async (req, res) => {
    try {
        await connectDB(); 
        await Guest.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Data tamu berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/update-info', isAdmin, async (req, res) => {
    try {
        await connectDB(); 
        const {
            mempelaiPria, mempelaiWanita,
            urlFotoPria, urlFotoWanita, 
            ortuPria, ortuWanita, igPria, igWanita,
            tanggalAcara, jamAkad, alamatAkad,
            jamResepsi, alamatResepsi,
            namaBank, noRekening, atasNamaRekening,
            urlFotoHero, urlFotoGaleri, ceritaCinta
        } = req.body;

        let galeriArray = [];
        if (Array.isArray(urlFotoGaleri)) {
            galeriArray = urlFotoGaleri;
        } else if (typeof urlFotoGaleri === 'string') {
            galeriArray = urlFotoGaleri.split(',').map(url => url.trim());
        }

        const updated = await WeddingConfig.findOneAndUpdate({}, {
            mempelaiPria, mempelaiWanita,
            urlFotoPria, urlFotoWanita, 
            ortuPria, ortuWanita, igPria, igWanita,
            tanggalAcara, jamAkad, alamatAkad,
            jamResepsi, alamatResepsi,
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

app.use((err, req, res, next) => {
    console.error("Express System Error:", err.stack);
    res.status(500).json({ success: false, error: "Sistem Error: " + err.message });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server ON di port ${PORT}`));
}
module.exports = app;
