import { Client, Device } from '@/types'

function esc(v: string | number) {
  return '"' + String(v ?? '').replace(/"/g, '""') + '"'
}

export function exportClientMIF(client: Client, devices: Device[]) {
  const cols = [
    'Operativo','Ubicación','Equipo (Marca)','Modelo actual','Dirección','Distrito',
    'Departamento','Provincia','ASP/OP','Volumen BN','Volumen Color',
    'Costo partes mensual','Costo labor mensual','Costo mantenimiento mensual',
    'Costo instalación','Cantidad','Formato','Xerox Propuesto','Serie','Confianza','Razón sugerencia',
  ]
  const rows = devices.map(d => [
    'Sí', d.location, d.brand, d.model, '', d.district, '', '', '',
    d.volBN, d.volColor, '', '', '', '',
    d.quantity, d.format, d.xerox, d.serie, d.confidence, d.reason,
  ])
  const csv = [cols, ...rows].map(r => r.map(esc).join(',')).join('\n')
  download(`MIF_${client.name}_${client.ref || 'sin-ref'}.csv`, csv)
}

export function exportAllMIF(clients: Client[], devices: Record<number, Device[]>) {
  const cols = [
    'Cliente','RUC','Referencia','Gestor','Operativo','Equipo','Modelo',
    'Distrito','Cantidad','Vol BN','Vol Color','Formato',
    'Xerox Propuesto','Serie','Confianza',
  ]
  const rows = clients.flatMap(c =>
    (devices[c.id] ?? []).map(d => [
      c.name, c.ruc, c.ref, c.manager,
      'Sí', d.brand, d.model, d.district,
      d.quantity, d.volBN, d.volColor, d.format,
      d.xerox, d.serie, d.confidence,
    ])
  )
  const csv = [cols, ...rows].map(r => r.map(esc).join(',')).join('\n')
  download(`MIF_Todos_${new Date().toISOString().slice(0,10)}.csv`, csv)
}

function download(filename: string, content: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
