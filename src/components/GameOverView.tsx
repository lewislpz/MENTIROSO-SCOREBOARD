import { Trophy } from "lucide-react"
import type { Player } from "../types"
import Modal from "./Modal"

interface GameOverViewProps {
    winner: Player
    onReset: () => void
    onPlayAgain: () => void
}

export default function GameOverView({ winner, onReset, onPlayAgain }: GameOverViewProps) {
    return (
        <Modal isOpen={true} title="GAME OVER">
            <div className="space-y-6">
                <div className="border-2 border-inset border-gray-400 bg-white p-4">
                    <Trophy size={48} className="mx-auto text-yellow-500 mb-2" />
                    <h2 className="text-sm font-bold uppercase text-gray-500 mb-1">WINNER</h2>
                    <h1 className="text-3xl font-black uppercase text-black border-b-2 border-black pb-2">{winner.name}</h1>
                    <div className="mt-4 text-xs font-mono">
                        ALL OTHERS ARE <span className="text-red-600 font-bold text-lg">MENTIROSOS</span>
                    </div>
                </div>

                <div className="flex gap-2 justify-center">
                    <button
                        onClick={onReset}
                        className="flex-1 py-2 px-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold text-sm"
                    >
                        NEW GAME
                    </button>
                    <button
                        onClick={onPlayAgain}
                        className="flex-1 py-2 px-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold text-sm"
                    >
                        REPLAY
                    </button>
                </div>
            </div>
        </Modal>
    )
}
