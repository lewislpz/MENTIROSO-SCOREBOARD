import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

// Hooks
import { useGameLogic } from "./hooks/useGameLogic"

// Components
import Modal from "./components/Modal"
import SetupView from "./components/SetupView"
import GameView from "./components/GameView"
import GameOverView from "./components/GameOverView"

export default function App() {
  const {
    players,
    gameState,
    winner,
    addPlayer,
    removePlayer,
    startGame,
    addStrike,
    undoStrike,
    resetGame,
    playAgain,
  } = useGameLogic()

  const [showQuitConfirm, setShowQuitConfirm] = useState(false)

  // Check viewport height for mobile browser bar issues
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener("resize", setVh)
    return () => window.removeEventListener("resize", setVh)
  }, [])

  const handleQuitRequest = () => {
    setShowQuitConfirm(true)
  }

  const confirmQuit = () => {
    resetGame()
    setShowQuitConfirm(false)
  }

  return (
    <div
      className="min-h-screen text-white select-none overflow-hidden relative"
      style={{ minHeight: "100dvh" }}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15)_0%,transparent_50%)] pointer-events-none" />

      {/* Setup View */}
      {gameState === "setup" && (
        <SetupView
          players={players}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          startGame={startGame}
        />
      )}

      {/* Game Grid View */}
      {gameState === "playing" && (
        <GameView
          players={players}
          addStrike={addStrike}
          undoStrike={undoStrike}
          onQuitRequest={handleQuitRequest}
        />
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <Modal
          isOpen={true}
          title="CONFIRM EXIT"
          onClose={() => setShowQuitConfirm(false)}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <AlertCircle size={32} className="text-red-400" />
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black text-white tracking-tight">End Match?</h2>
              <p className="text-slate-400 font-medium">Progress for this session will be lost.</p>
            </div>

            <div className="flex gap-3 w-full pt-4">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl modern-input font-bold hover:bg-white/10 transition-all border-white/10"
              >
                STAY
              </button>
              <button
                onClick={confirmQuit}
                className="flex-1 py-3 px-4 rounded-xl modern-button bg-red-500 hover:bg-red-600 font-bold transition-all shadow-lg"
              >
                QUIT
              </button>
            </div>
          </div>
        </Modal>
      )}


      {/* Game Over View */}
      {gameState === "gameover" && winner && (
        <GameOverView
          winner={winner}
          onReset={resetGame}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  )
}
