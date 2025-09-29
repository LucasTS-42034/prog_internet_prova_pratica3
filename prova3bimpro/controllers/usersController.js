const { readData, writeData } = require('../utils/db');

// Listar todos os usuários
const getAllUsers = async (req, res) => {
    try {
        const data = await readData();
        
        // Remove senhas dos resultados
        const usersWithoutPasswords = data.users.map(user => {
            const { senha, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        res.json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar usuário por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();
        const user = data.users.find(user => user.id === id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Remove senha do resultado
        const { senha, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar usuário
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        
        const data = await readData();
        const userIndex = data.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Atualiza apenas nome e email
        if (nome) data.users[userIndex].nome = nome;
        if (email) data.users[userIndex].email = email;

        await writeData(data);

        // Remove senha do resultado
        const { senha, ...updatedUser } = data.users[userIndex];
        res.json(updatedUser);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deletar usuário
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();
        
        const userIndex = data.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        data.users.splice(userIndex, 1);
        await writeData(data);
        
        res.status(204).send();
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };