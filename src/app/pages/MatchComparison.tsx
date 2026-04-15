import { useState, useEffect, type ReactNode } from "react";
import { useParams, Link } from "react-router";
import {
  Loader2,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  BarChart3,
  Users,
  History,
  Bot,
  Info,
} from "lucide-react";
import {
  fetchMatchComparison,
  fetchAIAnalysis,
  type HeadToHeadGame,
  type MatchComparisonResponse,
  type MetricPlayer,
  type PlayerLeader,
  type ShootingLeader,
  type TeamLeaders,
  type TeamSummary,
} from "../utils/api";
import { formatDateBR } from "../utils/datetime";

type MatchTab = "stats" | "players" | "h2h" | "analysis" | "about";
type PlayerMetric = "points" | "rebounds" | "assists" | "steals" | "blocks" | "turnovers";
type LeaderValue = PlayerLeader | ShootingLeader | null;

const playerMetricLabel: Record<PlayerMetric, string> = {
  points: "Pontos",
  rebounds: "Rebotes",
  assists: "Assistências",
  steals: "Roubos",
  blocks: "Bloqueios",
  turnovers: "Turnovers",
};

export function MatchComparison() {
  const { team1Id, team2Id } = useParams();
  const [matchData, setMatchData] = useState<MatchComparisonResponse | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<MatchTab>("stats");
  const [activePlayerMetric, setActivePlayerMetric] = useState<PlayerMetric>("points");

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
          <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
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

  if (!team1.info || !team2.info) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
            Dados incompletos do confronto
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 transition-colors">
            A API retornou o confronto sem informações completas dos times.
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

  const topScorers = matchData.top_scorers;
  const topByMetric = matchData.top_players[activePlayerMetric];
  const team1Scorers = topByMetric.filter((p) => p.team_id === team1.info.id).slice(0, 10);
  const team2Scorers = topByMetric.filter((p) => p.team_id === team2.info.id).slice(0, 10);

  const selectedMetricLabel = playerMetricLabel[activePlayerMetric];

  return (
    <div className="w-full">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        Voltar
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[430px_minmax(0,1fr)] gap-7 items-start">
        <aside className="space-y-5 xl:sticky xl:top-28">
          <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="text-center">
                <img src={team1.info.logo} alt={team1.info.name} className="w-12 h-12 mx-auto mb-2 object-contain" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{team1.info.abbreviation}</p>
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">VS</span>
              <div className="text-center">
                <img src={team2.info.logo} alt={team2.info.name} className="w-12 h-12 mx-auto mb-2 object-contain" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{team2.info.abbreviation}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <QuickFact label="Time 1" value={team1.info.name} />
              <QuickFact label="Time 2" value={team2.info.name} />
              <QuickFact label="Top scorer geral" value={topScorers[0]?.name || "-"} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Artilheiros da partida</h3>
            </div>
            <div className="space-y-2">
              {topScorers.slice(0, 5).map((scorer, index) => (
                <div key={scorer.player_id} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {scorer.photo ? (
                      <img src={scorer.photo} alt={scorer.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{scorer.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">#{index + 1}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-orange-500">{scorer.points.toFixed(1)} PTS</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 transition-colors overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-800 px-3 md:px-5">
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-3">
              <TabButton
                label="Estatísticas"
                icon={<BarChart3 size={16} />}
                active={activeTab === "stats"}
                onClick={() => setActiveTab("stats")}
              />
              <TabButton
                label="Jogadores"
                icon={<Users size={16} />}
                active={activeTab === "players"}
                onClick={() => setActiveTab("players")}
              />
              <TabButton
                label="H2H"
                icon={<History size={16} />}
                active={activeTab === "h2h"}
                onClick={() => setActiveTab("h2h")}
              />
              <TabButton
                label="Análise IA"
                icon={<Bot size={16} />}
                active={activeTab === "analysis"}
                onClick={() => setActiveTab("analysis")}
              />
              <TabButton
                label="Sobre"
                icon={<Info size={16} />}
                active={activeTab === "about"}
                onClick={() => setActiveTab("about")}
              />
            </div>
          </div>

          <div className="p-5 md:p-7">
            {activeTab === "stats" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estatísticas da temporada</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                      <img src={team1.info.logo} alt="" className="w-7 h-7" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">{team1.info.name}</h4>
                    </div>
                    <div className="space-y-1">
                      <StatRow label="Pontos por jogo" value={team1.stats.points.toFixed(1)} />
                      <StatRow label="Pontos sofridos" value={team1.stats.points_allowed.toFixed(1)} />
                      <StatRow label="Rebotes" value={team1.stats.rebounds.toFixed(1)} />
                      <StatRow label="Assistências" value={team1.stats.assists.toFixed(1)} />
                      <StatRow label="Turnovers" value={team1.stats.turnovers.toFixed(1)} />
                      <StatRow label="FG%" value={`${team1.stats.fg_pct.toFixed(1)}%`} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                      <img src={team2.info.logo} alt="" className="w-7 h-7" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">{team2.info.name}</h4>
                    </div>
                    <div className="space-y-1">
                      <StatRow label="Pontos por jogo" value={team2.stats.points.toFixed(1)} />
                      <StatRow label="Pontos sofridos" value={team2.stats.points_allowed.toFixed(1)} />
                      <StatRow label="Rebotes" value={team2.stats.rebounds.toFixed(1)} />
                      <StatRow label="Assistências" value={team2.stats.assists.toFixed(1)} />
                      <StatRow label="Turnovers" value={team2.stats.turnovers.toFixed(1)} />
                      <StatRow label="FG%" value={`${team2.stats.fg_pct.toFixed(1)}%`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "players" && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Melhores jogadores</h3>
                  <select
                    value={activePlayerMetric}
                    onChange={(e) => setActivePlayerMetric(e.target.value as PlayerMetric)}
                    className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-gray-700 dark:text-gray-200"
                  >
                    <option value="points">Pontos</option>
                    <option value="rebounds">Rebotes</option>
                    <option value="assists">Assistências</option>
                    <option value="steals">Roubos</option>
                    <option value="blocks">Bloqueios</option>
                    <option value="turnovers">Turnovers</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      TOP {selectedMetricLabel} - {team1.info.abbreviation}
                    </h4>
                    <div className="space-y-2">
                      {team1Scorers.length > 0 ? (
                        team1Scorers.map((scorer) => (
                          <ScorerRow
                            key={`${activePlayerMetric}-${scorer.player_id}`}
                            scorer={scorer}
                            label={selectedMetricLabel}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sem dados para este filtro.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      TOP {selectedMetricLabel} - {team2.info.abbreviation}
                    </h4>
                    <div className="space-y-2">
                      {team2Scorers.length > 0 ? (
                        team2Scorers.map((scorer) => (
                          <ScorerRow
                            key={`${activePlayerMetric}-${scorer.player_id}`}
                            scorer={scorer}
                            label={selectedMetricLabel}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sem dados para este filtro.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <TeamLeadersCard team={team1.info} leaders={team1.players} />
                  <TeamLeadersCard team={team2.info} leaders={team2.players} />
                </div>
              </div>
            )}

            {activeTab === "h2h" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Histórico de confrontos</h3>
                <div className="space-y-3">
                  {head_to_head.map((game, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          {formatDateBR(game.date)}
                        </span>

                        <div className="flex items-center gap-4 flex-1 justify-center">
                          <HeadToHeadTeamBadge team={game.home_team} />

                          <div className="px-4 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                            <span className={`font-bold text-sm ${game.score.home > game.score.away ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}>
                              {game.score.home}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 mx-2">-</span>
                            <span className={`font-bold text-sm ${game.score.away > game.score.home ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}>
                              {game.score.away}
                            </span>
                          </div>

                          <HeadToHeadTeamBadge team={game.away_team} reverse />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analysis" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Análise com IA</h3>
                <button
                  onClick={loadAIAnalysis}
                  disabled={loadingAI}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 font-medium shadow-sm"
                >
                  {loadingAI ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando análise...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Gerar análise
                    </>
                  )}
                </button>

                {aiAnalysis && (
                  <div className="mt-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-5 transition-colors">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm transition-colors">
                      {aiAnalysis}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sobre a comparação</h3>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900/30">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Esta comparação reúne os dados mais relevantes entre <strong>{team1.info.name}</strong> e <strong>{team2.info.name}</strong>,
                    incluindo desempenho de temporada, jogadores de destaque, histórico de confrontos diretos e análise com IA.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Use a aba <strong>Estatísticas</strong> para comparar eficiência coletiva, a aba <strong>Jogadores</strong> para ver líderes por métrica,
                    e a aba <strong>H2H</strong> para revisar o retrospecto recente entre as equipes.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    O ranking de artilheiros é calculado por pontos por jogo e pode variar conforme atualização da API.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "bg-orange-500 text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-sm text-gray-900 dark:text-white font-medium text-right">{value}</span>
    </div>
  );
}

function ScorerRow({
  scorer,
  label,
}: {
  scorer: MetricPlayer;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        {scorer.photo ? (
          <img src={scorer.photo} alt={scorer.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
        )}
        <span className="text-sm text-gray-900 dark:text-white truncate">{scorer.name}</span>
      </div>
      <span className="text-sm font-semibold text-orange-500">{scorer.value.toFixed(1)} {label}</span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-700 dark:text-gray-300 text-sm transition-colors">{label}</span>
      <span className="text-gray-900 dark:text-white font-semibold text-sm transition-colors">{value}</span>
    </div>
  );
}

function TeamLeadersCard({ team, leaders }: { team: TeamSummary; leaders: TeamLeaders }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <img src={team.logo} alt={team.name} className="w-7 h-7 object-contain" />
        <h4 className="font-semibold text-gray-900 dark:text-white">Líderes de {team.abbreviation}</h4>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <PlayerStat label="Pontos" player={leaders.points} />
        <PlayerStat label="Rebotes" player={leaders.rebounds} />
        <PlayerStat label="Assistências" player={leaders.assists} />
        <PlayerStat label="Roubos" player={leaders.steals} />
        <PlayerStat label="Bloqueios" player={leaders.blocks} />
        <PlayerStat label="Turnovers" player={leaders.turnovers} />
        <PlayerStat label="FG%" player={leaders.fg_pct} />
        <PlayerStat label="3PT%" player={leaders.fg3_pct} />
      </div>
    </div>
  );
}

function HeadToHeadTeamBadge({ team, reverse = false }: { team: HeadToHeadGame["home_team"]; reverse?: boolean }) {
  if (!team) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        <span>Time indisponível</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${reverse ? "flex-row-reverse" : ""}`}>
      <img
        src={team.logo}
        alt={team.name}
        className="w-6 h-6 object-contain"
      />
      <span className="text-gray-900 dark:text-white font-semibold text-sm">
        {team.abbreviation}
      </span>
    </div>
  );
}

function PlayerStat({ label, player }: { label: string; player: LeaderValue }) {
  const value = formatLeaderValue(player);

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
          <p className="text-gray-900 dark:text-white font-semibold text-sm transition-colors">{player?.name || "Sem dados"}</p>
        </div>
        <div className="text-right">
          <p className="text-orange-600 dark:text-orange-400 font-bold text-base">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatLeaderValue(player: LeaderValue) {
  if (!player) {
    return "-";
  }

  if ("percentage" in player) {
    const made = Number.isFinite(player.made) ? ` (${player.made.toFixed(1)} convert.)` : "";
    return `${player.percentage.toFixed(1)}%${made}`;
  }

  return player.value.toFixed(1);
}
