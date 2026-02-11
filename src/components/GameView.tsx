import type { Player } from "../types"
import { TARGET_LETTERS } from "../constants/game"
import PlayerCard from "./PlayerCard"

interface GameViewProps {
    players: Player[]
    addStrike: (id: string) => void
    undoStrike: (id: string) => void
    onQuitRequest: () => void
}

export default function GameView({ players, addStrike, undoStrike, onQuitRequest }: GameViewProps) {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-4 py-2 bg-[#c0c0c0] border-b-2 border-white shadow-md z-10 shrink-0">
                <div className="flex items-center gap-2 border-2 border-inset border-gray-500 bg-white px-2 py-1">
                    <span className="font-bold text-red-600 blink">●</span>
                    <span className="text-sm font-mono font-bold uppercase">
                        PLAYERS: {players.filter(p => p.strikes < TARGET_LETTERS.length).length}
                    </span>
                </div>
                <button
                    onClick={onQuitRequest}
                    className="bg-[#c0c0c0] px-3 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold text-sm"
                >
                    QUIT GAME
                </button>
            </header>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <div className={`grid gap-6 ${players.length > 5 ? 'grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
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
        </div>
    )
}
