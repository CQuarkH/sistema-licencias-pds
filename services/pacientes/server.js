import { config } from "dotenv";
config({ path: "../../.env" });
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import process from "node:process";

const app = express();
const PORT = process.env.PORTAL_PACIENTE_PORT || 3002;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.PORTAL_PACIENTE_DB,
  port: process.env.DB_PORT,
};

let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS patient_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patientId VARCHAR(50) NOT NULL,
        sessionToken VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

async function callLicenciasService(endpoint) {
  const licenciasBaseUrl = process.env.LICENCIAS_URL;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${licenciasBaseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Licencias service:", error);
    throw error;
  }
}

app.get("/patient/:patientId/licenses", async (req, res) => {
  try {
    const { patientId } = req.params;

    const licenses = await callLicenciasService(
      `/licenses?patientId=${patientId}`,
    );

    res.json(licenses);
  } catch (error) {
    console.error("Error fetching patient licenses:", error);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "portal-paciente" });
});

app.listen(PORT, () => {
  console.log(`Portal Paciente service running on port ${PORT}`);
  initDatabase();
});

export default app;

