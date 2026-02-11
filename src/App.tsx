import { useState, useEffect } from "react"
import { AlertCircle, Trophy, X } from "lucide-react"

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

function Modal({ children, isOpen, title = "ALERT" }: { children: React.ReactNode; isOpen: boolean; title?: string }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-grayscale-[50%] p-4">
      <div className="bg-[#c0c0c0] w-full max-w-sm border-[3px] border-t-white border-l-white border-b-black border-r-black shadow-[4px_4px_0_#000]">
        <div className="bg-[#000080] px-2 py-1 flex justify-between items-center select-none">
          <span className="font-bold text-white tracking-wider">{title}</span>
          <div className="flex gap-1">
            <button className="bg-[#c0c0c0] w-5 h-5 flex items-center justify-center border border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
              <X size={14} className="text-black" />
            </button>
          </div>
        </div>
        <div className="p-6 text-center text-black font-medium">
          {children}
        </div>
      </div>
    </div>
  )
}

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
      <div className="flex justify-center items-end gap-0 mt-auto">
        {TARGET_LETTERS.map((char, index) => {
          const isActive = index < player.strikes
          return (
            <div
              key={index}
              className={`
                 font-mono font-bold text-2xl
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
      className="min-h-screen bg-[#008080] text-black select-none overflow-hidden relative font-mono pt-12 sm:pt-0"
      style={{ minHeight: '100dvh' }}
    >
      {/* Background Tiling if wanted, or just teal color */}

      {/* Setup View */}
      {gameState === "setup" && (
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
      )}

      {/* Game Grid View */}
      {gameState === "playing" && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center px-4 py-2 bg-[#c0c0c0] border-b-2 border-white shadow-md z-10 shrink-0">
            <div className="flex items-center gap-2 border-2 border-inset border-gray-500 bg-white px-2 py-1">
              <span className="font-bold text-red-600 blink">●</span>
              <span className="text-sm font-mono font-bold uppercase">
                PLAYERS: {players.filter(p => p.strikes < 9).length}
              </span>
            </div>
            <button
              onClick={handleQuitRequest}
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
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <Modal isOpen={true} title="CONFIRM EXIT">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle size={48} className="text-yellow-600" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase">Exit Game?</h2>
              <p className="text-sm font-mono">Unsaved progress will be lost.</p>
            </div>

            <div className="flex gap-4 pt-2 w-full justify-center">
              <button
                onClick={confirmQuit}
                className="px-6 py-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold"
              >
                YES
              </button>
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="px-6 py-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold"
              >
                NO
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Game Over View */}
      {gameState === "gameover" && winner && (
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
                onClick={resetGame}
                className="flex-1 py-2 px-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold text-sm"
              >
                NEW GAME
              </button>
              <button
                onClick={playAgain}
                className="flex-1 py-2 px-2 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black active:border-inset font-bold text-sm"
              >
                REPLAY
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
