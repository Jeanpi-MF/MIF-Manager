// ─── XEROX CATALOG ────────────────────────────────────────────────
export interface XeroxModel {
  model: string
  format: 'A4' | 'A3'
  maxVol: number
  desc: string
  serie: 'VersaLink' | 'AltaLink'
  type: 'mono' | 'color'
}

// ─── EQUIVALENCE ──────────────────────────────────────────────────
export interface Equivalence {
  id: number
  brand: string
  model: string
  type: 'mono' | 'color'
  format: 'A4' | 'A3'
  volBN: number
  volColor: number
  xerox: string
  notes: string
  createdAt: string
}

// ─── CLIENT ───────────────────────────────────────────────────────
export interface Client {
  id: number
  name: string
  ruc: string
  ref: string
  manager: string
  needsSoftware: boolean   // ← nuevo
  createdAt: string
}

// ─── DEVICE ───────────────────────────────────────────────────────
export interface Device {
  id: number
  clientId: number
  brand: string
  model: string
  quantity: number
  format: 'A4' | 'A3'
  volBN: number
  volColor: number
  location: string
  district: string
  xerox: string
  serie: 'VersaLink' | 'AltaLink'
  confidence: 'Alta' | 'Media' | 'Estimada'
  reason: string
}

// ─── SUGGESTION RESULT ────────────────────────────────────────────
export interface SuggestionResult {
  xerox: string
  serie: 'VersaLink' | 'AltaLink'
  confidence: 'Alta' | 'Media' | 'Estimada'
  reason: string
  detectedFormat: 'A4' | 'A3'
}

// ─── STORE ────────────────────────────────────────────────────────
export interface AppStore {
  clients: Client[]
  devices: Record<number, Device[]>
  equivalences: Equivalence[]
  nextId: number
}
