#!/bin/bash
# Check for static files

STATIC_DIR="./crom-static/v1/js"
VENDOR_DIR="$STATIC_DIR/vendor"

FAIL=0

check_file() {
    if [ -f "$1" ]; then
        echo "  [OK] $1 existe."
    else
        echo "  [ERRO] Arquivo CRÍTICO ausente: $1"
        FAIL=1
    fi
}

check_file "$STATIC_DIR/worker-image.js"
check_file "$STATIC_DIR/marked.min.js"
check_file "$VENDOR_DIR/tailwind.js"
check_file "$VENDOR_DIR/lucide.min.js"

if [ $FAIL -eq 0 ]; then
    exit 0
else
    exit 1
fi
