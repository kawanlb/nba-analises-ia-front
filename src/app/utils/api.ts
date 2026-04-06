// Em desenvolvimento, /api passa pelo proxy do Vite e evita CORS.
// Se precisar apontar direto para outra API, use VITE_API_URL.
const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

// Mock data for fallback when API is not available
const mockGames = [
  {
    game_id: "0022400001",
    date: "04/03/2026",
    time: "20:00 ET",
    home_team: {
      id: 1610612766,
      name: "Charlotte Hornets",
      logo: "https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg",
    },
    away_team: {
      id: 1610612754,
      name: "Indiana Pacers",
      logo: "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg",
    },
  },
  {
    game_id: "0022400002",
    date: "04/04/2026",
    time: "19:30 ET",
    home_team: {
      id: 1610612747,
      name: "Los Angeles Lakers",
      logo: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg",
    },
    away_team: {
      id: 1610612744,
      name: "Golden State Warriors",
      logo: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg",
    },
  },
  {
    game_id: "0022400003",
    date: "04/05/2026",
    time: "20:30 ET",
    home_team: {
      id: 1610612751,
      name: "Brooklyn Nets",
      logo: "https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg",
    },
    away_team: {
      id: 1610612738,
      name: "Boston Celtics",
      logo: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg",
    },
  },
];

export async function fetchUpcomingGames() {
  try {
    const response = await fetch(`${API_BASE_URL}/games/upcoming`);
    if (!response.ok) throw new Error("Failed to fetch games");
    return await response.json();
  } catch (error) {
    console.warn("API não disponível, usando dados mock:", error);
    return mockGames;
  }
}

export async function fetchMatchComparison(team1Id: string, team2Id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/match/${team1Id}/${team2Id}`);
    if (!response.ok) throw new Error("Failed to fetch match data");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados do confronto:", error);
    // Retorna null para indicar erro - o componente vai mostrar mensagem apropriada
    return null;
  }
}

export async function fetchAIAnalysis(team1Id: string, team2Id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${team1Id}/${team2Id}`);
    if (!response.ok) throw new Error("Failed to fetch AI analysis");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar análise de IA:", error);
    return {
      analysis: "Não foi possível gerar a análise. Certifique-se de que:\n\n1. A API FastAPI está rodando (uvicorn main:app --reload)\n2. O Ollama está instalado e rodando\n3. O modelo llama3:8b foi baixado (ollama run llama3:8b)"
    };
  }
}

export async function fetchTopScorers(
  limit = 15,
): Promise<
  Array<{
    player_id: number;
    name: string;
    team_id: number;
    team: string;
    team_abbreviation: string;
    points: number;
    photo?: string;
  }>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/players/top-scorers?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch top scorers");
    const data = await response.json();
    return data?.top_scorers || [];
  } catch (error) {
    console.error("Erro ao buscar ranking global de jogadores:", error);
    return [];
  }
}