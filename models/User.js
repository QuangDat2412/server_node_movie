const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        isVip: { type: Boolean, default: false },
        favorites: [{ type: mongoose.Schema.ObjectId, ref: 'Movie' }],
        history: [{ type: mongoose.Schema.ObjectId, ref: 'Episode' }],
        img: { type: String, default: '' },
        refreshToken: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
