export interface Player {
    id: string
    name: string
    strikes: number
}

export type GameState = "setup" | "playing" | "gameover"
