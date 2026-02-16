import { useMemo } from "react"

export default function ParticleBackground() {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 1,
            left: Math.random() * 100,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 10,
            color: [
                "rgba(168, 85, 247, 0.3)",
                "rgba(236, 72, 153, 0.25)",
                "rgba(6, 182, 212, 0.2)",
                "rgba(251, 191, 36, 0.15)",
            ][Math.floor(Math.random() * 4)],
        }))
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Gradient orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-2s" }} />
            <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: "-4s" }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-50" />

            {/* Particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.left}%`,
                        background: p.color,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                    }}
                />
            ))}
        </div>
    )
}
