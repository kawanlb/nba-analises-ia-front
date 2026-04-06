import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Loader2, ArrowLeft, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { fetchMatchComparison, fetchAIAnalysis } from "../utils/api";

interface TeamInfo {
  id: number;
  name: string;
  abbreviation: string;
  logo: string;
}

interface Stats {
  points: number;
  points_allowed: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  fg_pct: number;
}

interface Player {
  name: string;
  value?: number;
  percentage?: number;
  made?: number;
}

interface Players {
  points: Player;
  rebounds: Player;
  assists: Player;
  steals: Player;
  blocks: Player;
  turnovers: Player;
  fg_pct: Player;
  fg3_pct: Player;
}

interface Team {
  info: TeamInfo;
  stats: Stats;
  players: Players;
}

interface HeadToHead {
  date: string;
  home_team: TeamInfo;
  away_team: TeamInfo;
  score: {
    home: number;
    away: number;
  };
  winner: string;
}

interface MatchData {
  team1: Team;
  team2: Team;
  head_to_head: HeadToHead[];
}

export function MatchComparison() {
  const { team1Id, team2Id } = useParams();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (team1Id && team2Id) {
      loadMatchData(team1Id, team2Id);
    }
  }, [team1Id, team2Id]);

  async function loadMatchData(t1: string, t2: string) {
    setLoading(true);
    const data = await fetchMatchComparison(t1, t2);
    setMatchData(data);
    setLoading(false);
  }

  async function loadAIAnalysis() {
    if (!team1Id || !team2Id) return;
    
    setLoadingAI(true);
    const analysis = await fetchAIAnalysis(team1Id, team2Id);
    setAiAnalysis(analysis?.analysis || "Análise não disponível no momento.");
    setLoadingAI(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-white text-xl mb-4">Dados não disponíveis</p>
        <Link to="/" className="text-orange-500 hover:text-orange-400">
          ← Voltar para jogos
        </Link>
      </div>
    );
  }

  const { team1, team2, head_to_head } = matchData;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar para jogos
      </Link>

      {/* Teams Comparison */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Team 1 */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <img
                src={team1.info.logo}
                alt={team1.info.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-white">{team1.info.name}</h2>
            <p className="text-gray-400">{team1.info.abbreviation}</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500">VS</div>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <img
                src={team2.info.logo}
                alt={team2.info.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-white">{team2.info.name}</h2>
            <p className="text-gray-400">{team2.info.abbreviation}</p>
          </div>
        </div>

        {/* AI Analysis Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadAIAnalysis}
            disabled={loadingAI}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {loadingAI ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando análise...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Análise com IA
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Análise com IA</h3>
            </div>
            <p className="text-gray-300 whitespace-pre-line">{aiAnalysis}</p>
          </div>
        )}
      </div>

      {/* Stats Comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Team 1 Stats */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Estatísticas - {team1.info.abbreviation}
          </h3>
          <div className="space-y-4">
            <StatRow label="Pontos" value={team1.stats.points} />
            <StatRow label="Pontos Sofridos" value={team1.stats.points_allowed} />
            <StatRow label="Rebotes" value={team1.stats.rebounds} />
            <StatRow label="Assistências" value={team1.stats.assists} />
            <StatRow label="Turnovers" value={team1.stats.turnovers} />
            <StatRow label="FG%" value={`${team1.stats.fg_pct}%`} />
          </div>
        </div>

        {/* Team 2 Stats */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Estatísticas - {team2.info.abbreviation}
          </h3>
          <div className="space-y-4">
            <StatRow label="Pontos" value={team2.stats.points} />
            <StatRow label="Pontos Sofridos" value={team2.stats.points_allowed} />
            <StatRow label="Rebotes" value={team2.stats.rebounds} />
            <StatRow label="Assistências" value={team2.stats.assists} />
            <StatRow label="Turnovers" value={team2.stats.turnovers} />
            <StatRow label="FG%" value={`${team2.stats.fg_pct}%`} />
          </div>
        </div>
      </div>

      {/* Top Players */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Team 1 Players */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Melhores Jogadores - {team1.info.abbreviation}
          </h3>
          <div className="space-y-3">
            <PlayerStat label="Pontos" player={team1.players.points} />
            <PlayerStat label="Rebotes" player={team1.players.rebounds} />
            <PlayerStat label="Assistências" player={team1.players.assists} />
            <PlayerStat label="Roubos de Bola" player={team1.players.steals} />
            <PlayerStat label="Bloqueios" player={team1.players.blocks} />
          </div>
        </div>

        {/* Team 2 Players */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Melhores Jogadores - {team2.info.abbreviation}
          </h3>
          <div className="space-y-3">
            <PlayerStat label="Pontos" player={team2.players.points} />
            <PlayerStat label="Rebotes" player={team2.players.rebounds} />
            <PlayerStat label="Assistências" player={team2.players.assists} />
            <PlayerStat label="Roubos de Bola" player={team2.players.steals} />
            <PlayerStat label="Bloqueios" player={team2.players.blocks} />
          </div>
        </div>
      </div>

      {/* Head to Head */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Histórico de Confrontos (Últimos 5 jogos)
        </h3>
        <div className="space-y-4">
          {head_to_head.map((game, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-gray-400 text-sm">{game.date}</span>
                <div className="flex items-center gap-3">
                  <img
                    src={game.home_team.logo}
                    alt={game.home_team.name}
                    className="w-8 h-8"
                  />
                  <span className="text-white font-medium">
                    {game.home_team.abbreviation}
                  </span>
                </div>
                <span className="text-orange-500 font-bold">
                  {game.score.home} - {game.score.away}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">
                    {game.away_team.abbreviation}
                  </span>
                  <img
                    src={game.away_team.logo}
                    alt={game.away_team.name}
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <div className="ml-4">
                <span className="text-green-400 text-sm font-medium">
                  Vencedor: {game.winner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function PlayerStat({ label, player }: { label: string; player: Player }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-white font-semibold">{player.name}</p>
        </div>
        <div className="text-right">
          <p className="text-orange-500 font-bold text-lg">
            {player.value || player.percentage || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
