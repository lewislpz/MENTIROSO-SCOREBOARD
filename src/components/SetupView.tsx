import { useState } from "react"
import type { Player } from "../types"
import { Users, UserPlus, X, Play } from "lucide-react"

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
        if (!newPlayerName.trim()) return
        addPlayer(newPlayerName)
        setNewPlayerName("")
    }

    return (
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-6 max-w-2xl mx-auto">
            <div className="w-full glass-card rounded-3xl p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Users size={120} />
                </div>

                <header className="mb-10 relative">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-3">
                        MENTIROSO
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-12 bg-indigo-500"></span>
                        <p className="text-indigo-400 font-medium tracking-widest uppercase text-sm">
                            Scoreboard Elite
                        </p>
                    </div>
                </header>

                <div className="space-y-8 relative">
                    {/* Add Player Input */}
                    <form onSubmit={handleAddPlayer} className="relative group">
                        <input
                            type="text"
                            autoFocus
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="Add player name..."
                            className="w-full modern-input rounded-2xl py-4 pl-6 pr-16 text-xl"
                        />
                        <button
                            type="submit"
                            disabled={!newPlayerName.trim()}
                            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl modern-button disabled:opacity-0 disabled:scale-95 transition-all"
                        >
                            <UserPlus size={24} />
                        </button>
                    </form>

                    {/* Players List */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider">
                                Players ({players.length})
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {players.length === 0 ? (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
                                    <Users className="mb-3 opacity-20" size={40} />
                                    <p className="font-medium italic">Empty lobby...</p>
                                </div>
                            ) : (
                                players.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 transition-all hover:bg-slate-700/50 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                            <span className="font-bold text-lg truncate max-w-[150px]">{p.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removePlayer(p.id)}
                                            className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={startGame}
                        disabled={players.length < 2}
                        className="w-full py-5 rounded-2xl modern-button text-white font-black text-xl flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
                    >
                        <Play fill="currentColor" size={24} />
                        START MATCH
                    </button>
                </div>
            </div>

            <p className="mt-8 text-slate-500 font-medium text-sm">
                Built for the ultimate dice challenge
            </p>
        </div>
    )
}

