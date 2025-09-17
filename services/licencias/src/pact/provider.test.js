import { Verifier } from '@pact-foundation/pact';
import { resolve } from 'path';

// Configuración para verificar el proveedor Licencias
const opts = {
    provider: 'Licencias',
    providerBaseUrl: 'http://localhost:3001',
    pactUrls: [
        resolve(process.cwd(), '../../pacts/MedicoApp-LicenciasService.json'),
        resolve(process.cwd(), '../../pacts/PortalPaciente-LicenciasService.json'),
        resolve(process.cwd(), '../../pacts/ValidadorAseguradora-LicenciasService.json')
    ],
    providerStatesSetupUrl: 'http://localhost:3001/_pactState',
    publishVerificationResult: false,
    logLevel: 'info',
    providerVersion: '1.0.0',
    timeout: 30000
};

new Verifier(opts).verifyProvider()
    .then(() => {
        console.log('Pact verification successful!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Pact verification failed:', error);
        process.exit(1);
    });