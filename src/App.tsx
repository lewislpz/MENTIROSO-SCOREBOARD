import { useState, useEffect } from "react"
import { AlertCircle, Skull } from "lucide-react"

// Hooks
import { useGameLogic } from "./hooks/useGameLogic"

// Components
import ParticleBackground from "./components/ParticleBackground"
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

  // Viewport height fix for mobile browsers
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
      {/* Animated background */}
      <ParticleBackground />

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
          title="CONFIRMAR SALIDA"
          onClose={() => setShowQuitConfirm(false)}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center border border-red-500/20">
                <Skull size={32} className="text-red-400" />
              </div>
              <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full" />
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black text-white tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ¿Salir?
              </h2>
              <p className="text-purple-300/50 font-medium text-sm">
                El progreso de esta partida se perderá.
              </p>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-3.5 px-4 rounded-xl ghost-button text-xs uppercase tracking-wider font-bold transition-all"
              >
                Quedarme
              </button>
              <button
                onClick={confirmQuit}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "white",
                  boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                Salir
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
