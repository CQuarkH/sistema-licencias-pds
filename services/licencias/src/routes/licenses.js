import { Router } from "express";
const router = Router();

export default (pool) => {
    router.post("/", async (req, res) => {
        const { patientId, doctorId, diagnosis, startDate, days } = req.body;

        if (days <= 0) {
            return res.status(400).json({ error: "INVALID_DAYS" });
        }

        try {
            const [result] = await pool.query(
                "INSERT INTO licenses (patientId, doctorId, diagnosis, startDate, days, status, folio) VALUES (?, ?, ?, ?, ?, 'issued', NULL)",
                [patientId, doctorId, diagnosis, startDate, days]
            );

            const folio = `L-${1000 + result.insertId}`;
            await pool.query("UPDATE licenses SET folio=? WHERE id=?", [folio, result.insertId]);

            const [rows] = await pool.query("SELECT * FROM licenses WHERE id=?", [result.insertId]);
            return res.status(201).json(rows[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "INTERNAL" });
        }
    });

    // GET /licenses/:folio
    router.get("/:folio", async (req, res) => {
        const { folio } = req.params;
        const [rows] = await pool.query("SELECT * FROM licenses WHERE folio=?", [folio]);
        if (rows.length === 0) return res.status(404).json({ error: "NOT_FOUND" });
        return res.json(rows[0]);
    });

    // GET /licenses?patientId=...
    router.get("/", async (req, res) => {
        const { patientId } = req.query;
        if (!patientId) return res.json([]);
        const [rows] = await pool.query("SELECT * FROM licenses WHERE patientId=?", [patientId]);
        return res.json(rows);
    });

    // GET /licenses/:folio/verify
    router.get("/:folio/verify", async (req, res) => {
        const { folio } = req.params;
        const [rows] = await pool.query("SELECT * FROM licenses WHERE folio=?", [folio]);
        if (rows.length > 0 && rows[0].status === "issued") {
            return res.json({ valid: true });
        }
        return res.status(404).json({ valid: false });
    });

    return router;
};
