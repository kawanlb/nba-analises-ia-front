# NBA Analises IA Front

Aplicacao front-end para visualizar jogos da NBA, comparar dois times e exibir analise textual gerada por IA.

## Stack

- React 18
- Vite 6
- TypeScript
- Tailwind CSS
- Componentes Radix UI

## Requisitos

- Node.js 18+
- npm 9+

## Instalar dependencias

```bash
npm install
```

## Rodar em desenvolvimento

```bash
npm run dev
```

Por padrao, o front usa `/api` como base das requisicoes.

## Configurar URL da API (opcional)

Se a API estiver em outro host/porta, crie um arquivo `.env` na raiz com:

```bash
VITE_API_URL=http://127.0.0.1:8000
```

## Build de producao

```bash
npm run build
```

## Rotas da aplicacao

- `/` lista de proximos jogos
- `/match/:team1Id/:team2Id` comparacao entre times
- `/analysis/:team1Id/:team2Id` analise textual do confronto

## Observacoes

- Este repositorio contem apenas o front-end.
- Se a API estiver indisponivel, a tela inicial utiliza dados mock para exibicao basica.
