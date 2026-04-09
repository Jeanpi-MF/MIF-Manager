// lib/modelMatching.ts

export function normalizeText(value: string): string {
  return String(value ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const NOISE_WORDS = [
  'HP',
  'XEROX',
  'COLOR',
  'LASERJET',
  'ENTERPRISE',
  'MANAGED',
  'FLOW',
  'MFP',
  'PRINTER',
  'MULTIFUNCTION',
  'POSTSCRIPT',
]

export function stripNoiseWords(value: string): string {
  let text = normalizeText(value)

  for (const word of NOISE_WORDS) {
    text = text.replace(new RegExp(`\\b${word}\\b`, 'g'), ' ')
  }

  return text.replace(/\s+/g, ' ').trim()
}

export function extractModelCode(brand: string, model: string): string | null {
  const b = normalizeText(brand)
  const m = stripNoiseWords(model)

  if (b === 'HP') {
    const hpPatterns = [
      /\bE\d{5}\b/,        // E78330, E62655, E87660
      /\bM\d{3,4}[A-Z]?\b/, // M725, M776, M507DN -> extrae M507
      /\bT\d{4}[A-Z]*\b/,  // T2600
    ]

    for (const p of hpPatterns) {
      const match = m.match(p)
      if (match) return match[0]
    }
  }

  if (b === 'CANON') {
    const match = m.match(/\b(IR\s*ADVANCE\s*[A-Z]?\d{4,5}I?|IR\s*\d{4}I?|C\d{4}I?)\b/)
    if (match) return normalizeText(match[0]).replace(/\s+/g, ' ')
  }

  if (b === 'RICOH') {
    const match = m.match(/\bIM\s*C?\s*\d{3,4}[A-Z]?\b/)
    if (match) return normalizeText(match[0]).replace(/\s+/g, ' ')
  }

  if (b === 'KONICA MINOLTA') {
    const match = m.match(/\bBIZHUB\s+[A-Z]?\d{3,4}[A-Z]?\b/)
    if (match) return normalizeText(match[0]).replace(/\s+/g, ' ')
  }

  if (b === 'KYOCERA') {
    const match = m.match(/\bTASKALFA\s+\d{4}[A-Z]*\b|\bECOSYS\s+[A-Z]?\d{4,5}[A-Z]*\b/)
    if (match) return normalizeText(match[0]).replace(/\s+/g, ' ')
  }

  if (b === 'SHARP') {
    const match = m.match(/\bMX-[A-Z]?\d{3,4}[A-Z]?\b/)
    if (match) return normalizeText(match[0])
  }

  if (b === 'TOSHIBA') {
    const match = m.match(/\bE-STUDIO\s+\d{4}[A-Z]*\b/)
    if (match) return normalizeText(match[0]).replace(/\s+/g, ' ')
  }

  const generic = m.match(/\b[A-Z]{1,3}\d{3,5}[A-Z]{0,2}\b/)
  return generic?.[0] ?? null
}

export function safeIncludes(a: string, b: string) {
  return a.includes(b) || b.includes(a)
}