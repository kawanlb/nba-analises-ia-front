import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, ArrowRightLeft } from "lucide-react";
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
  const [team1Query, setTeam1Query] = useState("");
  const [team2Query, setTeam2Query] = useState("");
  const [selectedTeam1, setSelectedTeam1] = useState<Team | null>(null);
  const [selectedTeam2, setSelectedTeam2] = useState<Team | null>(null);
  const [openField, setOpenField] = useState<"team1" | "team2" | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredTeam1 = useMemo(() => {
    if (!team1Query.trim()) return [];
    return NBA_TEAMS.filter(
      (team) =>
        team.name.toLowerCase().includes(team1Query.toLowerCase()) ||
        team.abbreviation.toLowerCase().includes(team1Query.toLowerCase())
    );
  }, [team1Query]);

  const filteredTeam2 = useMemo(() => {
    if (!team2Query.trim()) return [];
    return NBA_TEAMS.filter(
      (team) =>
        (team.name.toLowerCase().includes(team2Query.toLowerCase()) ||
          team.abbreviation.toLowerCase().includes(team2Query.toLowerCase())) &&
        team.id !== selectedTeam1?.id
    );
  }, [team2Query, selectedTeam1?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenField(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectTeam(field: "team1" | "team2", team: Team) {
    if (field === "team1") {
      setSelectedTeam1(team);
      setTeam1Query(team.name);
      if (selectedTeam2?.id === team.id) {
        setSelectedTeam2(null);
        setTeam2Query("");
      }
    } else {
      setSelectedTeam2(team);
      setTeam2Query(team.name);
    }
    setOpenField(null);
  }

  function handleClearTeam(field: "team1" | "team2") {
    if (field === "team1") {
      setSelectedTeam1(null);
      setTeam1Query("");
      return;
    }
    setSelectedTeam2(null);
    setTeam2Query("");
  }

  function handleCompare() {
    if (!selectedTeam1 || !selectedTeam2 || selectedTeam1.id === selectedTeam2.id) {
      return;
    }

    if (onCompare) {
      onCompare(selectedTeam1.id, selectedTeam2.id);
      return;
    }

    navigate(`/match/${selectedTeam1.id}/${selectedTeam2.id}`);
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
            Time 1
          </p>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
              size={18}
            />
            <input
              type="text"
              value={team1Query}
              onChange={(e) => {
                setTeam1Query(e.target.value);
                setSelectedTeam1(null);
                setOpenField("team1");
              }}
              onFocus={() => setOpenField("team1")}
              placeholder="Busque o primeiro time"
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
            />
            {team1Query && (
              <button
                type="button"
                onClick={() => handleClearTeam("team1")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Limpar time 1"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {openField === "team1" && filteredTeam1.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {filteredTeam1.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam("team1", team)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
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
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {team.abbreviation}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
            Time 2
          </p>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
              size={18}
            />
            <input
              type="text"
              value={team2Query}
              onChange={(e) => {
                setTeam2Query(e.target.value);
                setSelectedTeam2(null);
                setOpenField("team2");
              }}
              onFocus={() => setOpenField("team2")}
              placeholder="Busque o segundo time"
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
            />
            {team2Query && (
              <button
                type="button"
                onClick={() => handleClearTeam("team2")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Limpar time 2"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {openField === "team2" && filteredTeam2.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {filteredTeam2.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam("team2", team)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
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
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {team.abbreviation}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="button"
          onClick={handleCompare}
          disabled={!selectedTeam1 || !selectedTeam2 || selectedTeam1.id === selectedTeam2.id}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:hover:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <ArrowRightLeft size={16} />
          Comparar Times
        </button>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Selecione dois times para abrir a comparação.
        </p>
      </div>

      {openField === "team1" && team1Query && filteredTeam1.length === 0 && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
          Nenhum time encontrado para o Time 1.
        </div>
      )}

      {openField === "team2" && team2Query && filteredTeam2.length === 0 && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
          Nenhum time encontrado para o Time 2.
        </div>
      )}
    </div>
  );
}
