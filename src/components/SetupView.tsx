import { useState } from "react"
import type { Player } from "../types"
import { TARGET_WORD } from "../constants/game"
import { Users, UserPlus, X, Play, Dices, BookOpen, ChevronDown, ChevronUp } from "lucide-react"

interface SetupViewProps {
    players: Player[]
    addPlayer: (name: string) => void
    removePlayer: (id: string) => void
    startGame: () => void
}

export default function SetupView({ players, addPlayer, removePlayer, startGame }: SetupViewProps) {
    const [newPlayerName, setNewPlayerName] = useState("")
    const [showInstructions, setShowInstructions] = useState(false)

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPlayerName.trim()) return
        addPlayer(newPlayerName)
        setNewPlayerName("")
    }

    return (
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="w-full animate-scale-in">
                {/* ─── LOGO & TITLE ─── */}
                <header className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <Dices size={56} className="text-purple-400 animate-dice relative z-10" />
                            <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full" />
                        </div>
                    </div>
                    <h1
                        className="text-5xl sm:text-7xl font-black tracking-tighter animate-neon-flicker"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        <span className="text-gradient">MENTIROSO</span>
                    </h1>
                    <p className="text-purple-400/80 font-medium text-sm sm:text-base tracking-[0.3em] uppercase mt-2"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Scoreboard
                    </p>
                </header>

                {/* ─── INSTRUCTIONS PANEL ─── */}
                <div className="glass-card rounded-2xl mb-6 overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                                <BookOpen size={20} className="text-cyan-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white text-sm sm:text-base">¿Cómo se juega?</h3>
                                <p className="text-purple-300/50 text-xs">Toca para ver las reglas</p>
                            </div>
                        </div>
                        {showInstructions
                            ? <ChevronUp size={20} className="text-purple-400" />
                            : <ChevronDown size={20} className="text-purple-400" />
                        }
                    </button>

                    {showInstructions && (
                        <div className="px-4 sm:px-5 pb-5 border-t border-white/5 pt-4 animate-slide-up">
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="flex gap-3 items-start">
                                    <div className="instruction-icon bg-purple-500/15 border border-purple-500/20 text-lg">
                                        🎲
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Tirar los dados en secreto</h4>
                                        <p className="text-purple-300/60 text-xs mt-0.5">
                                            Cada jugador tira sus dados y los mantiene ocultos. ¡Solo tú sabes lo que tienes!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-3 items-start">
                                    <div className="instruction-icon bg-pink-500/15 border border-pink-500/20 text-lg">
                                        🗣️
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Apostar o mentir</h4>
                                        <p className="text-purple-300/60 text-xs mt-0.5">
                                            Haz una apuesta sobre cuántos dados de cierto valor hay en TOTAL entre todos los jugadores. ¡Puedes mentir!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-3 items-start">
                                    <div className="instruction-icon bg-orange-500/15 border border-orange-500/20 text-lg">
                                        👆
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Desafiar al anterior</h4>
                                        <p className="text-purple-300/60 text-xs mt-0.5">
                                            Si crees que el jugador anterior mintió, grita "¡MENTIROSO!" y se revelan todos los dados.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex gap-3 items-start">
                                    <div className="instruction-icon bg-red-500/15 border border-red-500/20 text-lg">
                                        💀
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Ganar una letra</h4>
                                        <p className="text-purple-300/60 text-xs mt-0.5">
                                            El perdedor de la ronda gana una letra de <strong className="text-red-400">{TARGET_WORD}</strong>.
                                            ¡Quien complete la palabra queda eliminado!
                                        </p>
                                    </div>
                                </div>

                                {/* Step 5 */}
                                <div className="flex gap-3 items-start">
                                    <div className="instruction-icon bg-yellow-500/15 border border-yellow-500/20 text-lg">
                                        🏆
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">¡Último en pie gana!</h4>
                                        <p className="text-purple-300/60 text-xs mt-0.5">
                                            El único jugador que NO haya completado "{TARGET_WORD}" es el ganador.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 rounded-xl bg-purple-500/8 border border-purple-500/15 text-center">
                                <p className="text-purple-300/70 text-xs font-medium">
                                    💡 <strong>Tip:</strong> Toca la tarjeta de un jugador para añadir una letra cuando pierda una ronda.
                                    Usa el botón ↩ para deshacer.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── MAIN CARD ─── */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 overflow-hidden relative animate-slide-up" style={{ animationDelay: "0.15s" }}>
                    {/* Decorative glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-6 relative">
                        {/* ── Add Player Input ── */}
                        <form onSubmit={handleAddPlayer} className="relative group">
                            <input
                                type="text"
                                autoFocus
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                placeholder="Nombre del jugador..."
                                maxLength={20}
                                className="w-full neon-input rounded-2xl py-4 pl-5 pr-16 text-lg font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!newPlayerName.trim()}
                                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl neon-button disabled:opacity-0 disabled:scale-75 transition-all duration-300"
                            >
                                <UserPlus size={22} />
                            </button>
                        </form>

                        {/* ── Players List ── */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-purple-300/60 font-bold text-xs uppercase tracking-widest"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Jugadores ({players.length})
                                </h3>
                                {players.length >= 2 && (
                                    <span className="text-xs text-green-400/70 font-medium animate-pulse">
                                        ✓ Listo para jugar
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1 no-scrollbar stagger-children">
                                {players.length === 0 ? (
                                    <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-purple-500/15 rounded-2xl">
                                        <Users className="mb-3 text-purple-500/20" size={40} />
                                        <p className="text-purple-300/40 font-medium text-sm">Añade al menos 2 jugadores</p>
                                        <p className="text-purple-300/25 text-xs mt-1">para empezar la partida</p>
                                    </div>
                                ) : (
                                    players.map((p, i) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between bg-purple-500/5 border border-purple-500/10 rounded-xl p-3.5 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/20 group"
                                            style={{ animationDelay: `${i * 0.05}s` }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-500/20 font-bold text-sm text-purple-300"
                                                    style={{ fontFamily: "var(--font-display)" }}
                                                >
                                                    {i + 1}
                                                </div>
                                                <span className="font-bold text-base truncate max-w-[140px] text-white/90">
                                                    {p.name}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => removePlayer(p.id)}
                                                className="p-1.5 hover:bg-red-500/15 text-purple-400/40 hover:text-red-400 rounded-lg transition-all duration-200"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* ── Start Button ── */}
                        <button
                            onClick={startGame}
                            disabled={players.length < 2}
                            className="w-full py-4 sm:py-5 rounded-2xl neon-button text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300"
                        >
                            <Play fill="currentColor" size={22} />
                            INICIAR PARTIDA
                        </button>
                    </div>
                </div>

                {/* ── Footer ── */}
                <p className="text-center mt-6 text-purple-400/30 font-medium text-xs tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    El juego de dados definitivo
                </p>
            </div>
        </div>
    )
}
