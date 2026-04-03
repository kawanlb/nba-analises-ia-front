API em FastAPI que retorna dados de times da NBA e uma análise gerada por IA sobre o confronto entre dois times.

# Instalação
## 1. Instalar Ollama

No PowerShell:

```bash 
irm https://ollama.com/install.ps1 | iex
```
## 2. Baixar modelo
```bash 
ollama run llama3:8b
```

## 3. Instalar dependências Python
```bash 
pip install fastapi uvicorn nba_api pandas requests
```
## Rodar o projeto
```bash 
uvicorn main:app --reload
```

# Endpoints
## Jogos futuros
GET /games/upcoming

Retorna os próximos jogos com times, data, horário e logos.

## Dados do confronto
GET /match/{team1_id}/{team2_id}

Retorna:

- informações dos times
- estatísticas por jogo
- melhores jogadores
- histórico de confrontos (últimos 5 jogos)
## Análise com IA
GET /analysis/{team1_id}/{team2_id}

Retorna uma análise simples do confronto com:

- quem está melhor no geral
- vantagens de cada time
- palpite de vencedor