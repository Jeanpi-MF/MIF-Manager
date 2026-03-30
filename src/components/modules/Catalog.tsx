'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { getCatalogGroups } from '@/lib/catalog'
import { clsx } from 'clsx'

const GROUP_COLORS: Record<string, string> = {
  'VersaLink B&N (A4)':  'border-l-blue-500  text-blue-400',
  'VersaLink B&N (A3)':  'border-l-blue-400  text-blue-400',
  'VersaLink Color (A4)':'border-l-purple-500 text-purple-400',
  'VersaLink Color (A3)':'border-l-purple-400 text-purple-400',
  'AltaLink B&N':        'border-l-emerald-500 text-emerald-400',
  'AltaLink Color':      'border-l-amber-500  text-amber-400',
}

export function Catalog() {
  const [query, setQuery] = useState('')
  const groups = getCatalogGroups()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Catálogo Xerox</h2>
          <p className="text-xs text-gray-500 mt-0.5">VersaLink y AltaLink — referencia completa</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input className="pl-8 pr-4 py-2 bg-bg-3 border border-border rounded-lg text-sm text-gray-300 outline-none focus:border-blue-500 w-56 placeholder:text-gray-600"
            placeholder="Buscar modelo..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {groups.map(g => {
          const filtered = g.items.filter(x =>
            !query || x.model.toLowerCase().includes(query.toLowerCase()) || x.desc.toLowerCase().includes(query.toLowerCase())
          )
          const [colorBorder, colorText] = (GROUP_COLORS[g.label] ?? 'border-l-gray-500 text-gray-400').split(' ')
          return (
            <div key={g.label} className={`bg-bg-2 border border-border rounded-xl overflow-hidden border-l-2 ${colorBorder}`}>
              <div className="px-5 py-3.5 border-b border-border">
                <p className={`text-sm font-semibold ${colorText}`}>{g.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{g.items.length} modelos · {g.items[0]?.format}</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {filtered.length === 0
                  ? <p className="text-xs text-gray-600 text-center py-5">Sin resultados</p>
                  : filtered.map(x => (
                    <div key={x.model} className="flex items-center gap-3 px-5 py-2.5 hover:bg-bg-3 transition-colors">
                      <span className={`font-mono text-xs font-semibold min-w-[56px] ${colorText}`}>{x.model}</span>
                      <span className="text-xs text-gray-500 flex-1">{x.desc}</span>
                      <span className="text-[10px] font-semibold bg-bg-4 text-gray-500 px-1.5 py-0.5 rounded">{x.format}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
