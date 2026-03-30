'use client'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Equivalence } from '@/types'
import { Button, Modal, Field, inputCls, EmptyState, Badge, XeroxTag } from '@/components/ui'
import { getCatalogGroups } from '@/lib/catalog'

const BRANDS = ['Ricoh','Canon','Epson','HP','Lexmark','Konica Minolta','Sharp','Kyocera','Brother','Samsung','Toshiba']

function EquivForm({ onSave, onClose }: {
  onSave: (d: Omit<Equivalence, 'id' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [f, setF] = useState({ brand: '', model: '', type: 'mono' as 'mono'|'color', format: 'A4' as 'A4'|'A3', volBN: 0, volColor: 0, xerox: '', notes: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: (k === 'volBN' || k === 'volColor') ? parseInt(e.target.value) || 0 : e.target.value }))

  const groups = getCatalogGroups()

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Marca original">
          <input className={inputCls} value={f.brand} onChange={set('brand')} placeholder="ej: Ricoh" list="brands-eq" />
          <datalist id="brands-eq">{BRANDS.map(b => <option key={b} value={b} />)}</datalist>
        </Field>
        <Field label="Modelo original"><input className={inputCls} value={f.model} onChange={set('model')} placeholder="ej: IM 430F" /></Field>
        <Field label="Tipo">
          <select className={inputCls} value={f.type} onChange={set('type')}>
            <option value="mono">Mono B&N</option><option value="color">Color</option>
          </select>
        </Field>
        <Field label="Formato">
          <select className={inputCls} value={f.format} onChange={set('format')}>
            <option value="A4">A4</option><option value="A3">A3</option>
          </select>
        </Field>
        <Field label="Vol. B&N mensual"><input className={inputCls} type="number" min={0} value={f.volBN || ''} onChange={set('volBN')} placeholder="0" /></Field>
        <Field label="Vol. Color mensual"><input className={inputCls} type="number" min={0} value={f.volColor || ''} onChange={set('volColor')} placeholder="0" /></Field>
        <Field label="Modelo Xerox equivalente" className="col-span-2">
          <select className={inputCls} value={f.xerox} onChange={set('xerox')}>
            <option value="">Seleccionar modelo...</option>
            {groups.map(g => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map(x => <option key={x.model} value={x.model}>{x.model} — {x.desc}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Notas" className="col-span-2"><input className={inputCls} value={f.notes} onChange={set('notes')} placeholder="Observaciones opcionales" /></Field>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-border">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => {
          if (!f.brand || !f.model || !f.xerox) { alert('Completa marca, modelo y Xerox equivalente.'); return }
          onSave(f)
        }}>Guardar equivalencia</Button>
      </div>
    </>
  )
}

export function Equivalences({ equivalences, onAdd, onDelete }: {
  equivalences: Equivalence[]
  onAdd: (d: Omit<Equivalence, 'id' | 'createdAt'>) => void
  onDelete: (id: number) => void
}) {
  const [modal, setModal] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Equivalencias</h2>
          <p className="text-xs text-gray-500 mt-0.5">Base de conocimiento del equipo de pre venta</p>
        </div>
        <Button size="sm" onClick={() => setModal(true)}><Plus size={13} /> Nueva equivalencia</Button>
      </div>

      {equivalences.length === 0
        ? <EmptyState icon="↔️" text="Sin equivalencias" sub="Agrega la primera" />
        : (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-3">
                  {['Marca','Modelo','Tipo','Vol B&N','Vol Color','Xerox','Serie','Notas',''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 border-b border-border whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equivalences.map(e => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-bg-3/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-200">{e.brand}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{e.model}</td>
                    <td className="px-4 py-3"><Badge variant={e.type === 'mono' ? 'mono' : 'color'}>{e.type === 'mono' ? 'Mono' : 'Color'}</Badge></td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{e.volBN ? e.volBN.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{e.volColor ? e.volColor.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3"><XeroxTag model={e.xerox} /></td>
                    <td className="px-4 py-3"><Badge variant={e.xerox.startsWith('B8')||e.xerox.startsWith('C8') ? 'alta' : 'versa'}>{e.xerox.startsWith('B8')||e.xerox.startsWith('C8') ? 'AltaLink' : 'VersaLink'}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{e.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <Button variant="danger" size="xs" onClick={() => { if (confirm('¿Eliminar esta equivalencia?')) onDelete(e.id) }}><Trash2 size={10} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      <Modal open={modal} onClose={() => setModal(false)} title="Nueva equivalencia">
        <EquivForm onSave={d => { onAdd(d); setModal(false) }} onClose={() => setModal(false)} />
      </Modal>
    </div>
  )
}
