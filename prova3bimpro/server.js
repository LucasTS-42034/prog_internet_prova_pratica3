const express = require('express');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});