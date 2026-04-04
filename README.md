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

# Exemplos de resposta

## Exemplo /games/upcoming

Resposta:

```bash
  {
    "game_id": "0022400001",
    "date": "04/03/2026",
    "time": "20:00 ET",
    "home_team": {
      "id": 1610612766,
      "name": "Charlotte Hornets",
      "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
    },
    "away_team": {
      "id": 1610612754,
      "name": "Indiana Pacers",
      "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
    }
  },
]
```

## Exemplo /match/{team1_id}/{team2_id}

Resposta:
```bash
{
    "team1": {
        "info": {
            "id": 1610612766,
            "name": "Charlotte Hornets",
            "abbreviation": "CHA",
            "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
        },
        "stats": {
            "points": 116.2,
            "points_allowed": 111.4,
            "rebounds": 46.2,
            "assists": 26.4,
            "turnovers": 15.5,
            "fg_pct": 46.1
        },
        "players": {
            "points": {
                "name": "Brandon Miller",
                "value": 20.4
            },
            "rebounds": {
                "name": "Moussa Diabaté",
                "value": 8.8
            },
            "assists": {
                "name": "LaMelo Ball",
                "value": 7.1
            },
            "steals": {
                "name": "LaMelo Ball",
                "value": 1.2
            },
            "blocks": {
                "name": "Ryan Kalkbrenner",
                "value": 1.5
            },
            "turnovers": {
                "name": "LaMelo Ball",
                "value": 2.7
            },
            "fg_pct": {
                "name": "Kon Knueppel",
                "percentage": 48.2,
                "made": 6.4
            },
            "fg3_pct": {
                "name": "Kon Knueppel",
                "percentage": 43.1,
                "made": 3.4
            }
        }
    },
    "team2": {
        "info": {
            "id": 1610612754,
            "name": "Indiana Pacers",
            "abbreviation": "IND",
            "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
        },
        "stats": {
            "points": 112.6,
            "points_allowed": 120.7,
            "rebounds": 41.7,
            "assists": 27.5,
            "turnovers": 14.4,
            "fg_pct": 45.9
        },
        "players": {
            "points": {
                "name": "Pascal Siakam",
                "value": 23.9
            },
            "rebounds": {
                "name": "Ivica Zubac",
                "value": 10.6
            },
            "assists": {
                "name": "Andrew Nembhard",
                "value": 7.7
            },
            "steals": {
                "name": "Jalen Slawson",
                "value": 1.4
            },
            "blocks": {
                "name": "Jay Huff",
                "value": 1.8
            },
            "turnovers": {
                "name": "Andrew Nembhard",
                "value": 2.4
            },
            "fg_pct": {
                "name": "Pascal Siakam",
                "percentage": 48.3,
                "made": 9.0
            },
            "fg3_pct": {
                "name": "Aaron Nesmith",
                "percentage": 37.9,
                "made": 2.3
            }
        }
    },
    "head_to_head": [
        {
            "date": "2026-04-03",
            "home_team": {
                "id": 1610612766,
                "name": "Charlotte Hornets",
                "abbreviation": "CHA",
                "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
            },
            "away_team": {
                "id": 1610612754,
                "name": "Indiana Pacers",
                "abbreviation": "IND",
                "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
            },
            "score": {
                "home": 25,
                "away": 11
            },
            "winner": "Indiana Pacers"
        },
        {
            "date": "2026-02-26",
            "home_team": {
                "id": 1610612754,
                "name": "Indiana Pacers",
                "abbreviation": "IND",
                "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
            },
            "away_team": {
                "id": 1610612766,
                "name": "Charlotte Hornets",
                "abbreviation": "CHA",
                "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
            },
            "score": {
                "home": 109,
                "away": 133
            },
            "winner": "Charlotte Hornets"
        },
        {
            "date": "2026-01-08",
            "home_team": {
                "id": 1610612766,
                "name": "Charlotte Hornets",
                "abbreviation": "CHA",
                "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
            },
            "away_team": {
                "id": 1610612754,
                "name": "Indiana Pacers",
                "abbreviation": "IND",
                "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
            },
            "score": {
                "home": 112,
                "away": 114
            },
            "winner": "Indiana Pacers"
        },
        {
            "date": "2025-11-19",
            "home_team": {
                "id": 1610612754,
                "name": "Indiana Pacers",
                "abbreviation": "IND",
                "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
            },
            "away_team": {
                "id": 1610612766,
                "name": "Charlotte Hornets",
                "abbreviation": "CHA",
                "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
            },
            "score": {
                "home": 127,
                "away": 118
            },
            "winner": "Indiana Pacers"
        },
        {
            "date": "2025-04-02",
            "home_team": {
                "id": 1610612754,
                "name": "Indiana Pacers",
                "abbreviation": "IND",
                "logo": "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"
            },
            "away_team": {
                "id": 1610612766,
                "name": "Charlotte Hornets",
                "abbreviation": "CHA",
                "logo": "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg"
            },
            "score": {
                "home": 119,
                "away": 105
            },
            "winner": "Indiana Pacers"
        }
    ]
}
```