#!/bin/bash
# Test API endpoints

API_URL="http://localhost:3000"

echo "  Testando conectividade com $API_URL..."

# Check if port is open (simple netcat or curl)
# We use curl with max time to avoid hanging
response=$(curl --write-out '%{http_code}' --silent --output /dev/null --max-time 2 "$API_URL/v1/health_check_dummy_404")

# We expect 404 for a dummy path, or 405 Method Not Allowed, or 403 Forbidden (Whitelist).
# If we get 000, server is down.

if [ "$response" -eq 000 ]; then
    echo "  [ERRO] Não foi possível conectar ao servidor na porta 3000."
    echo "  DICA: Certifique-se de que 'PORT=3000 go run .' está rodando no 'crom-tools-api'."
    exit 1
elif [ "$response" -eq 403 ]; then
    echo "  [AVISO] Servidor online, mas retornou 403 (Forbidden). Verifique a Whitelist!"
    # This is actually a "Pass" for connectivity, but a "Fail" for configuration if testing from localhost.
    # But localhost should be whitelisted.
    exit 0
else
    echo "  [OK] Servidor respondeu com código: $response"
    exit 0
fi
