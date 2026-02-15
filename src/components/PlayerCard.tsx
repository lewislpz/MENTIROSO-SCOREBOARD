import type { Player } from "../types"
import { TARGET_LETTERS } from "../constants/game"
import { Undo2, Skull } from "lucide-react"

interface PlayerCardProps {
    player: Player
    onTap: () => void
    onUndo: (e: React.MouseEvent) => void
}

export default function PlayerCard({
    player,
    onTap,
    onUndo
}: PlayerCardProps) {
    const isOut = player.strikes >= TARGET_LETTERS.length

    return (
        <div
            onClick={isOut ? undefined : onTap}
            className={`
                relative group glass-card rounded-2xl p-6 transition-all duration-300
                ${isOut
                    ? "opacity-50 grayscale scale-[0.98] cursor-not-allowed"
                    : "hover:bg-white/5 cursor-pointer active:scale-95"
                }
            `}
        >
            {/* Header: Name + Undo */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isOut ? 'bg-slate-600' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
                    <h3 className={`font-black text-xl tracking-tight truncate max-w-[120px] ${isOut ? "text-slate-500 line-through" : "text-white"}`}>
                        {player.name}
                    </h3>
                </div>

                {player.strikes > 0 && !isOut && (
                    <button
                        onClick={onUndo}
                        className="p-2 hover:bg-white/10 text-indigo-400 rounded-lg transition-all active:scale-90"
                        title="Undo strike"
                    >
                        <Undo2 size={18} />
                    </button>
                )}
            </div>

            {/* Scoreboard Letters */}
            <div className="flex justify-between items-end bg-black/20 rounded-xl p-4 border border-white/5 mt-4">
                {TARGET_LETTERS.map((char, index) => {
                    const isActive = index < player.strikes
                    return (
                        <div
                            key={index}
                            className={`
                                letter-strike font-black text-lg sm:text-xl
                                ${isActive ? "active text-red-500" : "text-slate-600"}
                            `}
                        >
                            {char}
                        </div>
                    )
                })}
            </div>

            {/* Visual Indicator for "OUT" */}
            {isOut && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none rounded-2xl overflow-hidden">
                    <div className="bg-red-500/10 backdrop-blur-[2px] w-full h-full flex flex-col items-center justify-center gap-2">
                        <Skull className="text-red-500 animate-pulse" size={48} />
                        <span className="text-red-500 font-black text-2xl tracking-[0.2em] bg-black/40 px-4 py-1 rounded-lg">ELIMINATED</span>
                    </div>
                </div>
            )}
        </div>
    )
}
