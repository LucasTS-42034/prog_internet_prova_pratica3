const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/db');

const JWT_SECRET = 'segredo';

// Gerar token JWT (1 hora de expiração)
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Hash da senha
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Comparar senha
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Registrar usuário
const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

        const data = await readData();
        const userExists = data.users.find(user => user.email === email);
        
        if (userExists) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const hashedPassword = await hashPassword(senha);
        const newUser = {
            id: uuidv4(),
            nome,
            email,
            senha: hashedPassword
        };

        data.users.push(newUser);
        await writeData(data);

        const token = generateToken(newUser.id);
        
        // Não retornar a senha
        const { senha: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ 
            token, 
            user: userWithoutPassword 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const data = await readData();
        const user = data.users.find(user => user.email === email);
        
        if (!user || !(await comparePassword(senha, user.senha))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = generateToken(user.id);
        
        // Não retornar a senha
        const { senha: _, ...userWithoutPassword } = user;
        res.json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };