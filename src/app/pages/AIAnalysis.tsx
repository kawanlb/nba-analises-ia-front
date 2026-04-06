import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { fetchAIAnalysis } from "../utils/api";

export function AIAnalysis() {
  const { team1Id, team2Id } = useParams();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (team1Id && team2Id) {
      loadAnalysis(team1Id, team2Id);
    }
  }, [team1Id, team2Id]);

  async function loadAnalysis(t1: string, t2: string) {
    setLoading(true);
    const data = await fetchAIAnalysis(t1, t2);
    setAnalysis(data?.analysis || "Análise não disponível no momento.");
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar para jogos
      </Link>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Análise com IA</h1>
            <p className="text-gray-400 text-sm">Dados vindos da API configurada</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {analysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
