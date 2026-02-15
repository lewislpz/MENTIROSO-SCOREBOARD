import type { Player } from "../types"
import { TARGET_LETTERS } from "../constants/game"
import PlayerCard from "./PlayerCard"
import { LogOut, Trophy } from "lucide-react"

interface GameViewProps {
    players: Player[]
    addStrike: (id: string) => void
    undoStrike: (id: string) => void
    onQuitRequest: () => void
}

export default function GameView({ players, addStrike, undoStrike, onQuitRequest }: GameViewProps) {
    const activePlayers = players.filter(p => p.strikes < TARGET_LETTERS.length).length

    return (
        <div className="relative z-10 flex flex-col h-screen max-w-6xl mx-auto p-4 sm:p-8">
            {/* Header Area */}
            <header className="flex justify-between items-center mb-8 glass-card rounded-2xl p-4 md:p-6 border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/20 p-2 sm:p-3 rounded-xl border border-indigo-500/30">
                        <Trophy className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Players</h2>
                        <p className="text-white font-black text-lg sm:text-2xl leading-none">
                            {activePlayers} / {players.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onQuitRequest}
                        className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline tracking-tight">QUIT GAME</span>
                    </button>
                </div>
            </header>

            {/* Players Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Quick Tips or Info */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
                <div className="glass-card py-2 px-4 rounded-full text-center border-white/5 shadow-2xl">
                    <p className="text-slate-400 text-xs font-medium">
                        Tap player card to mark a letter
                    </p>
                </div>
            </div>
        </div>
    )
}

