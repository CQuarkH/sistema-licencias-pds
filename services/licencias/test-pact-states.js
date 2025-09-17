// test-pact-states.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testPactState(stateName, verificationCallback) {
    console.log(`\n🧪 Testing provider state: "${stateName}"`);

    try {
        // 1. Configurar el estado
        const stateResponse = await axios.post(`${BASE_URL}/_pactState`, {
            state: stateName
        });

        console.log(`✅ State setup: ${stateResponse.data.result}`);

        // 2. Ejecutar verificación específica
        if (verificationCallback) {
            await verificationCallback();
        }

    } catch (error) {
        console.error(`❌ Error testing state "${stateName}":`, error.response?.data || error.message);
    }
}

async function verifyLicenseExists(folio, shouldExist = true) {
    try {
        const response = await axios.get(`${BASE_URL}/licenses/${folio}`);
        if (shouldExist) {
            console.log(`✅ License ${folio} exists:`, response.data);
        } else {
            console.log(`❌ License ${folio} should not exist but it does`);
        }
    } catch (error) {
        if (error.response?.status === 404 && !shouldExist) {
            console.log(`✅ License ${folio} correctly does not exist`);
        } else if (shouldExist) {
            console.log(`❌ License ${folio} should exist but got error:`, error.response?.status);
        }
    }
}

async function verifyPatientLicenses(patientId, expectedCount) {
    try {
        const response = await axios.get(`${BASE_URL}/licenses?patientId=${patientId}`);
        const licenses = response.data;

        if (licenses.length === expectedCount) {
            console.log(`✅ Patient ${patientId} has ${expectedCount} licenses as expected`);
        } else {
            console.log(`❌ Patient ${patientId} has ${licenses.length} licenses, expected ${expectedCount}`);
        }
    } catch (error) {
        console.error(`❌ Error checking licenses for patient ${patientId}:`, error.response?.data || error.message);
    }
}

async function verifyLicenseCanBeCreated() {
    try {
        const licenseData = {
            patientId: "test-patient-123",
            doctorId: "test-doctor-456",
            diagnosis: "Test diagnosis for pact state",
            startDate: "2024-09-10",
            days: 3
        };

        const response = await axios.post(`${BASE_URL}/licenses`, licenseData);

        if (response.status === 201) {
            console.log(`✅ License created successfully:`, response.data.folio);
            return response.data.folio;
        }
    } catch (error) {
        console.error(`❌ Error creating license:`, error.response?.data || error.message);
    }
}

async function runAllTests() {
    console.log('🚀 Starting Provider State Tests for Licencias Service\n');

    // Test 1: Patient with issued license
    await testPactState(
        'patient 11111111-1 has issued license folio L-1001',
        () => verifyLicenseExists('L-1001', true)
    );

    // Test 2: Patient with no licenses
    await testPactState(
        'no licenses for patient 22222222-2',
        () => verifyPatientLicenses('22222222-2', 0)
    );

    // Test 3: Non-existent license
    await testPactState(
        'license L-404 does not exist',
        () => verifyLicenseExists('L-404', false)
    );

    // Test 4: License creation readiness
    await testPactState(
        'issued license days>0 is creatable',
        verifyLicenseCanBeCreated
    );

    console.log('\n✨ Provider State Tests completed!');
}

// Ejecutar las pruebas
runAllTests().catch(console.error);