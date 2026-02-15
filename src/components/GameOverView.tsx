import { Trophy, RotateCcw, PlayCircle } from "lucide-react"
import type { Player } from "../types"
import Modal from "./Modal"

interface GameOverViewProps {
    winner: Player
    onReset: () => void
    onPlayAgain: () => void
}

export default function GameOverView({ winner, onReset, onPlayAgain }: GameOverViewProps) {
    return (
        <Modal isOpen={true} title="MATCH FINISHED">
            <div className="flex flex-col items-center gap-8 py-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
                    <Trophy size={80} className="relative text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-float" />
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Grand Champion</h2>
                    <h1 className="text-4xl font-black text-white tracking-tight">{winner.name}</h1>
                </div>

                <div className="w-full bg-slate-900/60 border border-white/5 rounded-2xl p-6 text-center">
                    <p className="text-slate-400 text-sm italic">
                        "The truth always prevails, but the best liar wins the game."
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl modern-input font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        <RotateCcw size={18} />
                        New Game
                    </button>
                    <button
                        onClick={onPlayAgain}
                        className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl modern-button font-black text-xs uppercase tracking-widest shadow-xl"
                    >
                        <PlayCircle size={18} />
                        Replay
                    </button>
                </div>
            </div>
        </Modal>
    )
}
