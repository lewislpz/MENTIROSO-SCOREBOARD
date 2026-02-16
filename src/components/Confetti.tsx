import { useMemo } from "react"

const COLORS = ["#a855f7", "#ec4899", "#06b6d4", "#fbbf24", "#22c55e", "#f97316", "#ef4444"]

export default function Confetti() {
    const pieces = useMemo(() => {
        return Array.from({ length: 60 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 10 + 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            delay: Math.random() * 2,
            duration: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            shape: Math.random() > 0.5 ? "circle" : "rect",
        }))
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: `${p.left}%`,
                        top: "-20px",
                        width: p.shape === "circle" ? `${p.size}px` : `${p.size * 0.6}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        borderRadius: p.shape === "circle" ? "50%" : "2px",
                        animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
                        transform: `rotate(${p.rotation}deg)`,
                        opacity: 0.9,
                    }}
                />
            ))}
        </div>
    )
}
