require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3010;

console.log("db from .env:", process.env.db);

app.use(express.json());

if (!process.env.db) {
    console.error("❌ MongoDB Connection Error: db is not defined in .env file");
    process.exit(1);
}

mongoose.connect(process.env.db)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

app.use('/api/users', userRoutes);

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Login successful!' });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});