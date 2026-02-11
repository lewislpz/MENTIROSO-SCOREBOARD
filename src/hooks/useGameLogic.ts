import { useState, useEffect } from "react"
import type { Player, GameState } from "../types"
import { TARGET_LETTERS } from "../constants/game"

export function useGameLogic() {
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
