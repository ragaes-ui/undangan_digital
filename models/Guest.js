const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    attendance: { type: String, enum: ['Hadir', 'Tidak Hadir', 'Ragu-ragu'], default: 'Hadir' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', guestSchema);