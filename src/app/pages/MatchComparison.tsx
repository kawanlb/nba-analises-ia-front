import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Loader2, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
            Dados não disponíveis
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
            Não foi possível carregar os dados deste confronto
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            <ArrowLeft size={18} />
            Voltar para jogos
          </Link>
        </div>
      </div>
    );
  }

  const { team1, team2, head_to_head } = matchData;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        Voltar
      </Link>

      {/* Teams Header */}
      <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6 transition-colors">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Team 1 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <img
                src={team1.info.logo}
                alt={team1.info.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{team1.info.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{team1.info.abbreviation}</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">VS</div>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <img
                src={team2.info.logo}
                alt={team2.info.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{team2.info.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{team2.info.abbreviation}</p>
          </div>
        </div>

        {/* AI Analysis Button */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <button
            onClick={loadAIAnalysis}
            disabled={loadingAI}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 font-medium shadow-sm"
          >
            {loadingAI ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando análise com IA...
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
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">Análise com IA</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm transition-colors">
              {aiAnalysis}
            </p>
          </div>
        )}
      </div>

      {/* Stats Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Team 1 Stats */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
            <img src={team1.info.logo} alt="" className="w-8 h-8" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
              Estatísticas - {team1.info.abbreviation}
            </h3>
          </div>
          <div className="space-y-4">
            <StatRow label="Pontos por jogo" value={team1.stats.points.toFixed(1)} />
            <StatRow label="Pontos sofridos" value={team1.stats.points_allowed.toFixed(1)} />
            <StatRow label="Rebotes" value={team1.stats.rebounds.toFixed(1)} />
            <StatRow label="Assistências" value={team1.stats.assists.toFixed(1)} />
            <StatRow label="Turnovers" value={team1.stats.turnovers.toFixed(1)} />
            <StatRow label="FG%" value={`${team1.stats.fg_pct.toFixed(1)}%`} />
          </div>
        </div>

        {/* Team 2 Stats */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
            <img src={team2.info.logo} alt="" className="w-8 h-8" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
              Estatísticas - {team2.info.abbreviation}
            </h3>
          </div>
          <div className="space-y-4">
            <StatRow label="Pontos por jogo" value={team2.stats.points.toFixed(1)} />
            <StatRow label="Pontos sofridos" value={team2.stats.points_allowed.toFixed(1)} />
            <StatRow label="Rebotes" value={team2.stats.rebounds.toFixed(1)} />
            <StatRow label="Assistências" value={team2.stats.assists.toFixed(1)} />
            <StatRow label="Turnovers" value={team2.stats.turnovers.toFixed(1)} />
            <StatRow label="FG%" value={`${team2.stats.fg_pct.toFixed(1)}%`} />
          </div>
        </div>
      </div>

      {/* Top Players */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Team 1 Players */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
              Melhores Jogadores - {team1.info.abbreviation}
            </h3>
          </div>
          <div className="space-y-3">
            <PlayerStat label="Pontos" player={team1.players.points} />
            <PlayerStat label="Rebotes" player={team1.players.rebounds} />
            <PlayerStat label="Assistências" player={team1.players.assists} />
            <PlayerStat label="Roubos" player={team1.players.steals} />
            <PlayerStat label="Bloqueios" player={team1.players.blocks} />
          </div>
        </div>

        {/* Team 2 Players */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
              Melhores Jogadores - {team2.info.abbreviation}
            </h3>
          </div>
          <div className="space-y-3">
            <PlayerStat label="Pontos" player={team2.players.points} />
            <PlayerStat label="Rebotes" player={team2.players.rebounds} />
            <PlayerStat label="Assistências" player={team2.players.assists} />
            <PlayerStat label="Roubos" player={team2.players.steals} />
            <PlayerStat label="Bloqueios" player={team2.players.blocks} />
          </div>
        </div>
      </div>

      {/* Head to Head */}
      <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 pb-4 border-b border-gray-200 dark:border-gray-800 transition-colors">
          Histórico de Confrontos
        </h3>
        <div className="space-y-3">
          {head_to_head.map((game, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {new Date(game.date).toLocaleDateString('pt-BR')}
                </span>
                
                <div className="flex items-center gap-4 flex-1 justify-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={game.home_team.logo}
                      alt={game.home_team.name}
                      className="w-6 h-6"
                    />
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">
                      {game.home_team.abbreviation}
                    </span>
                  </div>
                  
                  <div className="px-4 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                    <span className={`font-bold text-sm ${game.score.home > game.score.away ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {game.score.home}
                    </span>
                    <span className="text-gray-400 dark:text-gray-600 mx-2">-</span>
                    <span className={`font-bold text-sm ${game.score.away > game.score.home ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {game.score.away}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">
                      {game.away_team.abbreviation}
                    </span>
                    <img
                      src={game.away_team.logo}
                      alt={game.away_team.name}
                      className="w-6 h-6"
                    />
                  </div>
                </div>
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
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors">{label}</span>
      <span className="text-gray-900 dark:text-white font-semibold text-sm transition-colors">{value}</span>
    </div>
  );
}

function PlayerStat({ label, player }: { label: string; player: Player }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
          <p className="text-gray-900 dark:text-white font-semibold text-sm transition-colors">{player.name}</p>
        </div>
        <div className="text-right">
          <p className="text-orange-600 dark:text-orange-400 font-bold text-base">
            {player.value?.toFixed(1) || player.percentage?.toFixed(1) || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
