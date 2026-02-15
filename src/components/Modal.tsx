import { X } from "lucide-react"

interface ModalProps {
    children: React.ReactNode
    isOpen: boolean
    title?: string
    onClose?: () => void
}

export default function Modal({ children, isOpen, title = "ALERT", onClose }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative glass-card w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border-white/10 animate-in fade-in zoom-in duration-300">
                <div className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-white/5">
                    <span className="font-black text-indigo-400 tracking-widest text-xs uppercase">{title}</span>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
