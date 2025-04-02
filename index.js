require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

console.log("DB_URI from .env:", process.env.DB_URI);

app.use(express.json());


mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));


app.use('/api/users', userRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});