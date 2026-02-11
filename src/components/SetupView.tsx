import { useState } from "react"
import type { Player } from "../types"
import UserPlusIcon from "./UserPlusIcon"

interface SetupViewProps {
    players: Player[]
    addPlayer: (name: string) => void
    removePlayer: (id: string) => void
    startGame: () => void
}

export default function SetupView({ players, addPlayer, removePlayer, startGame }: SetupViewProps) {
    const [newPlayerName, setNewPlayerName] = useState("")

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault()
        addPlayer(newPlayerName)
        setNewPlayerName("")
    }

    return (
        <div className="flex flex-col h-full items-center justify-center p-6 max-w-lg mx-auto">
            <div className="w-full bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-black border-r-black shadow-[8px_8px_0_#000] p-1">
                {/* Title Bar */}
                <div className="bg-[#000080] px-2 py-1 mb-4 flex justify-between items-center">
                    <span className="font-bold text-white tracking-widest">MENTIROSO.EXE - SETUP</span>
                    <div className="w-4 h-4 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black"></div>
                </div>

                <div className="p-4 flex flex-col gap-6">
                    <header className="text-center border-b-2 border-black pb-4">
                        <h1 className="text-4xl font-bold tracking-tighter text-black retro-text-shadow mb-2">
                            MENTIROSO
                        </h1>
                        <p className="text-sm font-bold bg-yellow-200 inline-block px-2 border border-black rotate-1">
                            THE ULTIMATE DICE GAME
                        </p>
                    </header>

                    {/* Player List */}
                    <div className="h-64 overflow-y-auto border-2 border-inset border-gray-500 bg-white p-2">
                        {players.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <UserPlusIcon className="w-8 h-8 mb-2" />
                                <p className="font-bold">WAITING FOR PLAYERS...</p>
                            </div>
                        ) : (
                            <ul className="space-y-1">
                                {players.map((p) => (
                                    <li key={p.id} className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white group cursor-default">
                                        <span className="font-mono font-bold text-lg">› {p.name}</span>
                                        <button
                                            onClick={() => removePlayer(p.id)}
                                            className="text-red-600 font-bold group-hover:text-white px-2"
                                        >
                                            [DEL]
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleAddPlayer} className="flex gap-2">
                        <input
                            type="text"
                            autoFocus
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="ENTER NAME..."
                            className="flex-1 bg-white border-2 border-inset border-gray-500 px-2 py-2 text-lg font-mono outline-none focus:bg-yellow-100"
                        />
                        <button
                            type="submit"
                            disabled={!newPlayerName.trim()}
                            className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black px-4 active:border-inset disabled:opacity-50 font-bold"
                        >
                            ADD
                        </button>
                    </form>

                    <div className="border-t-2 border-gray-400 pt-4">
                        <button
                            onClick={startGame}
                            disabled={players.length < 2}
                            className="w-full py-3 bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-black border-r-black text-black font-black text-xl hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-b-white active:border-r-white disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                        >
                            START GAME
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
