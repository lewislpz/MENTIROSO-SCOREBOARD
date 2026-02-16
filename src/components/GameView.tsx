import type { Player } from "../types"
import { TARGET_LETTERS } from "../constants/game"
import PlayerCard from "./PlayerCard"
import { LogOut, Trophy, Swords } from "lucide-react"

interface GameViewProps {
    players: Player[]
    addStrike: (id: string) => void
    undoStrike: (id: string) => void
    onQuitRequest: () => void
}

export default function GameView({ players, addStrike, undoStrike, onQuitRequest }: GameViewProps) {
    const activePlayers = players.filter(p => p.strikes < TARGET_LETTERS.length).length
    const totalPlayers = players.length
    const progress = ((totalPlayers - activePlayers) / Math.max(totalPlayers - 1, 1)) * 100

    return (
        <div className="relative z-10 flex flex-col h-screen max-w-6xl mx-auto p-3 sm:p-6">
            {/* ─── HEADER ─── */}
            <header className="glass-card rounded-2xl p-3 sm:p-5 mb-4 sm:mb-6 shrink-0 animate-slide-up">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                            <Swords className="text-purple-400" size={22} />
                        </div>
                        <div>
                            <h2 className="text-[10px] sm:text-xs font-bold text-purple-400/70 uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Jugadores activos
                            </h2>
                            <div className="flex items-center gap-3">
                                <p className="text-white font-black text-lg sm:text-2xl leading-none"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {activePlayers}
                                    <span className="text-purple-400/40 text-sm sm:text-base font-medium"> / {totalPlayers}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress + Quit */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Mini progress bar */}
                        <div className="hidden sm:flex flex-col items-end gap-1">
                            <span className="text-[10px] text-purple-400/50 font-medium uppercase tracking-wider"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Progreso
                            </span>
                            <div className="w-24 h-1.5 bg-purple-500/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={onQuitRequest}
                            className="danger-button flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">SALIR</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ─── PLAYER GRID ─── */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger-children">
                    {players.map(player => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            onTap={() => addStrike(player.id)}
                            onUndo={(e) => {
                                e.stopPropagation()
                                undoStrike(player.id)
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ─── BOTTOM TIP ─── */}
            <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="glass-card py-2.5 px-5 rounded-full text-center border-purple-500/10 shadow-2xl flex items-center justify-center gap-2">
                    <Trophy size={12} className="text-purple-400/50" />
                    <p className="text-purple-300/50 text-xs font-medium">
                        Toca una tarjeta para añadir letra
                    </p>
                </div>
            </div>
        </div>
    )
}
