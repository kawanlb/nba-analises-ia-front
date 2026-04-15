// Por padrão, o frontend aponta direto para o backend local na porta 8000.
// Use VITE_API_URL para sobrescrever a URL da API em outros ambientes.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
export const TOKEN_KEY = "nba_token";
export const USER_KEY = "nba_user";

export interface TeamSummary {
  id: number;
  name: string;
  abbreviation: string;
  logo: string;
}

export interface ApiGame {
  game_id: string;
  date: string;
  time: string;
  home_team: TeamSummary | null;
  away_team: TeamSummary | null;
}

export interface UpcomingGame extends ApiGame {
  home_team: TeamSummary;
  away_team: TeamSummary;
}

export interface ApiErrorResponse {
  detail?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export interface TeamStats {
  points: number;
  points_allowed: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  fg_pct: number;
}

export interface PlayerLeader {
  name: string;
  value: number;
}

export interface ShootingLeader {
  name: string;
  percentage: number;
  made: number;
}

export interface TeamLeaders {
  points: PlayerLeader;
  rebounds: PlayerLeader;
  assists: PlayerLeader;
  steals: PlayerLeader;
  blocks: PlayerLeader;
  turnovers: PlayerLeader;
  fg_pct: ShootingLeader | null;
  fg3_pct: ShootingLeader | null;
}

export interface TeamFullResponse {
  info: TeamSummary | null;
  stats: TeamStats;
  players: TeamLeaders;
}

export interface GameScore {
  home: number;
  away: number;
}

export interface HeadToHeadGame {
  date: string;
  home_team: TeamSummary | null;
  away_team: TeamSummary | null;
  score: GameScore;
  winner: string;
}

export interface MetricPlayer {
  player_id: number;
  name: string;
  team_id: number;
  team: string;
  team_abbreviation: string;
  value: number;
  photo?: string;
}

export interface TopScorer {
  player_id: number;
  name: string;
  team_id: number;
  team: string;
  team_abbreviation: string;
  points: number;
  photo?: string;
}

export interface TopPlayersByMetric {
  points: MetricPlayer[];
  rebounds: MetricPlayer[];
  assists: MetricPlayer[];
  steals: MetricPlayer[];
  blocks: MetricPlayer[];
  turnovers: MetricPlayer[];
}

export interface MatchComparisonResponse {
  team1: TeamFullResponse;
  team2: TeamFullResponse;
  head_to_head: HeadToHeadGame[];
  top_scorers: TopScorer[];
  top_players: TopPlayersByMetric;
}

export interface AnalysisResponse {
  analysis: string;
}

interface ApiFetchOptions {
  authenticated?: boolean;
  retries?: number;
  timeoutMs?: number;
}

type TopPlayersResponseShape =
  | TopPlayersByMetric
  | { top_players?: TopPlayersByMetric | MetricPlayer[] }
  | { top_players_by_metric?: TopPlayersByMetric }
  | MetricPlayer[];

type TopScorersResponseShape =
  | { top_scorers?: TopScorer[] }
  | { scorers?: TopScorer[] }
  | TopScorer[];

type HistoryResponseShape =
  | { history?: HeadToHeadGame[] }
  | { head_to_head?: HeadToHeadGame[] }
  | { games?: HeadToHeadGame[] }
  | HeadToHeadGame[];

type TeamResponseShape =
  | TeamFullResponse
  | { team?: TeamFullResponse }
  | { data?: TeamFullResponse };

function isUpcomingGame(game: ApiGame): game is UpcomingGame {
  return Boolean(game.home_team && game.away_team);
}

function parseTimeout(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const API_REQUEST_TIMEOUT_MS = parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS, 15000);
export const API_STATUS_TIMEOUT_MS = parseTimeout(
  import.meta.env.VITE_API_STATUS_TIMEOUT_MS,
  API_REQUEST_TIMEOUT_MS,
);

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function createRequestSignal(timeoutMs: number, signal?: AbortSignal | null) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  if (!signal) {
    return timeoutSignal;
  }

  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([signal, timeoutSignal]);
  }

  return signal;
}

function formatDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toSortableGameTimestamp(game: Pick<UpcomingGame, "date" | "time">) {
  const timeMatch = game.time.match(/^(\d{1,2}):(\d{2})\s*([AP]M)(?:\s*[A-Z]{2,4})?$/i);
  if (!timeMatch) {
    return `${game.date}T99:99:00`;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  if (period === "PM" && hours < 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const normalizedHours = String(hours).padStart(2, "0");
  const normalizedMinutes = String(minutes).padStart(2, "0");
  return `${game.date}T${normalizedHours}:${normalizedMinutes}:00`;
}

export function getUpcomingGamesDates(days = 3) {
  return Array.from({ length: days }, (_, index) => {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + index);
    return formatDateParam(nextDate);
  });
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function parseApiError(response: Response, fallback: string) {
  const errorBody = (await response.json().catch(() => null)) as ApiErrorResponse | null;
  return typeof errorBody?.detail === "string" && errorBody.detail.trim() ? errorBody.detail : fallback;
}

function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(
  url: string,
  init?: RequestInit,
  options?: ApiFetchOptions,
): Promise<Response> {
  const { authenticated = true, retries = 0, timeoutMs = API_REQUEST_TIMEOUT_MS } = options || {};
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...(authenticated ? authHeaders() : {}),
          ...init?.headers,
        },
        signal: createRequestSignal(timeoutMs, init?.signal),
      });

      if (authenticated && response.status === 401) {
        clearStoredAuth();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await wait(250 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

export async function fetchGamesByDate(date: string): Promise<UpcomingGame[]> {
  const response = await apiFetch(`${API_BASE_URL}/games?date=${encodeURIComponent(date)}`, undefined, {
    retries: 1,
  });
  if (!response.ok) {
    throw new Error(await parseApiError(response, `Failed to fetch games for ${date}`));
  }

  const data: ApiGame[] = await response.json();
  return Array.isArray(data) ? data.filter(isUpcomingGame) : [];
}

export async function fetchUpcomingGames(): Promise<UpcomingGame[]> {
  const dates = getUpcomingGamesDates();
  const responses: UpcomingGame[][] = [];

  for (const date of dates) {
    responses.push(await fetchGamesByDate(date));
  }

  return responses
    .flat()
    .sort((left, right) => {
      const leftDate = toSortableGameTimestamp(left);
      const rightDate = toSortableGameTimestamp(right);
      return leftDate.localeCompare(rightDate);
    });
}

export async function fetchMatchComparison(team1Id: string, team2Id: string) {
  try {
    const [team1, team2, headToHead, topScorers, topPlayers] = await Promise.all([
      fetchTeamDetails(team1Id),
      fetchTeamDetails(team2Id),
      fetchMatchupHistory(team1Id, team2Id),
      fetchMatchupTopScorers(team1Id, team2Id, 15),
      fetchMatchupTopPlayers(team1Id, team2Id, 10),
    ]);

    return {
      team1,
      team2,
      head_to_head: headToHead,
      top_scorers: topScorers,
      top_players: topPlayers,
    } satisfies MatchComparisonResponse;
  } catch (error) {
    console.error("Erro ao buscar dados do confronto:", error);
    return null;
  }
}

export async function fetchAIAnalysis(team1Id: string, team2Id: string) {
  try {
    const response = await apiFetch(`${API_BASE_URL}/analysis/${team1Id}/${team2Id}`, undefined, {
      retries: 1,
    });
    if (!response.ok) {
      throw new Error(await parseApiError(response, "Failed to fetch AI analysis"));
    }
    return (await response.json()) as AnalysisResponse;
  } catch (error) {
    console.error("Erro ao buscar análise de IA:", error);
    return {
      analysis: "Não foi possível gerar a análise no momento. Verifique se a API FastAPI está rodando e se o serviço de análise configurado no backend está disponível.",
    };
  }
}

export async function fetchTopScorers(limit = 15): Promise<TopScorer[]> {
  try {
    const response = await apiFetch(`${API_BASE_URL}/players/top-scorers?limit=${limit}`, undefined, {
      retries: 1,
    });
    if (!response.ok) {
      throw new Error(await parseApiError(response, "Failed to fetch top scorers"));
    }
    const data = await response.json();
    return Array.isArray(data?.top_scorers) ? data.top_scorers : [];
  } catch (error) {
    console.error("Erro ao buscar ranking global de jogadores:", error);
    return [];
  }
}

async function fetchTeamDetails(teamId: string): Promise<TeamFullResponse> {
  const response = await apiFetch(`${API_BASE_URL}/teams/${teamId}`, undefined, {
    retries: 1,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, `Failed to fetch team ${teamId}`));
  }

  const data = (await response.json()) as TeamResponseShape;
  return normalizeTeamResponse(data);
}

async function fetchMatchupHistory(team1Id: string, team2Id: string): Promise<HeadToHeadGame[]> {
  const response = await apiFetch(`${API_BASE_URL}/matchups/${team1Id}/${team2Id}/history`, undefined, {
    retries: 1,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Failed to fetch matchup history"));
  }

  const data = (await response.json()) as HistoryResponseShape;
  return normalizeHistoryResponse(data);
}

async function fetchMatchupTopScorers(
  team1Id: string,
  team2Id: string,
  limit: number,
): Promise<TopScorer[]> {
  const response = await apiFetch(
    `${API_BASE_URL}/matchups/${team1Id}/${team2Id}/top-scorers?limit=${limit}`,
    undefined,
    { retries: 1 },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Failed to fetch matchup top scorers"));
  }

  const data = (await response.json()) as TopScorersResponseShape;
  return normalizeTopScorersResponse(data);
}

async function fetchMatchupTopPlayers(
  team1Id: string,
  team2Id: string,
  limit: number,
): Promise<TopPlayersByMetric> {
  const response = await apiFetch(
    `${API_BASE_URL}/matchups/${team1Id}/${team2Id}/top-players?limit=${limit}`,
    undefined,
    { retries: 1 },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Failed to fetch matchup top players"));
  }

  const data = (await response.json()) as TopPlayersResponseShape;
  return normalizeTopPlayersResponse(data);
}

function normalizeTeamResponse(data: TeamResponseShape): TeamFullResponse {
  if (isTeamFullResponse(data)) {
    return data;
  }

  if ("team" in data && isTeamFullResponse(data.team)) {
    return data.team;
  }

  if ("data" in data && isTeamFullResponse(data.data)) {
    return data.data;
  }

  throw new Error("Unexpected team response shape");
}

function normalizeHistoryResponse(data: HistoryResponseShape): HeadToHeadGame[] {
  if (Array.isArray(data)) {
    return data;
  }

  if ("history" in data && Array.isArray(data.history)) {
    return data.history;
  }

  if ("head_to_head" in data && Array.isArray(data.head_to_head)) {
    return data.head_to_head;
  }

  if ("games" in data && Array.isArray(data.games)) {
    return data.games;
  }

  return [];
}

function normalizeTopScorersResponse(data: TopScorersResponseShape): TopScorer[] {
  if (Array.isArray(data)) {
    return data;
  }

  if ("top_scorers" in data && Array.isArray(data.top_scorers)) {
    return data.top_scorers;
  }

  if ("scorers" in data && Array.isArray(data.scorers)) {
    return data.scorers;
  }

  return [];
}

function normalizeTopPlayersResponse(data: TopPlayersResponseShape): TopPlayersByMetric {
  const empty = createEmptyTopPlayers();

  if (Array.isArray(data)) {
    return groupMetricPlayers(data);
  }

  if (isTopPlayersByMetric(data)) {
    return data;
  }

  if ("top_players" in data && isTopPlayersByMetric(data.top_players)) {
    return data.top_players;
  }

  if ("top_players" in data && Array.isArray(data.top_players)) {
    return groupMetricPlayers(data.top_players);
  }

  if ("top_players_by_metric" in data && isTopPlayersByMetric(data.top_players_by_metric)) {
    return data.top_players_by_metric;
  }

  return empty;
}

function groupMetricPlayers(players: Array<MetricPlayer & { metric?: string }>): TopPlayersByMetric {
  const grouped = createEmptyTopPlayers();

  for (const player of players) {
    const metric = normalizeMetricKey(player.metric);
    if (!metric) {
      continue;
    }
    grouped[metric].push(player);
  }

  return grouped;
}

function normalizeMetricKey(metric: string | undefined): keyof TopPlayersByMetric | null {
  switch (metric) {
    case "points":
    case "rebounds":
    case "assists":
    case "steals":
    case "blocks":
    case "turnovers":
      return metric;
    default:
      return null;
  }
}

function createEmptyTopPlayers(): TopPlayersByMetric {
  return {
    points: [],
    rebounds: [],
    assists: [],
    steals: [],
    blocks: [],
    turnovers: [],
  };
}

function isTopPlayersByMetric(value: unknown): value is TopPlayersByMetric {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TopPlayersByMetric>;
  return (
    Array.isArray(candidate.points) &&
    Array.isArray(candidate.rebounds) &&
    Array.isArray(candidate.assists) &&
    Array.isArray(candidate.steals) &&
    Array.isArray(candidate.blocks) &&
    Array.isArray(candidate.turnovers)
  );
}

function isTeamFullResponse(value: unknown): value is TeamFullResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TeamFullResponse>;
  return Boolean(candidate.stats && candidate.players && "info" in candidate);
}