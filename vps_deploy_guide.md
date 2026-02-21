# 🚀 Deploy VPS Profissional: Frontend Desacoplado & Backend Go

Esta estratégia ensina como colocar em produção as Ferramentas usando o **`index.html` em um local (CDN/S3/Vercel/Hostinger Compartilhado)** e referenciando o **backend em uma VPS (ex: Hetzner, DigitalOcean) isolada.**

## 1. Arquitetura da Solução

- **Camada Apresentação (Frontend):** Viverá em um Storage Cloud Flare Pages, Vercel ou na public_html da sua hospedagem convencional. Os statics (`crom-static`) deverão ser acessíveis publicamente o mais rápido possível através da borda (CDN).
- **Camada Motor de Backend (VPS):** O Golang correrá atrás de um **Reverse Proxy (Nginx ou Caddy)**. Esse servidor tem um único dever: aceitar conexões REST do frontend, blindadas por CORS, rodando pesado em Background (OCR, Conversões de mídia massivas).

## 2. Configurando o Servidor Backend (Sua VPS Ubuntu/Debian)

### A. Preparando e Isolando o Ambiente
```bash
# Atualize a VPS e instale dependências do Backend (OCR, Exiftool, etc)
sudo apt update && sudo apt upgrade -y
sudo apt install tesseract-ocr exiftool -y

# Mova o Binário Compilado e suba via Systemd
# Exemplo de unit do systemd (/etc/systemd/system/crom-backend.service)
[Unit]
Description=Crom Tools Go API Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/crom-backend
ExecStart=/var/www/crom-backend/api-binary
Restart=always

[Install]
WantedBy=multi-user.target
```
Habilite o serviço: `sudo systemctl enable --now crom-backend`

### B. Configuração do Reverse Proxy (NGINX + Gerenciamento de CORS)
Não exponha a porta `3000` (ou `8080`) bruta para a internet. Coloque o Nginx na frente, adicione HTTPS (Let's Encrypt) e libere acesso **APENAS** vindo do Domínio original e hospedagem do seu index.html.

Arquivo de configuração `/etc/nginx/sites-available/api.crom.run`:
```nginx
server {
    listen 80;
    server_name api.seudominio.com; # Este será linkado na VPS

    location / {
        # Regras Estritas de CORS para proteção da VPS
        add_header 'Access-Control-Allow-Origin' 'https://ferramentas.seudominio.com' always; # COLOQUE O LOCAL DO SEU HTML AQUI
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
        
        # Responda Pre-Flights rápido
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://ferramentas.seudominio.com' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # Repasse ao Go Backend rodando internamente
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 3. Parametrizando o Frontend (index.html em outro lugar)

No arquivo **`crom-static/v1/js/core/config.js`**, vá até o Objeto Configuration API:
Altere de "Localhost" para a VPS com certificado de segurança em pé:

```javascript
window.CromApp = window.CromApp || {};
window.CromApp.services = {
    backend: {
        enabled: true,
        url: 'https://api.seudominio.com' // Aponta para a VPS 
    }
}
```

## 4. Segurança e Hardening Inevitáveis 🛡️

1. **Firewall Limite:** Use UFW na VPS para bloquear porta 8080.
   `sudo ufw allow 'Nginx Full'`
   `sudo ufw deny 8080`
2. **Worker Isolation:** Para ferramentas que executam C++ compilado no WASM ou chamam shell local do Go, rode-as sob perfil `nobody` e isole com limites de memoria do Systemd (`MemoryLimit=1G`).
3. **Cache Policy:** Na sua hospedagem front end, faça os scripts `js` e `css` terem Cache Imutável via Headers, deixando só o `index.html` em rede valida constante.

Tudo pronto. Seu código do `index.html` consumirá silenciosamente a API distante da VPS, sem gargalos de CPU no front do seu Host principal.
