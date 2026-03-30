import * as XLSX from 'xlsx'
import { Device, Equivalence } from '@/types'
import { suggest } from './suggest'

export interface ImportRow {
  ubicacion: string
  brand: string
  model: string
  volBN: number
  volColor: number
  distrito: string
  quantity: number
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
            ubicacion: String(r['Ubicación'] ?? r['Ubicacion'] ?? ''),
            brand:     String(r['Equipo (Marca)'] ?? r['Marca'] ?? ''),
            model:     String(r['Modelo actual'] ?? r['Modelo'] ?? ''),
            volBN:     parseInt(r['Volumen BN'] ?? r['Vol BN'] ?? 0) || 0,
            volColor:  parseInt(r['Volumen Color'] ?? r['Vol Color'] ?? 0) || 0,
            distrito:  String(r['Distrito'] ?? ''),
            quantity:  parseInt(r['Cantidad'] ?? 1) || 1,
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
    const s = suggest(r.brand, r.model, r.volBN, r.volColor, 'A4', equivalences, needsSoftware)
    return {
      brand:      r.brand,
      model:      r.model,
      quantity:   r.quantity,
      format:     s.detectedFormat,
      volBN:      r.volBN,
      volColor:   r.volColor,
      location:   r.ubicacion,
      district:   r.distrito,
      xerox:      s.xerox,
      serie:      s.serie,
      confidence: s.confidence,
      reason:     s.reason,
    }
  })
}