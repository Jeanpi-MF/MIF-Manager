'use client'
import { Client, Device } from '@/types'
import { XeroxTag } from '@/components/ui'

interface Props {
  clients: Client[]
  devices: Record<number, Device[]>
  equivalencesCount: number
  onViewClient: (id: number) => void
}

export function Dashboard({ clients, devices, equivalencesCount, onViewClient }: Props) {
  const allDevices = Object.values(devices).flat()
  const totalUnits = allDevices.reduce((s, d) => s + (d.quantity ?? 1), 0)

  // Ranking
  const ranking: Record<string, { count: number; serie: string }> = {}
  allDevices.forEach(d => {
    if (!d.xerox) return
    if (!ranking[d.xerox]) ranking[d.xerox] = { count: 0, serie: d.serie }
    ranking[d.xerox].count += d.quantity ?? 1
  })
  const sorted = Object.entries(ranking).sort((a, b) => b[1].count - a[1].count).slice(0, 6)
  const maxVal = sorted[0]?.[1].count ?? 1

  const stats = [
    { label: 'Clientes registrados', value: clients.length,         color: 'border-t-blue-500' },
    { label: 'Equipos levantados',   value: allDevices.length,       color: 'border-t-emerald-500' },
    { label: 'Unidades totales',      value: totalUnits,              color: 'border-t-amber-500' },
    { label: 'Equivalencias',         value: equivalencesCount,       color: 'border-t-purple-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-bg-2 border border-border rounded-xl p-5 border-t-2 ${s.color}`}>
            <div className="text-3xl font-semibold font-mono text-white">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Últimos clientes */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Últimos clientes</p>
          {clients.length === 0 ? (
            <p className="text-sm text-gray-600 py-6 text-center">Sin clientes aún</p>
          ) : (
            <div className="space-y-1">
              {clients.slice(0, 5).map(c => {
                const n = (devices[c.id] ?? []).length
                return (
                  <button key={c.id} onClick={() => onViewClient(c.id)}
                    className="w-full flex justify-between items-center py-2.5 border-b border-border last:border-0 hover:bg-bg-3 px-2 rounded-lg transition-colors text-left">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.ref || 'Sin referencia'}</p>
                    </div>
                    <span className="text-xs text-gray-500">{n} equipo{n !== 1 ? 's' : ''}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Ranking */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Modelos más sugeridos</p>
          {sorted.length === 0 ? (
            <p className="text-sm text-gray-600 py-6 text-center">Sin datos aún</p>
          ) : (
            <div className="space-y-2">
              {sorted.map(([model, { count }]) => (
                <div key={model} className="flex items-center gap-3">
                  <XeroxTag model={model} />
                  <div className="flex-1 h-1.5 bg-bg-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${model.startsWith('B8') || model.startsWith('C8') ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.round(count / maxVal * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
