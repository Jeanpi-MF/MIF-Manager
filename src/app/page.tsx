'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { Sidebar, Page } from '@/components/modules/Sidebar'
import { Dashboard } from '@/components/modules/Dashboard'
import { Clients } from '@/components/modules/Clients'
import { Equivalences } from '@/components/modules/Equivalences'
import { Catalog } from '@/components/modules/Catalog'
import { useStore } from '@/lib/store'
import { exportAllMIF } from '@/lib/export'

const PAGE_META: Record<Page, { title: string; sub: string }> = {
  dashboard:    { title: 'Dashboard',      sub: 'Resumen general' },
  clients:      { title: 'Clientes',       sub: 'Historial de proyectos MIF' },
  equivalences: { title: 'Equivalencias',  sub: 'Base de conocimiento del equipo' },
  catalog:      { title: 'Catálogo Xerox', sub: 'VersaLink y AltaLink' },
}

export default function Home() {
  const [page, setPage] = useState<Page>('dashboard')
  const {
    store, hydrated,
    addClient, updateClient, deleteClient,
    addDevice, addDevices,
    deleteDevice,
    addEquivalence, deleteEquivalence,
  } = useStore()

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <p className="text-gray-500 text-sm font-mono">Cargando...</p>
      </div>
    )
  }

  const meta = PAGE_META[page]

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar current={page} onChange={setPage} />

      <main className="ml-[210px] flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-bg-2 border-b border-border h-14 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <p className="text-sm font-semibold text-white">{meta.title}</p>
            <p className="text-xs text-gray-500">{meta.sub}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportAllMIF(store.clients, store.devices)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-border text-gray-400 hover:bg-bg-3 hover:text-gray-200 transition-colors"
            >
              <Download size={12} /> Exportar todo
            </button>
            <button
              onClick={() => setPage('clients')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              + Nuevo cliente
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1">
          {page === 'dashboard' && (
            <Dashboard
              clients={store.clients}
              devices={store.devices}
              equivalencesCount={store.equivalences.length}
              onViewClient={id => { setPage('clients') }}
            />
          )}
          {page === 'clients' && (
            <Clients
              clients={store.clients}
              devices={store.devices}
              equivalences={store.equivalences}
              onAdd={addClient}
              onUpdate={updateClient}
              onDelete={deleteClient}
              onAddDevice={addDevice}
              onAddDevices={addDevices}
              onDeleteDevice={deleteDevice}
            />
          )}
          {page === 'equivalences' && (
            <Equivalences
              equivalences={store.equivalences}
              onAdd={addEquivalence}
              onDelete={deleteEquivalence}
            />
          )}
          {page === 'catalog' && <Catalog />}
        </div>
      </main>
    </div>
  )
}