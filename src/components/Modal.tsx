import { X } from "lucide-react"

interface ModalProps {
    children: React.ReactNode
    isOpen: boolean
    title?: string
    onClose?: () => void
}

export default function Modal({ children, isOpen, title = "ALERTA", onClose }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal card */}
            <div className="relative glass-card w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border-purple-500/20 animate-scale-in">
                {/* Top glow accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-white/3">
                    <span className="font-bold text-purple-400/80 tracking-widest text-xs uppercase"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        {title}
                    </span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-purple-400/50 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
