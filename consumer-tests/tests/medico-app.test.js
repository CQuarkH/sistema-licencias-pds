// consumer-tests/tests/medico-app.test.js
const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const request = require("supertest");

const provider = new Pact({
  consumer: "MedicoApp",
  provider: "LicenciasService",
  port: 1234,
  log: path.resolve(process.cwd(), "logs", "pact-medico.log"),
  dir: path.resolve(process.cwd(), "../pacts"),
  spec: 2,
});

describe("Medico App Pact (consumer)", () => {
  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.verify();
  });

  test("POST /licenses - positivo (days = 7) => 201", async () => {
    await provider.addInteraction({
      state: "issued license days>0 is creatable",
      uponReceiving: "a request to create a license with valid days",
      withRequest: {
        method: "POST",
        path: "/licenses",
        headers: { "Content-Type": "application/json" },
        body: {
          patientId: "11111111-1",
          doctorId: "D-100",
          diagnosis: "Gripe",
          startDate: "2025-09-10",
          days: 7
        }
      },
      willRespondWith: {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: {
          folio: "L-1001",
          patientId: "11111111-1",
          doctorId: "D-100",
          diagnosis: "Gripe",
          startDate: "2025-09-10",
          days: 7,
          status: "issued"
        }
      }
    });

    const res = await request(`http://localhost:${provider.opts.port}`)
      .post("/licenses")
      .send({
        patientId: "11111111-1",
        doctorId: "D-100",
        diagnosis: "Gripe",
        startDate: "2025-09-10",
        days: 7
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("folio");
    expect(res.body.status).toBe("issued");
  });

  test("POST /licenses - negativo (days = 0) => 400 INVALID_DAYS", async () => {
    await provider.addInteraction({
      state: "issued license days>0 is creatable",
      uponReceiving: "a request to create a license with invalid days (0)",
      withRequest: {
        method: "POST",
        path: "/licenses",
        headers: { "Content-Type": "application/json" },
        body: {
          patientId: "11111111-1",
          doctorId: "D-100",
          diagnosis: "Gripe",
          startDate: "2025-09-10",
          days: 0
        }
      },
      willRespondWith: {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: { error: "INVALID_DAYS" }
      }
    });

    const res = await request(`http://localhost:${provider.opts.port}`)
      .post("/licenses")
      .send({
        patientId: "11111111-1",
        doctorId: "D-100",
        diagnosis: "Gripe",
        startDate: "2025-09-10",
        days: 0
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("INVALID_DAYS");
  });
});
