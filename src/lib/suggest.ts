import { CATALOG } from './catalog'
import { findCompetitor } from './competitors'
import { Equivalence, SuggestionResult } from '@/types'

export function detectFormat(brand: string, model: string, manualFormat?: 'A4' | 'A3'): 'A4' | 'A3' {
  const comp = findCompetitor(brand, model)
  if (comp) return comp.format === 'A3A4' ? 'A3' : comp.format

  const m = model.toUpperCase()
  const checks = [
    m.includes('A3'),
    /IM\s*(2\d{3}|3\d{3}|4\d{3}|5\d{3}|6\d{3}|7\d{3}|8\d{3}|9\d{3})/.test(model),
    /iR\s*ADVANCE\s*[46]/.test(model),
    /bizhub\s*[3-9]\d{2}/.test(model),
    m.includes('TASKALFA'),
    /^MX-[2-9]\d{3}/.test(model),
    m.includes('E-STUDIO'),
    /M7[2-9]\d|M8\d{2}/.test(model),
    /WF-C1\d{4}|WF-C2\d{4}/.test(model),
  ]
  if (checks.some(Boolean)) return 'A3'
  return manualFormat ?? 'A4'
}

const SOFTWARE_EXCLUDED = ['B235', 'B315', 'C325']

export function suggest(
  brand: string,
  model: string,
  volBN: number,
  volColor: number,
  manualFormat: 'A4' | 'A3',
  equivalences: Equivalence[],
  needsSoftware: boolean = false
): SuggestionResult {
  volBN    = Math.max(0, parseInt(String(volBN))    || 0)
  volColor = Math.max(0, parseInt(String(volColor)) || 0)

  const detectedFormat = detectFormat(brand, model, manualFormat)
  const isA3    = detectedFormat === 'A3'
  const isColor = volColor > 0

  // 1. Exact match
  const exact = equivalences.find(
    e => e.brand.toLowerCase() === brand.toLowerCase() &&
         e.model.toLowerCase() === model.toLowerCase()
  )
  if (exact) {
    // ← nuevo: si requiere software y el xerox está excluido, ignorar el exact match
    const catExact = CATALOG.find(c => c.model === exact.xerox)
    if (!needsSoftware || !SOFTWARE_EXCLUDED.includes(exact.xerox)) {
      return {
        xerox: exact.xerox,
        serie: catExact?.serie ?? 'VersaLink',
        confidence: 'Alta',
        reason: `Coincidencia exacta: ${exact.brand} ${exact.model}`,
        detectedFormat,
      }
    }
  }

  // 2. Partial match
  const partial = equivalences.find(e => {
    if (e.brand.toLowerCase() !== brand.toLowerCase()) return false
    const eqModel = e.model.toLowerCase()
    if (!model.toLowerCase().includes(eqModel)) return false
    const cat = CATALOG.find(c => c.model === e.xerox)
    if (!cat) return true
    const xeroxIsA3 = cat.format === 'A3'
    if (xeroxIsA3 !== isA3) return false
    // ← nuevo: si requiere software, excluir modelos excluidos
    if (needsSoftware && SOFTWARE_EXCLUDED.includes(e.xerox)) return false
    return true
  })

  if (partial) {
    const cat = CATALOG.find(c => c.model === partial.xerox)
    return {
      xerox: partial.xerox,
      serie: cat?.serie ?? 'VersaLink',
      confidence: 'Media',
      reason: `Coincidencia parcial con: ${partial.brand} ${partial.model}`,
      detectedFormat,
    }
  }

  // 3. Volume + format based
  const comp = findCompetitor(brand, model)
  const vol  = volBN + volColor > 0 ? volBN + volColor : (comp?.volMonthly ?? 0)
  const useColor = isColor || comp?.type === 'color'

  let pool = CATALOG.filter(c => {
    if (needsSoftware && SOFTWARE_EXCLUDED.includes(c.model)) return false
    return isA3
      ? c.format === 'A3' && (useColor ? c.type === 'color' : c.type === 'mono')
      : c.format === 'A4' && (useColor ? c.type === 'color' : c.type === 'mono')
  })

  if (!isA3 && vol > 130000) {
    pool = [...pool, ...CATALOG.filter(c => {
      if (needsSoftware && SOFTWARE_EXCLUDED.includes(c.model)) return false
      return c.serie === 'AltaLink' && (useColor ? c.type === 'color' : c.type === 'mono')
    })]
  }

  const chosen = pool.filter(c => c.maxVol >= vol).sort((a, b) => a.maxVol - b.maxVol)[0]
    ?? pool.sort((a, b) => b.maxVol - a.maxVol)[0]

  const fmtSrc = comp
    ? `formato detectado: ${comp.format === 'A3A4' ? 'A3/A4 → A3' : comp.format}`
    : `formato: ${detectedFormat}`

  return {
    xerox: chosen?.model ?? 'B415',
    serie: chosen?.serie ?? 'VersaLink',
    confidence: comp ? 'Media' : 'Estimada',
    reason: `Volumen: ${vol > 0 ? vol.toLocaleString() + ' págs/mes' : 'no especificado'} · ${fmtSrc}`,
    detectedFormat,
  }
}