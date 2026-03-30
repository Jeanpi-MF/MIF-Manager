'use client'
import { useState, useMemo } from 'react'
import { Plus, Search, ArrowLeft, Download, Pencil, Trash2, Upload, FileSpreadsheet } from 'lucide-react'
import { Client, Device, Equivalence } from '@/types'
import { Button, Modal, Field, inputCls, EmptyState, Badge, XeroxTag } from '@/components/ui'
import { suggest, detectFormat } from '@/lib/suggest'
import { exportClientMIF } from '@/lib/export'
import { COMPETITOR_BRANDS, getModelsByBrand, findCompetitor } from '@/lib/competitors'
import { parseExcel, rowsToDevices } from '@/lib/importExcel'
import * as XLSX from 'xlsx'
import { clsx } from 'clsx'

// ─── PLANTILLA EXCEL ──────────────────────────────────────────────
function downloadTemplate() {
  const headers = ['Ubicación', 'Equipo (Marca)', 'Modelo actual', 'Volumen BN', 'Volumen Color', 'Distrito', 'Cantidad']
  const example = [
    ['Oficina Lima Piso 3', 'Ricoh', 'IM 430F', 3000, 0, 'Miraflores', 2],
    ['Sede Callao', 'Canon', 'iR 2625i', 8000, 0, 'Callao', 1],
    ['Oficina San Isidro', 'HP', 'LaserJet Pro M428fdn', 4000, 0, 'San Isidro', 1],
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, ...example])
  ws['!cols'] = headers.map((_, i) => ({ wch: [20, 18, 28, 14, 16, 16, 10][i] }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Equipos')
  XLSX.writeFile(wb, 'Plantilla_MIF.xlsx')
}

// ─── CLIENT FORM ──────────────────────────────────────────────────
function ClientForm({ initial, onSave, onClose }: {
  initial?: Partial<Client>
  onSave: (data: Omit<Client, 'id' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [f, setF] = useState({
    name:          initial?.name          ?? '',
    ruc:           initial?.ruc           ?? '',
    ref:           initial?.ref           ?? '',
    manager:       initial?.manager       ?? '',
    needsSoftware: initial?.needsSoftware ?? false,
  })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre del cliente">
          <input className={inputCls} value={f.name} onChange={set('name')} placeholder="ej: Empresa SAC" />
        </Field>
        <Field label="RUC">
          <input className={inputCls} value={f.ruc} onChange={set('ruc')} placeholder="20123456789" />
        </Field>
        <Field label="Referencia / N° MIF">
          <input className={inputCls} value={f.ref} onChange={set('ref')} placeholder="MIF-2024-001" />
        </Field>
        <Field label="Gestor de cuenta">
          <input className={inputCls} value={f.manager} onChange={set('manager')} placeholder="ej: Juan Pérez" />
        </Field>
        <Field label="¿Requiere software?" className="col-span-2">
          <div className="flex gap-3">
            {([true, false] as const).map(val => (
              <button key={String(val)} type="button"
                onClick={() => setF(p => ({ ...p, needsSoftware: val }))}
                className={clsx(
                  'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                  f.needsSoftware === val
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-bg-3 border-border text-gray-400 hover:border-blue-800/50'
                )}>
                {val ? 'Sí' : 'No'}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-border">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => {
          if (!f.name.trim()) { alert('Ingresa el nombre del cliente.'); return }
          onSave(f)
        }}>Guardar</Button>
      </div>
    </>
  )
}

// ─── DEVICE FORM ──────────────────────────────────────────────────
function DeviceForm({ equivalences, needsSoftware, onSave, onClose }: {
  equivalences: Equivalence[]
  needsSoftware: boolean
  onSave: (data: Omit<Device, 'id' | 'clientId'>) => void
  onClose: () => void
}) {
  const [f, setF] = useState({
    brand: '', model: '', quantity: 1,
    format: 'A4' as 'A4' | 'A3',
    volBN: 0, volColor: 0, location: '', district: ''
  })

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: (k === 'quantity' || k === 'volBN' || k === 'volColor') ? parseInt(e.target.value) || 0 : e.target.value }))

  const brandModels = useMemo(() => getModelsByBrand(f.brand), [f.brand])

  const detectedFormat = useMemo(() => {
    if (!f.brand && !f.model) return null
    const inDB = findCompetitor(f.brand, f.model)
    const heuristic = detectFormat(f.brand, f.model, undefined)
    if (inDB || heuristic !== f.format) return heuristic
    return null
  }, [f.brand, f.model, f.format])

  const formatAuto = detectedFormat && detectedFormat !== f.format

  const sug = (f.brand || f.model || f.volBN)
    ? suggest(f.brand, f.model, f.volBN, f.volColor, f.format, equivalences, needsSoftware)
    : null

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Marca actual">
          <input className={inputCls} value={f.brand} onChange={set('brand')} placeholder="ej: HP" list="brands-list" />
          <datalist id="brands-list">{COMPETITOR_BRANDS.map(b => <option key={b} value={b} />)}</datalist>
        </Field>
        <Field label="Modelo actual">
          <input className={inputCls} value={f.model} onChange={set('model')} placeholder="ej: LaserJet Pro M428fdn" list="models-list" />
          <datalist id="models-list">{brandModels.map(d => <option key={d.model} value={d.model} />)}</datalist>
        </Field>
        <Field label="Cantidad">
          <input className={inputCls} type="number" min={1} value={f.quantity} onChange={set('quantity')} />
        </Field>
        <Field label="Formato papel">
          <div className="flex gap-2 items-center">
            <select className={inputCls} value={f.format} onChange={set('format')}>
              <option value="A4">A4</option><option value="A3">A3</option>
            </select>
            {detectedFormat && (
              <span className={clsx(
                'text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap border',
                detectedFormat === 'A3'
                  ? 'bg-amber-900/20 text-amber-400 border-amber-800/30'
                  : 'bg-blue-900/10 text-blue-400 border-blue-800/20'
              )}>
                Auto: {detectedFormat}
              </span>
            )}
          </div>
          {formatAuto && (
            <p className="text-[11px] text-amber-400 mt-1">
              ⚠ Equipo detectado como {detectedFormat} — ajusta si es necesario
            </p>
          )}
        </Field>
        <Field label="Volumen B&N mensual (págs)">
          <input className={inputCls} type="number" min={0} value={f.volBN || ''} onChange={set('volBN')} placeholder="0" />
        </Field>
        <Field label="Volumen Color mensual (págs)">
          <input className={inputCls} type="number" min={0} value={f.volColor || ''} onChange={set('volColor')} placeholder="0" />
        </Field>
        <Field label="Ubicación / sede">
          <input className={inputCls} value={f.location} onChange={set('location')} placeholder="ej: Oficina Lima - Piso 3" />
        </Field>
        <Field label="Distrito">
          <input className={inputCls} value={f.district} onChange={set('district')} placeholder="ej: Miraflores" />
        </Field>
      </div>

      {sug && (
        <div className="mt-4 bg-blue-900/10 border border-blue-800/30 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">Xerox sugerido</p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono text-lg font-medium text-blue-400">{sug.xerox}</p>
              <span className={clsx(
                'text-xs font-semibold px-2 py-0.5 rounded border',
                sug.detectedFormat === 'A3'
                  ? 'bg-amber-900/20 text-amber-400 border-amber-800/30'
                  : 'bg-blue-900/10 text-blue-400 border-blue-800/20'
              )}>{sug.detectedFormat}</span>
              <Badge variant={sug.serie === 'AltaLink' ? 'alta' : 'versa'}>{sug.serie}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">{sug.reason}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">Confianza</p>
            <Badge variant={sug.confidence === 'Alta' ? 'conf-alta' : sug.confidence === 'Media' ? 'conf-media' : 'conf-est'}>
              {sug.confidence}
            </Badge>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-border">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={() => {
          if (!f.brand || !f.model) { alert('Ingresa marca y modelo.'); return }
          const s = suggest(f.brand, f.model, f.volBN, f.volColor, f.format, equivalences, needsSoftware)
          onSave({ ...f, format: s.detectedFormat, xerox: s.xerox, serie: s.serie, confidence: s.confidence, reason: s.reason })
        }}>
          Agregar equipo
        </Button>
      </div>
    </>
  )
}

// ─── CLIENT DETAIL ────────────────────────────────────────────────
function ClientDetail({ client, devices, equivalences, onBack, onAddDevice, onAddDevices, onDeleteDevice }: {
  client: Client
  devices: Device[]
  equivalences: Equivalence[]
  onBack: () => void
  onAddDevice: (data: Omit<Device, 'id' | 'clientId'>) => void
  onAddDevices: (data: Omit<Device, 'id' | 'clientId'>[]) => void
  onDeleteDevice: (id: number) => void
}) {
  const [modal, setModal] = useState(false)
  const [importing, setImporting] = useState(false)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const rows = await parseExcel(file)
      const devs = rowsToDevices(rows, equivalences, client.needsSoftware ?? false)
      onAddDevices(devs)
    } catch {
      alert('Error al leer el archivo. Verifica el formato usando la plantilla.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft size={13} /> Volver</Button>
          <div>
            <h2 className="text-base font-semibold text-white">{client.name}</h2>
            <p className="text-xs text-gray-500">
              {client.ref || 'Sin referencia'}{client.manager ? ' · ' + client.manager : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="ghost" size="sm" onClick={() => exportClientMIF(client, devices)}>
            <Download size={13} /> Exportar MIF
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadTemplate}>
            <FileSpreadsheet size={13} /> Plantilla Excel
          </Button>
          <label className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer',
            importing
              ? 'bg-bg-3 border-border text-gray-600 pointer-events-none'
              : 'bg-transparent hover:bg-bg-3 text-gray-400 border-border'
          )}>
            <Upload size={13} />
            {importing ? 'Importando...' : 'Importar Excel'}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleImport}
              disabled={importing}
            />
          </label>
          <Button size="sm" onClick={() => setModal(true)}>
            <Plus size={13} /> Agregar equipo
          </Button>
        </div>
      </div>

      {devices.length === 0
        ? <EmptyState icon="🖨️" text="Sin equipos aún" sub="Agrega manualmente o importa un Excel con la plantilla" />
        : (
          <div className="space-y-2">
            {devices.map(d => (
              <div key={d.id} className="bg-bg-2 border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-border-2 transition-colors">
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{d.brand}</p>
                  <p className="text-sm font-semibold text-gray-200 mt-0.5">{d.model}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ×{d.quantity} · <span className={clsx(
                      'font-semibold',
                      d.format === 'A3' ? 'text-amber-400' : 'text-blue-400'
                    )}>{d.format}</span> · B&N: {d.volBN.toLocaleString()} · Color: {d.volColor.toLocaleString()} págs
                    {d.location ? ' · ' + d.location : ''}
                  </p>
                </div>
                <div className="text-gray-500 text-xl">→</div>
                <div className="text-right">
                  <XeroxTag model={d.xerox} />
                  <p className="text-xs text-gray-500 mt-1">{d.serie}</p>
                  <Badge className="mt-1.5" variant={d.confidence === 'Alta' ? 'conf-alta' : d.confidence === 'Media' ? 'conf-media' : 'conf-est'}>
                    {d.confidence}
                  </Badge>
                </div>
                <Button variant="danger" size="xs" className="ml-2"
                  onClick={() => { if (confirm('¿Eliminar?')) onDeleteDevice(d.id) }}>
                  <Trash2 size={11} />
                </Button>
              </div>
            ))}
          </div>
        )
      }

      <Modal open={modal} onClose={() => setModal(false)} title="Agregar equipo del cliente">
        <DeviceForm
          equivalences={equivalences}
          needsSoftware={client.needsSoftware ?? false}
          onSave={data => { onAddDevice(data); setModal(false) }}
          onClose={() => setModal(false)}
        />
      </Modal>
    </div>
  )
}

// ─── CLIENTS LIST ─────────────────────────────────────────────────
export function Clients({ clients, devices, equivalences, onAdd, onUpdate, onDelete, onAddDevice, onAddDevices, onDeleteDevice }: {
  clients: Client[]
  devices: Record<number, Device[]>
  equivalences: Equivalence[]
  onAdd: (d: Omit<Client, 'id' | 'createdAt'>) => void
  onUpdate: (id: number, d: Partial<Client>) => void
  onDelete: (id: number) => void
  onAddDevice: (clientId: number, d: Omit<Device, 'id' | 'clientId'>) => void
  onAddDevices: (clientId: number, d: Omit<Device, 'id' | 'clientId'>[]) => void
  onDeleteDevice: (clientId: number, deviceId: number) => void
}) {
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [viewId, setViewId] = useState<number | null>(null)

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    (c.ref ?? '').toLowerCase().includes(query.toLowerCase())
  )

  if (viewId !== null) {
    const client = clients.find(c => c.id === viewId)
    if (client) return (
      <ClientDetail
        client={client}
        devices={devices[viewId] ?? []}
        equivalences={equivalences}
        onBack={() => setViewId(null)}
        onAddDevice={data => onAddDevice(viewId, data)}
        onAddDevices={data => onAddDevices(viewId, data)}
        onDeleteDevice={id => onDeleteDevice(viewId, id)}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Clientes</h2>
          <p className="text-xs text-gray-500 mt-0.5">Historial de proyectos MIF</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
            <input className={clsx(inputCls, 'pl-8 w-56')} placeholder="Buscar cliente..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Button size="sm" onClick={() => { setEditClient(null); setModal(true) }}><Plus size={13} /> Nuevo cliente</Button>
        </div>
      </div>

      {filtered.length === 0
        ? <EmptyState icon="📋" text="Sin clientes aún" sub='Crea el primero con "+ Nuevo cliente"' />
        : (
          <div className="space-y-2">
            {filtered.map(c => {
              const eqs = devices[c.id] ?? []
              const units = eqs.reduce((s, d) => s + (d.quantity ?? 1), 0)
              return (
                <div key={c.id}
                  className="bg-bg-2 border border-border rounded-xl px-5 py-4 hover:border-border-2 transition-colors cursor-pointer"
                  onClick={() => setViewId(c.id)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {c.ruc ? c.ruc + ' · ' : ''}{c.ref || 'Sin referencia'}
                      </p>
                    </div>
                    <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="xs" onClick={() => { setEditClient(c); setModal(true) }}>
                        <Pencil size={10} /> Editar
                      </Button>
                      <Button variant="danger" size="xs" onClick={() => { if (confirm('¿Eliminar cliente y todos sus equipos?')) onDelete(c.id) }}>
                        <Trash2 size={10} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mt-3 flex-wrap">
                    {([['Equipos', eqs.length], ['Unidades', units],
                       ...(c.manager ? [['Gestor', c.manager]] : []),
                       ...(c.createdAt ? [['Fecha', c.createdAt]] : [])] as [string, string|number][])
                      .map(([l, v]) => (
                        <p key={l} className="text-xs text-gray-500">{l}: <span className="text-gray-300 font-medium">{v}</span></p>
                      ))}
                    <span className={clsx(
                      'text-xs font-semibold px-2 py-0.5 rounded-full border',
                      c.needsSoftware
                        ? 'bg-blue-900/20 text-blue-400 border-blue-800/30'
                        : 'bg-bg-4 text-gray-500 border-border'
                    )}>
                      {c.needsSoftware ? 'Con software' : 'Sin software'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      <Modal open={modal} onClose={() => setModal(false)} title={editClient ? 'Editar cliente' : 'Nuevo cliente'}>
        <ClientForm
          initial={editClient ?? {}}
          onSave={data => { if (editClient) onUpdate(editClient.id, data); else onAdd(data); setModal(false) }}
          onClose={() => setModal(false)}
        />
      </Modal>
    </div>
  )
}