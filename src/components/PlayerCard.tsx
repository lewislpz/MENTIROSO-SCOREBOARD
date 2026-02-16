import { useState } from "react"
import type { Player } from "../types"
import { TARGET_LETTERS } from "../constants/game"
import { Undo2, Skull, Zap } from "lucide-react"

interface PlayerCardProps {
    player: Player
    onTap: () => void
    onUndo: (e: React.MouseEvent) => void
}

export default function PlayerCard({ player, onTap, onUndo }: PlayerCardProps) {
    const isOut = player.strikes >= TARGET_LETTERS.length
    const [isShaking, setIsShaking] = useState(false)
    const strikePercent = (player.strikes / TARGET_LETTERS.length) * 100

    const handleTap = () => {
        if (isOut) return
        onTap()
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 600)
    }

    return (
        <div
            onClick={handleTap}
            className={`
                relative glass-card rounded-2xl overflow-hidden transition-all duration-300
                ${isShaking ? "animate-shake" : ""}
                ${isOut
                    ? "animate-eliminated grayscale cursor-not-allowed"
                    : "glass-card-hover cursor-pointer active:scale-[0.97]"
                }
            `}
        >
            {/* ── Danger progress bar at top ── */}
            <div className="h-1 w-full bg-purple-500/5">
                <div
                    className="h-full transition-all duration-700 ease-out rounded-r-full"
                    style={{
                        width: `${strikePercent}%`,
                        background: strikePercent > 66
                            ? "linear-gradient(90deg, #ef4444, #dc2626)"
                            : strikePercent > 33
                                ? "linear-gradient(90deg, #f97316, #ef4444)"
                                : "linear-gradient(90deg, #a855f7, #ec4899)",
                    }}
                />
            </div>

            <div className="p-5 sm:p-6">
                {/* ── Header ── */}
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        {/* Status dot */}
                        <div className={`relative w-3 h-3 rounded-full ${isOut
                            ? "bg-slate-600"
                            : player.strikes > TARGET_LETTERS.length * 0.6
                                ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                                : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                            }`}>
                            {!isOut && (
                                <div className={`absolute inset-0 rounded-full animate-ping ${player.strikes > TARGET_LETTERS.length * 0.6 ? "bg-red-500/30" : "bg-emerald-400/30"
                                    }`} />
                            )}
                        </div>

                        <h3 className={`font-bold text-lg sm:text-xl tracking-tight truncate max-w-[130px] ${isOut ? "text-slate-500 line-through decoration-red-500/50" : "text-white"
                            }`}>
                            {player.name}
                        </h3>
                    </div>

                    {/* Undo button */}
                    {player.strikes > 0 && !isOut && (
                        <button
                            onClick={onUndo}
                            className="p-2 hover:bg-purple-500/15 text-purple-400/60 hover:text-purple-300 rounded-xl transition-all duration-200 active:scale-90"
                            title="Deshacer strike"
                        >
                            <Undo2 size={16} />
                        </button>
                    )}
                </div>

                {/* ── Strike counter badge ── */}
                {!isOut && (
                    <div className="flex items-center gap-2 mb-4">
                        <Zap size={12} className="text-purple-400/40" />
                        <span className="text-[10px] font-bold text-purple-400/50 uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {player.strikes} / {TARGET_LETTERS.length} strikes
                        </span>
                    </div>
                )}

                {/* ── Scoreboard Letters ── */}
                <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 sm:p-4 border border-white/5">
                    {TARGET_LETTERS.map((char, index) => {
                        const isActive = index < player.strikes
                        return (
                            <div
                                key={index}
                                className={`
                                    letter-cell text-base sm:text-lg
                                    ${isActive ? "active" : "inactive"}
                                `}
                            >
                                {char}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── ELIMINATED OVERLAY ── */}
            {isOut && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none rounded-2xl overflow-hidden">
                    <div className="bg-black/60 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className="relative">
                            <Skull className="text-red-500" size={44} />
                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                        </div>
                        <span
                            className="text-red-500 font-black text-xl tracking-[0.25em] uppercase"
                            style={{ fontFamily: "var(--font-display)", textShadow: "0 0 20px rgba(239,68,68,0.5)" }}
                        >
                            Eliminado
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
