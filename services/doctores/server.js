require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.VALIDADOR_ASEGURADORA_PORT || 3003;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.VALIDADOR_ASEGURADORA_DB,
  port: process.env.DB_PORT
};

let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS insurance_validations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        folio VARCHAR(50) NOT NULL,
        validation_result BOOLEAN,
        validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        insurer_id VARCHAR(50)
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

async function callLicenciasService(endpoint) {
  const licenciasBaseUrl = process.env.LICENCIAS_URL;
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${licenciasBaseUrl}${endpoint}`);
    
    if (response.status === 404) {
      return { valid: false };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling Licencias service:', error);
    throw error;
  }
}

app.get('/insurer/licenses/:folio/verify', async (req, res) => {
  try {
    const { folio } = req.params;
    
    const result = await callLicenciasService(`/licenses/${folio}/verify`);
    
    if (db) {
      await db.execute(
        'INSERT INTO insurance_validations (folio, validation_result) VALUES (?, ?)',
        [folio, result.valid || false]
      );
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error verifying license:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

app.get('/insurer/patients/:patientId/licenses', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const licenses = await callLicenciasService(`/licenses?patientId=${patientId}`);
    
    res.json(licenses);
  } catch (error) {
    console.error('Error fetching patient licenses:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'validador-aseguradora' });
});

app.listen(PORT, () => {
  console.log(`Validador Aseguradora service running on port ${PORT}`);
  initDatabase();
});

module.exports = app;