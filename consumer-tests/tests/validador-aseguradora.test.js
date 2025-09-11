// consumer-tests/tests/validador-aseguradora.test.js
const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const request = require("supertest");

const provider = new Pact({
  consumer: "ValidadorAseguradora",
  provider: "LicenciasService",
  port: 1236,
  log: path.resolve(process.cwd(), "logs", "pact-validador.log"),
  dir: path.resolve(process.cwd(), "../pacts"),
  spec: 2,
});

describe("Validador Aseguradora Pact (consumer)", () => {
  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.verify();
  });

  test("GET /licenses/L-1001/verify => { valid:true }", async () => {
    await provider.addInteraction({
      state: "patient 11111111-1 has issued license folio L-1001",
      uponReceiving: "a request to verify existing license L-1001",
      withRequest: {
        method: "GET",
        path: "/licenses/L-1001/verify"
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: { valid: true }
      }
    });

    const res = await request(`http://localhost:${provider.opts.port}`)
      .get("/licenses/L-1001/verify");

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  test("GET /licenses/L-404/verify => 404 { valid:false }", async () => {
    await provider.addInteraction({
      state: "license L-404 does not exist",
      uponReceiving: "a request to verify non-existing license L-404",
      withRequest: {
        method: "GET",
        path: "/licenses/L-404/verify"
      },
      willRespondWith: {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: { valid: false }
      }
    });

    const res = await request(`http://localhost:${provider.opts.port}`)
      .get("/licenses/L-404/verify");

    expect(res.status).toBe(404);
    expect(res.body.valid).toBe(false);
  });
});

