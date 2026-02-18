#!/bin/bash

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 Iniciando Diagnóstico do Crom Tools...${NC}"

# 1. Verificar se a API está rodando
echo -n "Testando API Backend (Porta 3000)... "
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}ONLINE${NC}"
else
    echo -e "${RED}OFFLINE${NC} (Verifique se 'go run .' está rodando em crom-tools-api)"
fi

# 2. Verificar Frontend (PHP Server ou Caddy)
echo -n "Testando Frontend (Porta 1234)... "
if curl -s http://localhost:1234 > /dev/null; then
    echo -e "${GREEN}ONLINE${NC}"
else
    echo -e "${RED}OFFLINE${NC} (Verifique se 'php -S' está rodando)"
fi

# 3. Verificar Arquivos Estáticos Críticos
FILES=(
    "crom-static/v1/js/core/app.js"
    "crom-static/v1/js/worker-image.js"
    "crom-static/v1/js/modules/json-tools.js"
    "crom-static/v1/js/modules/qr-generator.js"
    "crom-static/v1/js/modules/base64-tools.js"
    "crom-static/v1/js/modules/text-diff.js"
    "crom-static/v1/js/modules/hash-tools.js"
    "crom-static/v1/js/modules/jwt-debug.js"
    "crom-static/v1/js/modules/color-tools.js"
    "crom-static/v1/js/modules/time-tools.js"
    "crom-static/v1/js/modules/lorem-gen.js"
    "crom-static/v1/js/modules/regex-tester.js"
    "crom-static/v1/js/modules/url-tools.js"
    "crom-static/v1/js/modules/unit-converter.js"
    "crom-static/v1/js/modules/device-info.js"
    "crom-static/v1/js/modules/screen-recorder.js"
    "crom-static/v1/js/modules/uuid-gen.js"
    "crom-static/v1/js/modules/text-stats.js"
    "crom-static/v1/js/modules/case-converter.js"
    "crom-static/v1/js/modules/aspect-ratio.js"
    "crom-static/v1/js/modules/chmod-calc.js"
    "crom-static/v1/js/modules/csv-json.js"
    "crom-static/v1/js/modules/pomodoro.js"
    "crom-static/v1/js/modules/html-encoder.js"
    "crom-static/v1/js/modules/image-picker.js"
    "crom-static/v1/js/modules/keycode-info.js"
)

echo "Verificando integridade dos módulos..."
ALL_FILES_OK=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  [OK] $file"
    else
        echo -e "  ${RED}[MISSING] $file${NC}"
        ALL_FILES_OK=false
    fi
done

if $ALL_FILES_OK; then
    echo -e "${GREEN}Todos os módulos essenciais foram encontrados.${NC}"
else
    echo -e "${RED}Alguns arquivos estão faltando.${NC}"
fi

# 4. Teste de Conversão de Imagem (Simulado)
# Verifica se o worker-image.js tem a correção de buffer
echo -n "Verificando patch no worker-image.js... "
if grep -q "blobOutput" crom-static/v1/js/worker-image.js; then
     echo -e "${GREEN}PATCH APLICADO${NC}"
else
     echo -e "${RED}PATCH FALTANDO${NC}"
fi

echo -e "\n${GREEN}✅ Diagnóstico Concluído!${NC}"
echo "Se a API estiver offline, reinicie o servidor Go para aplicar as atualizações de backend."
