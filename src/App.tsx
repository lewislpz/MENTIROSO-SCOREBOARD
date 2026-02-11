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
      className="min-h-screen bg-[#008080] text-black select-none overflow-hidden relative font-mono pt-12 sm:pt-0"
      style={{ minHeight: "100dvh" }}
    >
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
        <GameOverView
          winner={winner}
          onReset={resetGame}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  )
}
