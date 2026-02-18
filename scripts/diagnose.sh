#!/bin/bash
# ------------------------------------------------------------------
# [Author] Crom 1000 Specialists System
# [Description] Master Diagnostic Script (The "General Surgeon")
# ------------------------------------------------------------------

echo "🔍 Iniciando Diagnóstico de Sistema Completo (Crom-Ferramentas)..."
echo "=========================================================="

# 1. Environment Check
echo ""
echo "🛠️  [1/4] Verificando Dependências de Sistema (DevOps)..."
if ./scripts/check_dependencies.sh; then
    echo "✅ Dependências OK."
else
    echo "❌ FALHA nas Dependências."
fi

# 2. Backend API Check
echo ""
echo "📡 [2/4] Testando Backend API (SRE)..."
if ./scripts/test_backend.sh; then
    echo "✅ Backend Respondendo."
else
    echo "⚠️  Backend parece offline ou com erro."
fi

# 3. Static Assets Check
echo ""
echo "🎨 [3/4] Verificando Assets Frontend (Frontend Ops)..."
if ./scripts/test_frontend_assets.sh; then
    echo "✅ Arquivos Estáticos Encontrados."
else
    echo "❌ Faltam arquivos estáticos críticos."
fi

echo ""
echo "=========================================================="
echo "🏁 Diagnóstico Concluído."
