import { useState, useEffect } from "react"
import { Plus, Trash2, Undo2, Trophy, RotateCcw, AlertCircle, X } from "lucide-react"

// --- Types ---
interface Player {
  id: string
  name: string
  strikes: number
}

type GameState = "setup" | "playing" | "gameover"

// --- Constants ---
const TARGET_WORD = "MENTIROSO"
// We split to array for easy mapping: ['M', 'E', 'N', 'T', 'I', 'R', 'O', 'S', 'O']
const TARGET_LETTERS = TARGET_WORD.split("")

// --- Custom Hook: Game Logic ---
function useGameLogic() {
  const [players, setPlayers] = useState<Player[]>([])
  const [gameState, setGameState] = useState<GameState>("setup")
  const [winner, setWinner] = useState<Player | null>(null)

  // Add Player
  const addPlayer = (name: string) => {
    if (!name.trim()) return
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      strikes: 0,
    }
    setPlayers((prev) => [...prev, newPlayer])
  }

  // Remove Player (only in setup)
  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  // Start Game
  const startGame = () => {
    if (players.length > 0) {
      setGameState("playing")
    }
  }

  // Add Strike (Letter)
  const addStrike = (playerId: string) => {
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== playerId) return p
        // Can't go over length
        if (p.strikes >= TARGET_LETTERS.length) return p
        return { ...p, strikes: p.strikes + 1 }
      })

      // Check for Game Over logic:
      // In "Mentiroso", usually the last person standing wins, OR 
      // if it's played until someone loses (gets all letters). 
      // Common variation: If everyone except one is eliminated.
      // Or maybe just show who is out.

      // Let's implement: Players get "MENTIROSO". If they get all letters, they are out.
      // If only 1 player remains without full letters, they win?
      // Or is it just a scoreboard? 
      // The request says "GameOver: Overlay modal cuando alguien gana".
      // Usually in these games, you play until someone loses. 
      // But let's assume standard elimination: last standing wins.

      return updated
    })
  }

  // Undo Strike
  const undoStrike = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== playerId) return p
        return { ...p, strikes: Math.max(0, p.strikes - 1) }
      })
    )
  }

  const resetGame = () => {
    setPlayers([])
    setGameState("setup")
    setWinner(null)
  }

  const playAgain = () => {
    // Keep players, reset strikes
    setPlayers(prev => prev.map(p => ({ ...p, strikes: 0 })))
    setGameState("playing")
    setWinner(null)
  }

  // Check for winner effect
  useEffect(() => {
    if (gameState !== "playing" || players.length < 2) return

    const activePlayers = players.filter(p => p.strikes < TARGET_LETTERS.length)

    if (activePlayers.length === 1) {
      // We have a winner!
      setWinner(activePlayers[0])
      setGameState("gameover")
    } else if (activePlayers.length === 0 && players.length > 0) {
      // Everyone lost? (Rare edge case)
      setGameState("gameover")
    }
  }, [players, gameState])

  return {
    players,
    gameState,
    winner,
    addPlayer,
    removePlayer,
    startGame,
    addStrike,
    undoStrike,
    resetGame,
    playAgain
  }
}

// --- Components ---

// 1. Modal Component
function Modal({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  )
}

// 2. Player Card Component
function PlayerCard({
  player,
  onTap,
  onUndo
}: {
  player: Player
  onTap: () => void
  onUndo: (e: React.MouseEvent) => void
}) {
  const isOut = player.strikes >= TARGET_LETTERS.length

  return (
    <div
      onClick={isOut ? undefined : onTap}
      className={`
        relative overflow-hidden group
        rounded-xl border-2 transition-all duration-200 touch-manipulation
        ${isOut
          ? "bg-red-950/30 border-red-900/50 opacity-50 grayscale"
          : "bg-zinc-900/80 border-white/20 active:scale-[0.98] active:border-red-500/50 hover:border-white/40"
        }
        h-36 sm:h-44 flex flex-col justify-between p-5
        backdrop-blur-md select-none cursor-pointer
        shadow-[0_4px_20px_rgba(0,0,0,0.5)]
      `}
    >
      {/* Header: Name + Undo */}
      <div className="flex justify-between items-start">
        <h3 className={`font-black uppercase tracking-wider text-xl truncate pr-8 ${isOut ? "text-red-700 line-through" : "text-white"}`}>
          {player.name}
        </h3>

        {player.strikes > 0 && !isOut && (
          <button
            onClick={onUndo}
            className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-red-500/20 rounded-full text-zinc-500 hover:text-red-400 transition-colors"
            aria-label="Undo strike"
          >
            <Undo2 size={20} />
          </button>
        )}
      </div>

      {/* Letters Display */}
      <div className="flex justify-center items-end gap-[2px] sm:gap-1 mt-auto mb-1">
        {TARGET_LETTERS.map((char, index) => {
          const isActive = index < player.strikes
          const isJustAdded = index === player.strikes - 1

          return (
            <div
              key={index}
              className={`
                 font-black text-2xl sm:text-3xl
                 w-7 sm:w-9 text-center leading-none
                 transition-all duration-200
                 ${isActive
                  ? "text-red-600 transform scale-100 filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                  : "text-zinc-800 transform scale-90"
                }
                 ${isJustAdded ? "scale-125 text-red-500" : ""}
              `}
            >
              {char}
            </div>
          )
        })}
      </div>

      {/* Visual Indicator for "OUT" */}
      {isOut && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/80 backdrop-blur-sm border-4 border-red-600 text-red-600 font-black text-4xl -rotate-12 py-2 px-6 rounded-xl shadow-2xl">
            OUT
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { players, gameState, winner, addPlayer, removePlayer, startGame, addStrike, undoStrike, resetGame, playAgain } = useGameLogic()
  const [newPlayerName, setNewPlayerName] = useState("")
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)

  // Check viewport height for mobile browser bar issues
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener('resize', setVh)
    return () => window.removeEventListener('resize', setVh)
  }, [])

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    addPlayer(newPlayerName)
    setNewPlayerName("")
  }

  const handleQuitRequest = () => {
    setShowQuitConfirm(true)
  }

  const confirmQuit = () => {
    resetGame()
    setShowQuitConfirm(false)
  }

  return (
    <div
      className="min-h-screen bg-black text-white select-none overflow-hidden relative font-sans"
      style={{ minHeight: '100dvh' }}
    >
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(50,0,0,0.4),rgba(0,0,0,1))]" />

      {/* Setup View */}
      {gameState === "setup" && (
        <div className="relative z-10 flex flex-col h-full items-center p-6 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="flex-1 w-full flex flex-col gap-8 pt-12">
            <header className="text-center space-y-2">
              <h1 className="text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                <span className="text-red-600">MENTIROSO</span>
              </h1>
              <p className="text-base text-zinc-500 font-medium tracking-widest uppercase">The Ultimate Dice Game</p>
            </header>

            {/* Player List */}
            <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
              {players.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-700">
                  <UserPlusIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-bold">ADD PLAYERS</p>
                </div>
              ) : (
                players.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl animate-in slide-in-from-bottom-2 shadow-lg">
                    <span className="font-bold text-xl">{p.name}</span>
                    <button
                      onClick={() => removePlayer(p.id)}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddPlayer} className="w-full relative group">
              <input
                type="text"
                autoFocus
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="PLAYER NAME"
                className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 rounded-xl px-4 py-4 pr-16 text-xl font-bold uppercase outline-none transition-all placeholder:text-zinc-700 text-white"
              />
              <button
                type="submit"
                disabled={!newPlayerName.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all shadow-[0_0_10px_rgba(220,38,38,0.4)]"
              >
                <Plus size={28} />
              </button>
            </form>
          </div>

          <div className="w-full pt-6 pb-[env(safe-area-inset-bottom)]">
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full bg-white text-black font-black text-2xl py-5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all uppercase tracking-wide hover:bg-gray-200"
            >
              START GAME
            </button>
          </div>
        </div>
      )}

      {/* Game Grid View */}
      {gameState === "playing" && (
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">
                {players.filter(p => p.strikes < 9).length} ALIVE
              </span>
            </div>
            <button
              onClick={handleQuitRequest}
              className="p-2 -mr-2 text-zinc-600 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </header>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4 pb-32">
            <div className={`grid gap-4 ${players.length >= 4 ? 'grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
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
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <Modal isOpen={true}>
          <div className="text-center space-y-6">
            <div className="inline-block p-4 rounded-full bg-red-900/30 text-red-500 mb-2">
              <AlertCircle size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase">End Game?</h2>
              <p className="text-zinc-400 text-sm font-medium uppercase">Current progress will be lost.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm font-bold uppercase tracking-wide text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuit}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 transition-colors text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-red-900/20"
              >
                End Game
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Game Over View */}
      {gameState === "gameover" && winner && (
        <Modal isOpen={true}>
          <div className="text-center space-y-8">
            <div className="inline-block p-6 rounded-full bg-red-600 text-white mb-2 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-bounce">
              <Trophy size={64} />
            </div>

            <div className="space-y-2">
              <h2 className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em]">Survivor</h2>
              <h1 className="text-5xl font-black text-white uppercase">{winner.name}</h1>
            </div>

            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 text-sm text-zinc-400">
              <p>Everyone else is a</p>
              <p className="text-red-600 font-black text-3xl mt-2 tracking-widest animate-pulse">MENTIROSO</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={resetGame}
                className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-zinc-800 border-2 border-transparent hover:border-zinc-600 transition-colors text-sm font-bold uppercase tracking-wide"
              >
                <RotateCcw size={18} /> Lobby
              </button>
              <button
                onClick={playAgain}
                className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors text-sm font-black uppercase tracking-wide shadow-lg"
              >
                <Undo2 size={18} /> Play Again
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="25" y2="8" /><line x1="22" y1="5" x2="22" y2="11" />
    </svg>
  )
}
