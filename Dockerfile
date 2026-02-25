# 🏦 BANQUITO AGENTS - El Banco Pequeñito
# Docker container para desenvolvimento da extensão VS Code

FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache git bash

# Criar usuário banquito com poderes dramáticos
RUN adduser -D -s /bin/bash banquito

# Diretório de trabalho
WORKDIR /home/banquito/workspace

# Copiar arquivos de configuração
COPY package*.json ./
COPY webview-ui/package*.json ./webview-ui/

# Instalar dependências
RUN npm install
RUN cd webview-ui && npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Mudar ownership para usuário banquito
RUN chown -R banquito:banquito /home/banquito

# Trocar para usuário banquito
USER banquito

# Porta para desenvolvimento (se houver web UI futuramente)
EXPOSE 3000

# Comando padrão - modo desenvolvimento
CMD ["npm", "run", "watch"]