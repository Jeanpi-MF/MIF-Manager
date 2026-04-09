import * as XLSX from 'xlsx'
import { Device, Equivalence } from '@/types'
import { suggest, detectFormat } from './suggest'

export interface ImportRow {
  ubicacion: string
  brand: string
  model: string
  volBN: number
  volColor: number
  distrito: string
  quantity: number
}

function toInt(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value)

  const cleaned = String(value ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '')

  const n = Number(cleaned)
  return Number.isFinite(n) ? Math.round(n) : fallback
}

export function parseExcel(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        const parsed: ImportRow[] = rows
          .filter(r => r['Equipo (Marca)'] || r['Marca'])
          .map(r => ({
            ubicacion: String(r['Ubicación'] ?? r['Ubicacion'] ?? '').trim(),
            brand: String(r['Equipo (Marca)'] ?? r['Marca'] ?? '').trim(),
            model: String(r['Modelo actual'] ?? r['Modelo'] ?? '').trim(),
            volBN: toInt(r['Volumen BN'] ?? r['Vol BN'] ?? 0),
            volColor: toInt(r['Volumen Color'] ?? r['Vol Color'] ?? 0),
            distrito: String(r['Distrito'] ?? '').trim(),
            quantity: toInt(r['Cantidad'] ?? 1, 1),
          }))
          .filter(r => r.brand && r.model)

        resolve(parsed)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function rowsToDevices(
  rows: ImportRow[],
  equivalences: Equivalence[],
  needsSoftware: boolean
): Omit<Device, 'id' | 'clientId'>[] {
  return rows.map(r => {
    const detected = detectFormat(r.brand, r.model)
    const s = suggest(
      r.brand,
      r.model,
      r.volBN,
      r.volColor,
      detected,
      equivalences,
      needsSoftware
    )

    return {
      brand: r.brand,
      model: r.model,
      quantity: r.quantity,
      format: s.detectedFormat,
      volBN: r.volBN,
      volColor: r.volColor,
      location: r.ubicacion,
      district: r.distrito,
      xerox: s.xerox,
      serie: s.serie,
      confidence: s.confidence,
      reason: s.reason,
    }
  })
}