#!/bin/bash

echo "=== Test de Integración - Servicios Consumidores ==="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs de los servicios
PORTAL_URL="http://localhost:3002"
VALIDADOR_URL="http://localhost:3003"

echo "Probando conectividad de servicios..."

# Test Portal Paciente Health
echo -n "Portal Paciente health check: "
if curl -s -f "$PORTAL_URL/health" > /dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
fi

# Test Validador Aseguradora Health  
echo -n "Validador Aseguradora health check: "
if curl -s -f "$VALIDADOR_URL/health" > /dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAIL${NC}"
fi

echo ""
echo "=== Pruebas de Endpoints (requieren servicio Licencias activo) ==="
echo ""

# Test Portal Paciente endpoint
echo -n "Portal Paciente - GET /patient/test/licenses: "
PORTAL_RESPONSE=$(curl -s -w "%{http_code}" "$PORTAL_URL/patient/test/licenses")
HTTP_CODE="${PORTAL_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ OK (200)${NC}"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${YELLOW}⚠ Service unavailable (500) - Licencias service needed${NC}"
else
    echo -e "${RED}✗ FAIL ($HTTP_CODE)${NC}"
fi

# Test Validador endpoints
echo -n "Validador - GET /insurer/licenses/test/verify: "
VALIDADOR_RESPONSE=$(curl -s -w "%{http_code}" "$VALIDADOR_URL/insurer/licenses/test/verify")
HTTP_CODE="${VALIDADOR_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ OK (200)${NC}"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${YELLOW}⚠ Service unavailable (500) - Licencias service needed${NC}"
else
    echo -e "${RED}✗ FAIL ($HTTP_CODE)${NC}"
fi

echo -n "Validador - GET /insurer/patients/test/licenses: "
VALIDADOR_RESPONSE2=$(curl -s -w "%{http_code}" "$VALIDADOR_URL/insurer/patients/test/licenses")
HTTP_CODE="${VALIDADOR_RESPONSE2: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ OK (200)${NC}"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${YELLOW}⚠ Service unavailable (500) - Licencias service needed${NC}"
else
    echo -e "${RED}✗ FAIL ($HTTP_CODE)${NC}"
fi
