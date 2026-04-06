import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Clock, Loader2, ChevronRight } from "lucide-react";
import { fetchUpcomingGames } from "../utils/api";
import { TeamSearch } from "../components/TeamSearch";

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

export function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    setLoading(true);
    const data = await fetchUpcomingGames();
    setGames(data);
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
          Jogos da NBA
        </h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">
          Clique em um jogo para ver estatísticas e análise detalhada
        </p>
      </div>

      {/* Team Search */}
      <div className="mb-8 bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Comparar Times
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pesquise e selecione dois times para comparar estatísticas
          </p>
        </div>
        <TeamSearch />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <Link
              key={game.game_id}
              to={`/match/${game.home_team.id}/${game.away_team.id}`}
              className="block group"
            >
              <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-md">
                <div className="p-5">
                  {/* Date and Time */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{game.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{game.time}</span>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">Visitante</p>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">Casa</p>
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
  );
}