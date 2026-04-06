import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { fetchUpcomingGames } from "../utils/api";

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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Próximos Jogos da NBA
        </h1>
        <p className="text-xl text-gray-300">
          Clique em um jogo para ver estatísticas detalhadas e análise com IA
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.game_id}
              to={`/match/${game.home_team.id}/${game.away_team.id}`}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105 hover:border-orange-500/50">
                {/* Date and Time */}
                <div className="flex items-center justify-between mb-6 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{game.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{game.time}</span>
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-4">
                  {/* Away Team */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={game.away_team.logo}
                        alt={game.away_team.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Visitante</p>
                      <p className="text-white font-semibold">
                        {game.away_team.name}
                      </p>
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="text-center">
                    <span className="text-orange-500 font-bold text-lg">VS</span>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={game.home_team.logo}
                        alt={game.home_team.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Casa</p>
                      <p className="text-white font-semibold">
                        {game.home_team.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <span className="text-orange-500 text-sm font-medium group-hover:text-orange-400">
                    Ver análise completa →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span>💡</span> Como usar
        </h3>
        <p className="text-gray-300 text-sm">
          Clique em qualquer jogo para ver estatísticas detalhadas dos times, histórico
          de confrontos e uma análise gerada por IA.
        </p>
      </div>
    </div>
  );
}
