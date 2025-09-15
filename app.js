require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});