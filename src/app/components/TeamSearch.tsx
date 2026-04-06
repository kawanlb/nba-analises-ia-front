import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";

interface Team {
  id: number;
  name: string;
  abbreviation: string;
  logo: string;
}

// Mock data de times da NBA
const NBA_TEAMS: Team[] = [
  { id: 1, name: "Los Angeles Lakers", abbreviation: "LAL", logo: "https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg" },
  { id: 2, name: "Boston Celtics", abbreviation: "BOS", logo: "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg" },
  { id: 3, name: "Golden State Warriors", abbreviation: "GSW", logo: "https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg" },
  { id: 4, name: "Miami Heat", abbreviation: "MIA", logo: "https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg" },
  { id: 5, name: "Chicago Bulls", abbreviation: "CHI", logo: "https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg" },
  { id: 6, name: "Brooklyn Nets", abbreviation: "BKN", logo: "https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg" },
  { id: 7, name: "Phoenix Suns", abbreviation: "PHX", logo: "https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg" },
  { id: 8, name: "Milwaukee Bucks", abbreviation: "MIL", logo: "https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg" },
  { id: 9, name: "Dallas Mavericks", abbreviation: "DAL", logo: "https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg" },
  { id: 10, name: "Philadelphia 76ers", abbreviation: "PHI", logo: "https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg" },
  { id: 11, name: "Denver Nuggets", abbreviation: "DEN", logo: "https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg" },
  { id: 12, name: "Toronto Raptors", abbreviation: "TOR", logo: "https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg" },
  { id: 13, name: "Memphis Grizzlies", abbreviation: "MEM", logo: "https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg" },
  { id: 14, name: "Cleveland Cavaliers", abbreviation: "CLE", logo: "https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg" },
  { id: 15, name: "Los Angeles Clippers", abbreviation: "LAC", logo: "https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg" },
  { id: 16, name: "Atlanta Hawks", abbreviation: "ATL", logo: "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg" },
  { id: 17, name: "New York Knicks", abbreviation: "NYK", logo: "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg" },
  { id: 18, name: "Minnesota Timberwolves", abbreviation: "MIN", logo: "https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg" },
  { id: 19, name: "Sacramento Kings", abbreviation: "SAC", logo: "https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg" },
  { id: 20, name: "New Orleans Pelicans", abbreviation: "NOP", logo: "https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg" },
];

interface TeamSearchProps {
  onCompare?: (team1Id: number, team2Id: number) => void;
}

export function TeamSearch({ onCompare }: TeamSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const filtered = NBA_TEAMS.filter(
        (team) =>
          team.name.toLowerCase().includes(query.toLowerCase()) ||
          team.abbreviation.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTeams(filtered);
      setIsOpen(true);
    } else {
      setFilteredTeams([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectTeam(team: Team) {
    if (selectedTeams.length === 0) {
      setSelectedTeams([team]);
      setQuery("");
      setIsOpen(false);
    } else if (selectedTeams.length === 1) {
      if (selectedTeams[0].id === team.id) {
        return; // Não pode selecionar o mesmo time
      }
      setSelectedTeams([...selectedTeams, team]);
      setQuery("");
      setIsOpen(false);
      // Navegar para comparação
      navigate(`/match/${selectedTeams[0].id}/${team.id}`);
      // Limpar seleção após um delay
      setTimeout(() => setSelectedTeams([]), 500);
    }
  }

  function handleRemoveTeam(teamId: number) {
    setSelectedTeams(selectedTeams.filter((t) => t.id !== teamId));
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="space-y-3">
        {/* Selected Teams */}
        {selectedTeams.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                <img src={team.logo} alt={team.name} className="w-4 h-4" />
                <span>{team.abbreviation}</span>
                <button
                  onClick={() => handleRemoveTeam(team.id)}
                  className="hover:bg-orange-600 rounded p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTeams.length === 1 ? "Selecione o segundo time" : ""}
            </span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              selectedTeams.length === 0
                ? "Pesquisar times da NBA..."
                : "Pesquisar segundo time..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredTeams.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelectTeam(team)}
              disabled={selectedTeams.some((t) => t.id === team.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-8 h-8 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {team.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {team.abbreviation}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && filteredTeams.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum time encontrado
          </p>
        </div>
      )}
    </div>
  );
}
