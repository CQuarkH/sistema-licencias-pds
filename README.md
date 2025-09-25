# Sistema de Licencias Médicas

Sistema de microservicios para gestión de licencias médicas con integración entre servicios.

## Inicio Rápido

### 1. Iniciar Servicios
```bash
# Levantar todos los servicios con Docker (Desde la raiz del proyecto)
docker-compose --env-file .env -f docker/docker-compose.yml up --build

# Verificar que todos estén corriendo
docker-compose ps
```

## Endpoints para Probar

### Servicio de Licencias (Puerto 3001)

**Crear una licencia:**
```http
POST http://localhost:3001/licenses
Content-Type: application/json

{
  "patientId": "12345",
  "diagnosis": "Diabetes",
  "treatment": "Metformina",
  "doctorId": "DOC001"
}
```

**Obtener todas las licencias:**
```http
GET http://localhost:3001/licenses
```

**Obtener licencia específica:**
```http
GET http://localhost:3001/licenses/1
```

**Verificar licencia:**
```http
GET http://localhost:3001/licenses/L-1001/verify
```

### Portal Paciente (Puerto 3002)

**Obtener licencias de un paciente:**
```http
GET http://localhost:3002/patient/12345/licenses
```

**Health check:**
```http
GET http://localhost:3002/health
```

### Validador Aseguradora (Puerto 3003)

**Validar una licencia:**
```http
GET http://localhost:3003/insurer/licenses/L-1001/verify
```

**Obtener licencias de un paciente:**
```http
GET http://localhost:3003/insurer/patients/12345/licenses
```

**Health check:**
```http
GET http://localhost:3003/health
```

---

# Ejecución de Consumer Tests (Pact)

## 1️⃣ Construir la imagen de tests del consumidor
Construye la imagen docker para consumer-tests

docker compose -f docker/docker-compose.yml --project-directory . build consumer-tests

## 2️⃣ Ejecutar los tests del consumidor dentro del contenedor
Corre los tests de consumer-tests sin levantar dependencias

docker compose -f docker/docker-compose.yml --project-directory . run --rm --no-deps consumer-tests npm test

⚡ Esto generará los archivos de contratos .pact en ./pacts.

## 3️⃣ Comandos npm desde el contenedor o localmente
Correr todos los tests

npm test
Limpiar los contratos generados

npm run pacts:clean

---

# Verificación de Contratos en Providers

# Limpiar servicios y contratos previos
docker compose down -v
Remove-Item -Recurse -Force ..\pacts\*   # (Windows PowerShell)

# Levantar servicios
docker compose --env-file .env up --build -d

# Verificar que todos los servicios estén corriendo
docker compose ps

# Listar contratos generados
dir ..\pacts

# Ejecutar verificación en provider "licencias"
docker compose run --rm verify-licencias npm test

# Detener y limpiar todo
docker compose down -v
