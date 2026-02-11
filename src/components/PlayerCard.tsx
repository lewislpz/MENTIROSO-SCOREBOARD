import type { Player } from "../types"
import { TARGET_LETTERS } from "../constants/game"

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
        relative group border-[3px] p-2 h-36 flex flex-col justify-between cursor-pointer select-none transition-transform active:translate-y-1
        ${isOut
                    ? "bg-[#808080] border-t-gray-600 border-l-gray-600 border-b-white border-r-white grayscale text-gray-400"
                    : "bg-white border-t-white border-l-white border-b-black border-r-black hover:bg-[#eaeaea]"
                }
        shadow-[4px_4px_0_#000]
      `}
        >
            {/* Header: Name + Undo */}
            <div className="flex justify-between items-start border-b-2 border-black pb-1 mb-1">
                <h3 className={`font-bold text-lg leading-none truncate pr-1 ${isOut ? "line-through decoration-2" : "text-black"}`}>
                    {player.name}
                </h3>

                {player.strikes > 0 && !isOut && (
                    <button
                        onClick={onUndo}
                        className="px-2 py-0 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-black active:border-inset hover:bg-gray-300"
                        title="Undo"
                    >
                        ←
                    </button>
                )}
            </div>

            {/* Letters Display */}
            <div className="flex justify-center items-end gap-0 mt-10">
                {TARGET_LETTERS.map((char, index) => {
                    const isActive = index < player.strikes
                    return (
                        <div
                            key={index}
                            className={`
                 font-mono font-bold text-1xl
                 w-5 text-center
                 ${isActive
                                    ? "text-red-600 border-b-4 border-red-600"
                                    : "text-gray-300 border-b-4 border-transparent"
                                }
              `}
                        >
                            {char}
                        </div>
                    )
                })}
            </div>

            {/* Visual Indicator for "OUT" */}
            {isOut && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-red-700 text-white font-bold text-3xl px-4 py-2 border-4 border-white transform -rotate-12 shadow-[4px_4px_0_#000]">
                        OUT
                    </div>
                </div>
            )}
        </div>
    )
}
