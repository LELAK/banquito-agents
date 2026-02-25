# 🏦 BANQUITO AGENTS - El Banco Pequeñito

**¡Ay, Dios Mío!** Uma extensão VS Code que transforma teus agentes Claude Code em banqueiros mexicanos dramáticos numa agência bancária pixel art!

![Banquito Logo](icon.png)

## 🎭 O QUE É ISSO?

O **Banquito** é uma versão temática do Pixel Agents onde:

- 👨‍💼 **Cada agent Claude Code vira um banqueiro mexicano** com bigode e drama
- 🏦 **Escritório vira uma agência bancária** com caixas, cofres e balcões  
- 💰 **Animações temáticas:** contando dinheiro, carimbando documentos, suspirando dramaticamente
- 🎵 **Sons de telenovela:** violões, suspiros e gritos de "¡Ay, Dios Mío!"
- 📊 **Status banking:** "Aprovando empréstimo", "Negando crédito", "Esperando cliente"

## 🚀 COMO USAR

### Instalação
```bash
git clone https://github.com/LELAK/banquito-agents.git
cd banquito-agents
npm install
cd webview-ui && npm install && cd ..
npm run build
```

### No VS Code
1. Pressionar **F5** para abrir Extension Development Host
2. Abrir o painel **"🏦 BANQUITO - El Banco Pequeñito"**
3. Clicar **"+ Banqueiro"** para spawnar um Claude Code terminal
4. Ver teu agent virar um banqueiro dramático! 🎭

### 🐳 Com Docker (Desenvolvimento)
```bash
# Levantar container de desenvolvimento
docker-compose up -d

# Entrar no container pra desenvolvimento
docker-compose exec banquito bash

# Build inside container
npm run build

# Modo watch para hot reload
npm run watch
```

### 🏗️ Deploy Production
```bash
# Build production
docker build -t banquito-agents:latest .

# Run container
docker run -d --name banquito-production banquito-agents:latest
```

## 🎨 FEATURES TEMÁTICAS

### 👨‍🦲 Personagens
- **Don Roberto** - Gerente dramático (bigode grande)
- **Doña Carmen** - Caixa apaixonada (lenço na cabeça)
- **Panchito** - Assistente jovem (óculos redondos)
- **La Jefa** - Diretora poderosa (óculos de sol)

### 🏦 Cenários
- **Balcão de atendimento** com cofres antigos
- **Mesa do gerente** com plantas e quadros
- **Sala de espera** com poltronas vermelhas
- **Cofre principal** onde os agents "guardam código"

### 🎵 Sons & Efeitos
- Som de máquina de escrever ao coding
- Violão mexicano quando agent termina tarefa
- "¡Ay, Dios Mío!" quando da erro
- Suspiro dramático quando agent espera

## 🛠️ DESENVOLVIMENTO

### Stack
- **Extension:** TypeScript + VS Code Webview API
- **Frontend:** React + Canvas 2D + Tema Mexicano
- **Build:** esbuild + Vite
- **Theme:** Cores vermelho paixão + dourado

### Scripts
```bash
npm run build     # Build completo
npm run watch     # Development watch
npm run lint      # ESLint check
```

## 🎭 EASTER EGGS

- **Modo Telenovela:** Ativar com Ctrl+Alt+T para máximo drama
- **Frases aleatórias:** "¡Que dios bendiga este código!", "¡Por amor al dinero!"
- **Animação especial:** Agent "chora" quando código tem erro

## 📝 ROADMAP

- [ ] Modo "Crisis Financiera" (tema escuro dramático)
- [ ] Personagens extras: Contador, Segurança, Cliente Irritado  
- [ ] Som ambiente: mariachi de fundo
- [ ] Integration com sistema bancário fake (PIX do coração)

## 🤝 CONTRIBUIR

Este é um projeto **experimental/divertido** da LELAK LLC.

Base original: [Pixel Agents](https://github.com/pablodelucca/pixel-agents) por Pablo De Lucca

## ⚖️ LICENÇA

MIT License - Fork com amor e drama! 💕

---

**"¡El banco más pequeño... pero con los sueños más grandes!"**

*- Slogan oficial do Banquito* 🎭🏦