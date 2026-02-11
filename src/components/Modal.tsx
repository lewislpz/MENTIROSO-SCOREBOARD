import { X } from "lucide-react"

export default function Modal({ children, isOpen, title = "ALERT" }: { children: React.ReactNode; isOpen: boolean; title?: string }) {
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
