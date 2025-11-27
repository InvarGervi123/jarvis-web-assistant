const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// בדיקת סיסמה
userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

// האש לסיסמה חדשה
userSchema.statics.hashPassword = async function (password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

module.exports = mongoose.model('User', userSchema);
