# 🛠️ Crom Tools

Ferramentas web privadas e de alto desempenho, focadas na filosofia *Local-First*.

## 🏗️ Arquitetura do Ecossistema

O sistema é dividido em três pilares principais:

1.  **Frontend (`tools.crom.run`)**:
    -   Desenvolvido em HTML/JS puro com TailwindCSS.
    -   **Lógica Híbrida**: Prioriza o processamento no navegador (Web Workers, Canvas). Se o arquivo for muito grande ou a tarefa complexa (ex: Markdown para PDF pixel-perfect), delega para a API.

2.  **Backend (`tools-api.crom.run`)**:
    -   Escrito em **Go (Golang)** com framework **Fiber**.
    -   **Browser Pooling**: Mantém uma instância do Chrome Headless (`go-rod`) quente para gerar PDFs instantaneamente.
    -   **Image Processing**: Processamento robusto de imagens (resize/convert) server-side.
    -   **Segurança**: Middleware de Whitelist Dinâmica e CORS restrito.

3.  **CDN Privada (`static.crom.run`)**:
    -   Servida via **Caddy**.
    -   Armazena bibliotecas (Marked.js), ícones e estilos globais com cache agressivo.

---

## 🚀 Como Executar (Modo Desenvolvimento)

### Pré-requisitos
- **Go 1.21+**
- **Google Chrome** ou **Chromium** instalado no servidor (para o `go-rod`).
- **Caddy** (para simular a infraestrutura completa).

### 1. Backend API (Go)
Para iniciar:
```bash
cd crom-tools-api
go mod tidy

# Crie o arquivo de whitelist se não existir
echo "127.0.0.1" > whitelist.txt

# Inicia o servidor na porta 3000
PORT=3000 go run .
```
> **🛑 Para desligar:** Pressione `Ctrl + C` no terminal onde o comando está rodando.

### 2. Frontend e Proxy (Caddy)
O Caddy serve os arquivos estáticos e gerencia o roteamento local.
Para iniciar:
```bash
# Na raiz do projeto
caddy run
```
> **🛑 Para desligar:** Pressione `Ctrl + C` no terminal do Caddy.

#### ⚠️ Dica: Erro "address already in use"
Se o Caddy retornar o erro `bind: address already in use` (geralmente na porta `2019` da API de administração ou nas portas `80/443`), significa que uma instância do Caddy já está rodando em segundo plano. 
Para resolver isso e desligar a instância zumbi, execute:
```bash
caddy stop
```
Após isso, tente rodar `caddy run` novamente.

*Certifique-se de configurar seu `/etc/hosts` para apontar `tools.crom.run`, `static.crom.run` e `tools-api.crom.run` para `127.0.0.1` se estiver testando localmente com o Caddy.*

---

## ⚙️ Configuração

### Variáveis de Ambiente
| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `PORT` | Porta do servidor Go | `3000` |
| `WHITELIST_FILE` | Caminho do arquivo de IPs permitidos | `whitelist.txt` |
| `ALLOWED_IPS` | Lista inicial de IPs (fallback) | `127.0.0.1` |

### Whitelist Dinâmica
O backend monitora o arquivo `whitelist.txt`. Para adicionar um IP sem reiniciar o servidor, basta editar este arquivo:
```txt
127.0.0.1
::1
192.168.1.50
# Comentários são permitidos
```

---

## 🛡️ Segurança

### Content Security Policy (CSP)
O `Caddyfile` aplica headers rigorosos:
- Scripts apenas de origens confiáveis (`self`, `cdn.tailwindcss.com`, `unpkg.com`, `static.crom.run`).
- HSTS ativado (`max-age=31536000`).

### Privacidade
A API foi desenhada para não reter dados. Arquivos processados são enviados via stream diretamente de volta para o cliente, sem persistência em disco (exceto buffers temporários de memória).

---

## 🐧 Deploy no Linux Mint (Produção)

### 1. Serviço Systemd
Crie um serviço para garantir que a API inicie automaticamente:

```ini
# /etc/systemd/system/crom-api.service
[Unit]
Description=Crom Tools API
After=network.target

[Service]
User=seu-usuario
Group=seu-grupo
WorkingDirectory=/caminho/para/crom-ferramentas/crom-tools-api
Environment="PORT=3000"
ExecStart=/usr/local/go/bin/go run .
Restart=always

[Install]
WantedBy=multi-user.target
```

Ative o serviço:
```bash
sudo systemctl enable --now crom-api
```

### 2. Caddy como Proxy Reverso
Instale o Caddy no Mint:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Copie o `Caddyfile` para `/etc/caddy/Caddyfile` e reinicie:
```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

---

## 🔧 Configuração do Frontend (`config.js`)

O arquivo `crom-static/v1/js/core/config.js` define onde o frontend busca a API.

```javascript
window.CromApp.API_BASE = 'http://localhost:3000/v1'; // Dev
// Para produção (com Caddy), use:
// window.CromApp.API_BASE = 'https://tools-api.crom.run/v1';
```

---

## 📂 Estrutura de Pastas

```
.
├── crom-static/        # CDN (JS, CSS, Assets)
│   └── v1/
│       └── js/
│           ├── marked.min.js
│           └── worker-image.js
├── crom-tools-api/     # Backend Go
│   ├── main.go         # Entry point & Config
│   ├── routes.go       # Endpoints (PDF, Imagem)
│   └── middleware.go   # Whitelist & Logging
├── index.html          # Frontend Único (SPA-like)
├── Caddyfile           # Configuração do Proxy
└── README.md           # Documentação
```
