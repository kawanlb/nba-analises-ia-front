# NBA Analytics Frontend

Frontend React para a API de análise de jogos da NBA com IA.

## 🏀 Recursos

- **Jogos Futuros**: Visualize os próximos jogos da NBA
- **Comparação de Times**: Estatísticas detalhadas e histórico de confrontos
- **Análise com IA**: Análise gerada por Ollama sobre o confronto

## 🚀 Como usar

### 1. Configurar a API Backend

Certifique-se de que a API FastAPI está rodando:

```bash
# No diretório do backend
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`

### 2. Configurar URL da API (Opcional)

Se sua API estiver em outro endereço, crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e altere a URL:

```
VITE_API_URL=http://localhost:8000
```

### 3. Endpoints da API

O frontend consome os seguintes endpoints:

- `GET /games/upcoming` - Lista de jogos futuros
- `GET /match/{team1_id}/{team2_id}` - Comparação entre dois times
- `GET /analysis/{team1_id}/{team2_id}` - Análise com IA

### 4. Modo Offline

Se a API não estiver disponível, o frontend mostra dados mock na página inicial para você testar a interface.

## 📋 Requisitos da API

Para que a análise com IA funcione, certifique-se de que:

1. **Ollama está instalado e rodando**
   ```powershell
   # Windows PowerShell
   irm https://ollama.com/install.ps1 | iex
   ```

2. **Modelo llama3:8b foi baixado**
   ```bash
   ollama run llama3:8b
   ```

3. **Dependências Python instaladas**
   ```bash
   pip install fastapi uvicorn nba_api pandas requests
   ```

## 🎨 Funcionalidades

- ✅ Design responsivo e moderno
- ✅ Tema escuro com gradientes NBA
- ✅ Navegação entre páginas com React Router
- ✅ Estatísticas detalhadas de times e jogadores
- ✅ Histórico de confrontos diretos
- ✅ Análise gerada por IA em português
- ✅ Fallback para dados mock quando API offline

## 🔧 Estrutura

```
/src/app
├── App.tsx                    # Componente principal com RouterProvider
├── routes.tsx                 # Configuração de rotas
├── components/
│   └── Layout.tsx             # Layout com header e footer
├── pages/
│   ├── Home.tsx               # Lista de jogos futuros
│   ├── MatchComparison.tsx    # Comparação detalhada
│   └── AIAnalysis.tsx         # Análise com IA
└── utils/
    └── api.ts                 # Funções de chamada da API
```
