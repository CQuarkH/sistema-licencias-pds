import { Verifier } from '@pact-foundation/pact';
import { resolve } from 'path';

// Configuración para verificar el proveedor Licencias
const opts = {
    provider: 'LicenciasService',
    providerBaseUrl: process.env.LICENCIAS_URL || 'http://licencias:3001',
    pactUrls: [
        resolve(process.cwd(), 'pacts/MedicoApp-LicenciasService.json'),
        resolve(process.cwd(), 'pacts/PortalPaciente-LicenciasService.json'),
        resolve(process.cwd(), 'pacts/ValidadorAseguradora-LicenciasService.json')
    ],
    providerStatesSetupUrl: `${process.env.LICENCIAS_URL || 'http://licencias:3001'}/_pactState`,
    publishVerificationResult: false,
    logLevel: 'info',
    providerVersion: '1.0.0',
    timeout: 30000
};

console.log('🔍 Starting Pact verification with config:', {
    provider: opts.provider,
    providerBaseUrl: opts.providerBaseUrl,
    providerStatesSetupUrl: opts.providerStatesSetupUrl
});

new Verifier(opts).verifyProvider()
    .then(() => {
        console.log('Pact verification successful!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Pact verification failed:', error);
        process.exit(1);
    });