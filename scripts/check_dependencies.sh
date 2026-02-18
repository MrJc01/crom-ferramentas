#!/bin/bash
# Check critical system binaries

FAIL=0

check_cmd() {
    if command -v "$1" >/dev/null 2>&1; then
        if [ "$1" == "go" ]; then
            echo "  [OK] $1 está instalado ($( $1 version 2>&1 | head -n 1 ))"
        else
            echo "  [OK] $1 está instalado ($( $1 --version 2>&1 | head -n 1 ))"
        fi
    else
        echo "  [ERRO] $1 NÃO encontrado."
        FAIL=1
    fi
}

check_cmd go
check_cmd ffmpeg
check_cmd tesseract
check_cmd curl

if [ $FAIL -eq 0 ]; then
    exit 0
else
    exit 1
fi
