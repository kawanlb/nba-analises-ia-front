# NBA Analises IA — Frontend

Interface web desenvolvida em React para apresentar jogos da NBA, comparar equipes e exibir análises geradas por IA.

## Visão do projeto

O frontend foi criado para transformar os dados do backend em uma interface visual clara, responsiva e fácil de usar. A proposta é permitir que o usuário acompanhe jogos futuros, compare times e consulte estatísticas importantes de forma organizada.

## Objetivo

A aplicação tem como objetivo principal apresentar informações esportivas de forma didática e visualmente agradável, oferecendo:

- lista de jogos futuros
- jogo em destaque
- comparação entre equipes
- estatísticas e histórico de confrontos
- jogadores com melhor desempenho
- análise textual com IA

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Funcionalidades principais

### Página inicial
A tela inicial exibe:
- jogos futuros da NBA
- card de destaque do próximo confronto
- lista dos principais jogadores por pontuação
- explicação resumida sobre o sistema

### Página de comparação
A tela de comparação organiza os dados em seções:
- Estatísticas
- Jogadores
- H2H
- Análise IA
- Sobre

### Tema visual
A interface suporta modo claro e escuro, com foco em contraste, legibilidade e adaptação a telas grandes e pequenas.

## Integração com o backend

O frontend consome a API FastAPI por meio dos endpoints:

- `GET /games?date=YYYY-MM-DD`
- `GET /teams/{team_id}`
- `GET /matchups/{team1_id}/{team2_id}/history`
- `GET /matchups/{team1_id}/{team2_id}/top-scorers?limit=15`
- `GET /matchups/{team1_id}/{team2_id}/top-players?limit=10`
- `GET /analysis/{team1_id}/{team2_id}`
- `GET /players/top-scorers?limit=15`
- `POST /auth/login`
- `POST /auth/register`

Na página inicial, o frontend agrega três chamadas autenticadas para `GET /games`, cobrindo hoje e os próximos dois dias.

## Estrutura principal

- `src/app/components` — componentes reutilizáveis
- `src/app/pages` — páginas principais da aplicação
- `src/app/utils` — funções auxiliares e chamadas de API
- `src/styles` — estilos globais e tema visual

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a API

O projeto agora usa `.env` para definir a URL do backend. O arquivo padrão fica assim:

```bash
VITE_API_URL=http://127.0.0.1:8000
VITE_API_TIMEOUT_MS=15000
VITE_API_STATUS_TIMEOUT_MS=15000
```

Se o backend estiver em outro endereço, ajuste `VITE_API_URL` no `.env`.

Use `VITE_API_STATUS_TIMEOUT_MS` para ajustar a tolerancia da verificacao de disponibilidade. Isso evita marcar a API como offline quando ela responde com sucesso, mas demora mais de 5 segundos.

As rotas protegidas exigem bearer token. O cadastro já retorna token e autentica o usuário automaticamente.

### 3. Iniciar o frontend

```bash
npm run dev
```

## Requisitos do sistema

Para funcionar completamente, o projeto depende de:

- backend FastAPI rodando
- Ollama instalado
- modelo `llama3:8b` carregado
- dependências Python instaladas no backend

## Resultado esperado

Ao abrir a aplicação, o usuário consegue navegar por jogos da NBA, comparar times, visualizar estatísticas e consultar análises de forma clara e organizada.

## Observações

- O projeto foi desenvolvido com foco em apresentação acadêmica e demonstração de integração entre frontend, backend e IA.
- O layout foi pensado para funcionar bem em monitores grandes, mantendo boa usabilidade em telas menores.
