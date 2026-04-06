import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Calendar,
  Clock,
  Loader2,
  ChevronRight,
  Trophy,
  Sparkles,
  Info,
} from "lucide-react";
import { fetchUpcomingGames, fetchTopScorers } from "../utils/api";
import { formatDateBR, formatGameTimeBR } from "../utils/datetime";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Game {
  game_id: string;
  date: string;
  time: string;
  home_team: Team;
  away_team: Team;
}

interface TopPerformer {
  key: string;
  player: string;
  team: string;
  value: number;
  photo?: string;
}

const MAX_PERFORMERS = 15;
const DEFAULT_PERFORMERS = 5;

export function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [showAllPerformers, setShowAllPerformers] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    setLoading(true);
    const data = await fetchUpcomingGames();
    setGames(data);

    await loadTopPerformers();

    setLoading(false);
  }

  async function loadTopPerformers() {
    setPerformanceLoading(true);

    const scorers = (await fetchTopScorers(MAX_PERFORMERS))
      .filter((player) => player.name && player.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, MAX_PERFORMERS)
      .map((player) => ({
        key: `scorer-${player.player_id}`,
        player: player.name,
        team: player.team || player.team_abbreviation,
        value: player.points,
        photo: player.photo,
      }));

    setTopPerformers(scorers);
    setShowAllPerformers(false);
    setPerformanceLoading(false);
  }

  const featuredGame = games[0];
  const visiblePerformers = showAllPerformers
    ? topPerformers.slice(0, MAX_PERFORMERS)
    : topPerformers.slice(0, DEFAULT_PERFORMERS);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
          Jogos da NBA
        </h1>
        <p className="text-gray-700 dark:text-gray-300 transition-colors">
          Clique em um jogo para ver estatísticas e análise detalhada
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(420px,1fr)] gap-7 items-start">
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
              {games.map((game) => (
                <Link
                  key={game.game_id}
                  to={`/match/${game.home_team.id}/${game.away_team.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-md">
                    <div className="p-6">
                      {/* Date and Time */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 transition-colors">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{formatDateBR(game.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{formatGameTimeBR(game.time, game.date)}</span>
                        </div>
                      </div>

                      {/* Teams */}
                      <div className="space-y-4">
                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors">
                              <img
                                src={game.away_team.logo}
                                alt={game.away_team.name}
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-white font-semibold text-base transition-colors">
                                {game.away_team.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">Visitante</p>
                            </div>
                          </div>
                        </div>

                        {/* Home Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors">
                              <img
                                src={game.home_team.logo}
                                alt={game.home_team.name}
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-white font-semibold text-base transition-colors">
                                {game.home_team.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">Casa</p>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400 dark:text-gray-600 group-hover:text-orange-500 transition-colors" size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && games.length === 0 && (
            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center transition-colors">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Calendar className="text-gray-400 dark:text-gray-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                Nenhum jogo encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Não há jogos programados para os próximos dias
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-5 xl:sticky xl:top-28">
          {/* Next Featured Game */}
          {!loading && featuredGame && (
            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-7 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Próximo jogo em destaque</h2>
              </div>

              <Link
                to={`/match/${featuredGame.home_team.id}/${featuredGame.away_team.id}`}
                className="block group"
              >
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a27] dark:to-[#1e1e2e] p-6 hover:border-orange-500 transition-all">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{formatDateBR(featuredGame.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{formatGameTimeBR(featuredGame.time, featuredGame.date)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredGame.home_team.logo}
                        alt={featuredGame.home_team.name}
                        className="w-10 h-10 object-contain"
                      />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Casa</p>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                          {featuredGame.home_team.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-600 dark:text-gray-300 font-bold">VS</div>

                    <div className="flex items-center gap-3 justify-end text-right">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Visitante</p>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                          {featuredGame.away_team.name}
                        </p>
                      </div>
                      <img
                        src={featuredGame.away_team.logo}
                        alt={featuredGame.away_team.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Jogadores com maior desempenho</h2>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">ranking por pontos</span>
            </div>

            {performanceLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : topPerformers.length > 0 ? (
              <>
                <div className="space-y-3">
                  {visiblePerformers.map((performer, index) => (
                    <div
                      key={performer.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {performer.photo ? (
                          <img
                            src={performer.photo}
                            alt={performer.player}
                            className="w-10 h-10 rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{performer.player}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{performer.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-300">#{index + 1}</p>
                        <p className="font-semibold text-orange-500 text-sm">
                          {performer.value.toFixed(1)} PTS
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {topPerformers.length > DEFAULT_PERFORMERS && (
                  <button
                    type="button"
                    onClick={() => setShowAllPerformers((prev) => !prev)}
                    className="w-full mt-3 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {showAllPerformers
                      ? `Ver menos`
                      : `Ver mais (${Math.min(MAX_PERFORMERS, topPerformers.length)} jogadores)`}
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Não foi possível carregar os destaques dos jogadores no momento.
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sobre</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Esta página reúne jogos da NBA em andamento e próximos confrontos para facilitar sua análise.
              Você consegue comparar duas equipes, visualizar estatísticas-chave, conferir jogadores em destaque
              e gerar uma análise com IA para apoiar seus palpites.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}