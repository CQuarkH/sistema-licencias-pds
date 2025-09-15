// consumer-tests/tests/portal-paciente.test.js
const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const request = require("supertest");

const provider = new Pact({
  consumer: "PortalPaciente",
  provider: "LicenciasService",
  port: 1235,
  log: path.resolve(process.cwd(), "logs", "pact-portal.log"),
  dir: path.resolve(process.cwd(), "../pacts"),
  spec: 2,
});

describe("Portal Paciente Pact (consumer)", () => {
  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.verify();
  });

  test("GET /licenses?patientId=11111111-1 => devuelve >=1 licencia", async () => {
    await provider.addInteraction({
      state: "patient 11111111-1 has issued license folio L-1001",
      uponReceiving: "a request for licenses for patient 11111111-1",
      withRequest: {
        method: "GET",
        path: "/licenses",
        query: {
          patientId: "11111111-1"
        },
        headers: {
          Accept: "application/json"
        }
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: [
          {
            folio: "L-1001",
            patientId: "11111111-1",
            doctorId: "D-100",
            diagnosis: "Gripe",
            startDate: "2025-09-10",
            days: 7,
            status: "issued"
          }
        ]
      }
    });

    const res = await request(`http://localhost:${provider.opts.port}`)
      .get("/licenses")
      .query({ patientId: "11111111-1" })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("GET /licenses?patientId=22222222-2 => devuelve []", async () => {
    await provider.addInteraction({
      state: "no licenses for patient 22222222-2",
      uponReceiving: "a request for licenses for patient 22222222-2",
      withRequest: {
        method: "GET",
        path: "/licenses",
        query: {
          patientId: "22222222-2"
        },
        headers: {
          Accept: "application/json"
        }
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: []
      }
    });

    const res = await request(`http://localhost:${provider.opts.port}`)
      .get("/licenses")
      .query({ patientId: "22222222-2" })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});



