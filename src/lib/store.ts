'use client'
import { useState, useEffect, useCallback } from 'react'
import { AppStore, Client, Device, Equivalence } from '@/types'

const DEFAULT_EQUIVALENCES: Equivalence[] = [
  { id:1, brand:'Ricoh',          model:'IM 430F',          type:'mono',  format:'A4', volBN:3000,  volColor:0,    xerox:'B415',  notes:'Reemplazo directo', createdAt:'2024-01-01' },
  { id:2, brand:'Ricoh',          model:'IM C300F',         type:'color', format:'A4', volBN:2000,  volColor:1500, xerox:'C415',  notes:'',                  createdAt:'2024-01-01' },
  { id:3, brand:'Canon',          model:'iR 2625i',         type:'mono',  format:'A3', volBN:8000,  volColor:0,    xerox:'B7130', notes:'Formato A3',        createdAt:'2024-01-01' },
  { id:4, brand:'Epson',          model:'L6550',            type:'color', format:'A4', volBN:1500,  volColor:2000, xerox:'C415',  notes:'',                  createdAt:'2024-01-01' },
  { id:5, brand:'HP',             model:'LaserJet M428',    type:'mono',  format:'A4', volBN:4000,  volColor:0,    xerox:'B415',  notes:'',                  createdAt:'2024-01-01' },
  { id:6, brand:'Konica Minolta', model:'bizhub C300i',     type:'color', format:'A4', volBN:5000,  volColor:3000, xerox:'C415',  notes:'MFP Color',         createdAt:'2024-01-01' },
  { id:7, brand:'Ricoh',          model:'IM 550F',          type:'mono',  format:'A4', volBN:15000, volColor:0,    xerox:'B625',  notes:'',                  createdAt:'2024-01-01' },
  { id:8, brand:'Canon',          model:'iR ADVANCE C5540', type:'color', format:'A3', volBN:10000, volColor:8000, xerox:'C8255', notes:'AltaLink alto vol.', createdAt:'2024-01-01' },
]

const INITIAL_STORE: AppStore = {
  clients: [],
  devices: {},
  equivalences: DEFAULT_EQUIVALENCES,
  nextId: 100,
}

function loadStore(): AppStore {
  if (typeof window === 'undefined') return INITIAL_STORE
  try {
    const raw = localStorage.getItem('mif_store')
    return raw ? { ...INITIAL_STORE, ...JSON.parse(raw) } : INITIAL_STORE
  } catch {
    return INITIAL_STORE
  }
}

function saveStore(store: AppStore) {
  try { localStorage.setItem('mif_store', JSON.stringify(store)) } catch {}
}

export function useStore() {
  const [store, setStore] = useState<AppStore>(INITIAL_STORE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setStore(loadStore())
    setHydrated(true)
  }, [])

  const update = useCallback((updater: (s: AppStore) => AppStore) => {
    setStore(prev => {
      const next = updater(prev)
      saveStore(next)
      return next
    })
  }, [])

  const nextId = useCallback(() => {
    let id = 0
    update(s => { id = s.nextId; return { ...s, nextId: s.nextId + 1 } })
    return id
  }, [update])

  // ─── CLIENTS ──────────────────────────────────────────────────
  const addClient = useCallback((data: Omit<Client, 'id' | 'createdAt'>) => {
    const id = nextId()
    update(s => ({
      ...s,
      clients: [{ ...data, id, createdAt: new Date().toLocaleDateString('es-PE') }, ...s.clients],
      devices: { ...s.devices, [id]: [] },
    }))
    return id
  }, [update, nextId])

  const updateClient = useCallback((id: number, data: Partial<Client>) => {
    update(s => ({ ...s, clients: s.clients.map(c => c.id === id ? { ...c, ...data } : c) }))
  }, [update])

  const deleteClient = useCallback((id: number) => {
    update(s => {
      const { [id]: _, ...rest } = s.devices
      return { ...s, clients: s.clients.filter(c => c.id !== id), devices: rest }
    })
  }, [update])

  // ─── DEVICES ──────────────────────────────────────────────────
  const addDevice = useCallback((clientId: number, data: Omit<Device, 'id' | 'clientId'>) => {
    const id = nextId()
    update(s => ({
      ...s,
      devices: {
        ...s.devices,
        [clientId]: [...(s.devices[clientId] ?? []), { ...data, id, clientId }],
      },
    }))
  }, [update, nextId])

  // ← NUEVO: agregar múltiples devices de una sola vez con IDs únicos
  const addDevices = useCallback((clientId: number, data: Omit<Device, 'id' | 'clientId'>[]) => {
    update(s => {
      let nextIdVal = s.nextId
      const newDevices = data.map(d => ({
        ...d,
        id: nextIdVal++,
        clientId,
      }))
      return {
        ...s,
        nextId: nextIdVal,
        devices: {
          ...s.devices,
          [clientId]: [...(s.devices[clientId] ?? []), ...newDevices],
        },
      }
    })
  }, [update])

  const deleteDevice = useCallback((clientId: number, deviceId: number) => {
    update(s => ({
      ...s,
      devices: { ...s.devices, [clientId]: (s.devices[clientId] ?? []).filter(d => d.id !== deviceId) },
    }))
  }, [update])

  // ─── EQUIVALENCES ─────────────────────────────────────────────
  const addEquivalence = useCallback((data: Omit<Equivalence, 'id' | 'createdAt'>) => {
    const id = nextId()
    update(s => ({ ...s, equivalences: [...s.equivalences, { ...data, id, createdAt: new Date().toLocaleDateString('es-PE') }] }))
  }, [update, nextId])

  const deleteEquivalence = useCallback((id: number) => {
    update(s => ({ ...s, equivalences: s.equivalences.filter(e => e.id !== id) }))
  }, [update])

  return {
    store, hydrated,
    addClient, updateClient, deleteClient,
    addDevice, addDevices,
    deleteDevice,
    addEquivalence, deleteEquivalence,
  }
}