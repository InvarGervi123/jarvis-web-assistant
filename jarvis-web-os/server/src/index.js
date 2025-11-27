require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDb = require('./config/db');

const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');

const app = express();
const PORT = process.env.PORT || 5000;

// חיבור למסד נתונים
connectDb();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// בדיקה בסיסית
app.get('/', (req, res) => {
    res.json({ message: 'JARVIS API is running' });
});

// ראוטים אמיתיים
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);

// טיפול בשגיאות
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(err.status || 500)
        .json({ message: err.message || 'Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
