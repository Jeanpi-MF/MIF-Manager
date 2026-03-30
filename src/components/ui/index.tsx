'use client'
import { ReactNode, useEffect } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

// ─── BADGE ────────────────────────────────────────────────────────
type BadgeVariant = 'mono' | 'color' | 'versa' | 'alta' | 'conf-alta' | 'conf-media' | 'conf-est' | 'default'
const badgeStyles: Record<BadgeVariant, string> = {
  mono:        'bg-bg-4 text-gray-400 border border-border-2',
  color:       'bg-purple-900/30 text-purple-400 border border-purple-800/40',
  versa:       'bg-blue-900/20 text-blue-400 border border-blue-800/30',
  alta:        'bg-emerald-900/20 text-emerald-400 border border-emerald-800/30',
  'conf-alta': 'bg-emerald-900/20 text-emerald-400',
  'conf-media':'bg-amber-900/20 text-amber-400',
  'conf-est':  'bg-bg-4 text-gray-400',
  default:     'bg-bg-4 text-gray-300',
}

export function Badge({ variant = 'default', children, className }: {
  variant?: BadgeVariant; children: ReactNode; className?: string
}) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', badgeStyles[variant], className)}>
      {children}
    </span>
  )
}

// ─── XEROX TAG ────────────────────────────────────────────────────
export function XeroxTag({ model }: { model: string }) {
  const isAlta = model.startsWith('B8') || model.startsWith('C8')
  return (
    <span className={clsx(
      'inline-block font-mono text-xs font-medium px-2 py-0.5 rounded',
      isAlta
        ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800/30'
        : 'bg-blue-900/20 text-blue-400 border border-blue-800/30'
    )}>
      {model}
    </span>
  )
}

// ─── BUTTON ───────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'ghost' | 'danger' | 'success'
const btnStyles: Record<BtnVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  ghost:   'bg-transparent hover:bg-bg-3 text-gray-400 border border-border',
  danger:  'bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-800/30',
  success: 'bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 border border-emerald-800/30',
}

export function Button({ variant = 'primary', size = 'md', children, className, ...props }: {
  variant?: BtnVariant; size?: 'xs' | 'sm' | 'md'; children: ReactNode; className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes = { xs: 'px-2 py-1 text-xs', sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  return (
    <button className={clsx('inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors cursor-pointer', btnStyles[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg-2 border border-border-2 rounded-2xl p-7 w-[580px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl animate-[modalIn_.2s_ease]"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 hover:bg-bg-3 rounded-lg p-1 transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── FIELD ────────────────────────────────────────────────────────
export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{label}</label>
      {children}
    </div>
  )
}

// ─── INPUT / SELECT shared styles ─────────────────────────────────
export const inputCls = 'w-full px-3 py-2 bg-bg-3 border border-border rounded-lg text-gray-200 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600'

// ─── EMPTY STATE ──────────────────────────────────────────────────
export function EmptyState({ icon, text, sub }: { icon: string; text: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600 gap-3">
      <span className="text-4xl opacity-40">{icon}</span>
      <span className="text-sm">{text}</span>
      {sub && <span className="text-xs opacity-60">{sub}</span>}
    </div>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-bg-2 border border-border rounded-xl', className)}>
      {children}
    </div>
  )
}
