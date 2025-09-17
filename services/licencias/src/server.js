import express, { json } from "express";
import cors from "cors";
import { createPool } from "mysql2/promise";

import createLicensesRouter from "./routes/licenses.js";
import createPactStateRouter from "./routes/pactState.js";

const PORT = process.env.PORT || 3001;

async function startServer() {
    const pool = await createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "root",
        database: process.env.DB_NAME || "licenciasdb"
    });

    const app = express();
    app.use(cors());
    app.use(json());

    app.use("/licenses", createLicensesRouter(pool));
    app.post("/_pactState", createPactStateRouter(pool));

    app.get("/health", async (_, res) => {
        try {
            await pool.query("SELECT 1");
            res.json({ status: "ok" });
        } catch (e) {
            res.status(500).json({ status: "db_error" });
        }
    });

    app.listen(PORT, () => {
        console.log(`Licencias service running on port ${PORT}`);
    });
}

startServer();
