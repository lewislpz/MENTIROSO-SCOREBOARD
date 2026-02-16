import { Trophy, RotateCcw, PlayCircle, Crown, Sparkles } from "lucide-react"
import type { Player } from "../types"
import Confetti from "./Confetti"

interface GameOverViewProps {
    winner: Player
    onReset: () => void
    onPlayAgain: () => void
}

export default function GameOverView({ winner, onReset, onPlayAgain }: GameOverViewProps) {
    return (
        <>
            <Confetti />

            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                {/* Card */}
                <div className="relative w-full max-w-sm glass-card rounded-[2rem] overflow-hidden shadow-2xl border-purple-500/20 animate-scale-in">
                    {/* Decorative top glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-500/15 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

                    {/* Header bar */}
                    <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-white/3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-yellow-400" />
                            <span className="font-bold text-yellow-400/80 tracking-widest text-xs uppercase"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Partida Terminada
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col items-center gap-7">
                        {/* Trophy with glow effects */}
                        <div className="relative animate-float">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150" />

                            <div className="relative">
                                {/* Rotating ring */}
                                <div className="absolute -inset-4 border-2 border-dashed border-yellow-500/20 rounded-full animate-spin-slow" />

                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                                    <Trophy size={48} className="text-yellow-400 trophy-glow" />
                                </div>
                            </div>

                            {/* Crown */}
                            <Crown
                                size={28}
                                className="absolute -top-5 left-1/2 -translate-x-1/2 text-yellow-400"
                                style={{ filter: "drop-shadow(0 0 10px rgba(251,191,36,0.5))" }}
                            />
                        </div>

                        {/* Winner info */}
                        <div className="text-center space-y-2">
                            <h3 className="text-purple-400/60 font-bold text-xs uppercase tracking-[0.3em]"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Gran Campeón
                            </h3>
                            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    textShadow: "0 0 30px rgba(168,85,247,0.3)",
                                }}
                            >
                                {winner.name}
                            </h1>
                        </div>

                        {/* Quote */}
                        <div className="w-full bg-purple-500/5 border border-purple-500/10 rounded-2xl p-5 text-center">
                            <p className="text-purple-300/50 text-sm italic leading-relaxed">
                                "La verdad siempre prevalece, pero el mejor mentiroso gana el juego."
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3 w-full pt-2">
                            <button
                                onClick={onReset}
                                className="ghost-button flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                            >
                                <RotateCcw size={16} />
                                Nuevo
                            </button>
                            <button
                                onClick={onPlayAgain}
                                className="neon-button flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                            >
                                <PlayCircle size={16} />
                                Revancha
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
