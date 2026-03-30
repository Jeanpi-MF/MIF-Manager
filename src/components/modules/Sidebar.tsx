'use client'
import { LayoutDashboard, Users, ArrowLeftRight, BookOpen } from 'lucide-react'
import { clsx } from 'clsx'

export type Page = 'dashboard' | 'clients' | 'equivalences' | 'catalog'

const NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',    label: 'Dashboard',     icon: <LayoutDashboard size={15} /> },
  { id: 'clients',      label: 'Clientes',       icon: <Users size={15} /> },
  { id: 'equivalences', label: 'Equivalencias',  icon: <ArrowLeftRight size={15} /> },
  { id: 'catalog',      label: 'Catálogo Xerox', icon: <BookOpen size={15} /> },
]

export function Sidebar({ current, onChange }: { current: Page; onChange: (p: Page) => void }) {
  return (
    <aside className="w-[210px] bg-bg-2 border-r border-border flex flex-col fixed top-0 left-0 h-screen z-50">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <p className="text-[10px] font-semibold tracking-[3px] text-blue-500 uppercase font-mono">Xerox</p>
        <p className="text-[18px] font-semibold text-white mt-0.5 tracking-tight">
          MIF<span className="text-blue-500">Manager</span>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 flex flex-col gap-1">
        <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-gray-600 px-3 mb-1">Menú</p>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left w-full',
              current === item.id
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-gray-500 hover:bg-bg-3 hover:text-gray-300'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-gray-600 font-mono">v2.0 · Pre Venta</p>
      </div>
    </aside>
  )
}
