const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../db.json');

const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existe, retorna estrutura vazia
        return { users: [] };
    }
};

const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };