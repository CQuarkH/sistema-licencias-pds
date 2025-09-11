# Tarea: Pruebas de Contrato en Microservicios
Pruebas de Software

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
