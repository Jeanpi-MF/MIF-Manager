import { XeroxModel } from '@/types'

export const CATALOG: XeroxModel[] = [
  // ── VersaLink B&N A4 ────────────────────────────────────────────
  { model:'B415',  format:'A4', maxVol:20000,  desc:'MFP workgroup A4',             serie:'VersaLink', type:'mono' },
  // B620/B625: 30,000 págs (Xerox brochure V62BR)
  { model:'B620',  format:'A4', maxVol:30000,  desc:'Impresora alto volumen',       serie:'VersaLink', type:'mono' },
  { model:'B625',  format:'A4', maxVol:30000,  desc:'MFP avanzado A4',              serie:'VersaLink', type:'mono' },
  // ── VersaLink B&N A3 ────────────────────────────────────────────
  // B7125: 13,000 / B7130: 15,000 / B7135: 17,000 (Xerox Shop & Fleet MPS)
  { model:'B7125', format:'A3', maxVol:13000,  desc:'MFP A3 25ppm',                 serie:'VersaLink', type:'mono' },
  { model:'B7130', format:'A3', maxVol:15000,  desc:'MFP A3 30ppm',                 serie:'VersaLink', type:'mono' },
  { model:'B7135', format:'A3', maxVol:17000,  desc:'MFP A3 35ppm',                 serie:'VersaLink', type:'mono' },
  // ── VersaLink Color A4 ──────────────────────────────────────────
  // C415: 10,000 págs (Xerox brochure V4CBR — "Hasta 10,000 páginas")
  { model:'C415',  format:'A4', maxVol:10000,  desc:'MFP color alto rendimiento',  serie:'VersaLink', type:'color' },
  // C625: ~30,000 págs (misma plataforma que B625)
  { model:'C625',  format:'A4', maxVol:30000,  desc:'MFP color alto vol.',          serie:'VersaLink', type:'color' },
  // ── VersaLink Color A3 ──────────────────────────────────────────
  // C7120: 5,500 / C7130: 7,000 (Xerox PDF VC7SS-02U oficial)
  { model:'C7120', format:'A3', maxVol:5500,   desc:'MFP A3 color 20ppm',           serie:'VersaLink', type:'color' },
  { model:'C7130', format:'A3', maxVol:7000,   desc:'MFP A3 color 30ppm',           serie:'VersaLink', type:'color' },
  // ── AltaLink B&N ────────────────────────────────────────────────
  // B8245: 15,000–50,000 / B8255: 20,000–75,000 / B8270: 25,000–100,000 (documentconsulting.com / Xerox)
  { model:'B8245', format:'A3', maxVol:50000,  desc:'MFP producción 45ppm',         serie:'AltaLink',  type:'mono' },
  { model:'B8255', format:'A3', maxVol:75000,  desc:'MFP producción 55ppm',         serie:'AltaLink',  type:'mono' },
  { model:'B8270', format:'A3', maxVol:100000, desc:'MFP producción 70ppm',         serie:'AltaLink',  type:'mono' },
  // ── AltaLink Color ──────────────────────────────────────────────
  // C8235: 8,000–15,000 / C8255: 8,000–22,000 / C8270: 10,000–40,000 (documentconsulting.com / Xerox)
  { model:'C8235', format:'A3', maxVol:15000,  desc:'Color MFP 35ppm',              serie:'AltaLink',  type:'color' },
  { model:'C8255', format:'A3', maxVol:22000,  desc:'Color MFP 55ppm',              serie:'AltaLink',  type:'color' },
  { model:'C8270', format:'A3', maxVol:40000,  desc:'Color MFP 70ppm',              serie:'AltaLink',  type:'color' },
]

export function getCatalogGroups() {
  return [
    { label: 'VersaLink B&N (A4)',  items: CATALOG.filter(x => x.serie==='VersaLink' && x.type==='mono'  && x.format==='A4') },
    { label: 'VersaLink B&N (A3)',  items: CATALOG.filter(x => x.serie==='VersaLink' && x.type==='mono'  && x.format==='A3') },
    { label: 'VersaLink Color (A4)',items: CATALOG.filter(x => x.serie==='VersaLink' && x.type==='color' && x.format==='A4') },
    { label: 'VersaLink Color (A3)',items: CATALOG.filter(x => x.serie==='VersaLink' && x.type==='color' && x.format==='A3') },
    { label: 'AltaLink B&N',        items: CATALOG.filter(x => x.serie==='AltaLink'  && x.type==='mono') },
    { label: 'AltaLink Color',      items: CATALOG.filter(x => x.serie==='AltaLink'  && x.type==='color') },
  ]
}