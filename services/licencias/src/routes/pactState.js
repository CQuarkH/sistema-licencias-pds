export default (pool) => {
    return async (req, res) => {
        const { state } = req.body;

        try {
            switch (state) {
                case "patient 11111111-1 has issued license folio L-1001":
                    await pool.query("DELETE FROM licenses WHERE folio='L-1001'");
                    await pool.query(
                        "INSERT INTO licenses (folio, patientId, doctorId, diagnosis, startDate, days, status) VALUES ('L-1001','11111111-1','DR-1001','seed - issued',CURDATE(),7,'issued')"
                    );
                    break;

                case "no licenses for patient 22222222-2":
                    await pool.query("DELETE FROM licenses WHERE patientId='22222222-2'");
                    break;

                case "license L-404 does not exist":
                    await pool.query("DELETE FROM licenses WHERE folio='L-404'");
                    break;

                case "issued license days>0 is creatable":
                    // clean slate
                    await pool.query("DELETE FROM licenses WHERE folio LIKE 'L-CREATE%'");
                    break;

                default:
                    return res.status(400).json({ error: "UNKNOWN_STATE" });
            }

            return res.json({ result: "OK" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "INTERNAL" });
        }
    };
};