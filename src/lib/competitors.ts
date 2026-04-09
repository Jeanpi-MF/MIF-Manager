// Base de datos de equipos de la competencia
// format: 'A4' | 'A3' | 'A3A4' (multiformato → se trata como A3)
import { extractModelCode, normalizeText, stripNoiseWords, safeIncludes } from './modelMatching'

export interface CompetitorDevice {
  brand: string
  model: string
  aliases?: string[]
  type: 'mono' | 'color'
  format: 'A4' | 'A3' | 'A3A4'
  volMonthly: number
  notes?: string
}

export const COMPETITOR_DEVICES: CompetitorDevice[] = [

  // ══════════════════════════════════════════════════════
  // HP
  // ══════════════════════════════════════════════════════
  // Mono A4
  { brand:'HP', model:'LaserJet Pro M404n',      type:'mono',  format:'A4',   volMonthly:3000 },
  { brand:'HP', model:'LaserJet Pro M404dn',     type:'mono',  format:'A4',   volMonthly:3000 },
  { brand:'HP', model:'LaserJet Pro M428fdn',    type:'mono',  format:'A4',   volMonthly:4000 },
  { brand:'HP', model:'LaserJet Pro M428fdw',    type:'mono',  format:'A4',   volMonthly:4000 },
  { brand:'HP', model:'LaserJet Enterprise M507dn', type:'mono', format:'A4', volMonthly:8000 },
  { brand:'HP', model:'LaserJet Enterprise M507x',  type:'mono', format:'A4', volMonthly:8000 },
  { brand:'HP', model:'LaserJet Enterprise M609dn', type:'mono', format:'A4', volMonthly:12000 },
  { brand:'HP', model:'LaserJet Enterprise M609x',  type:'mono', format:'A4', volMonthly:12000 },
  { brand:'HP', model:'LaserJet Enterprise M611dn', type:'mono', format:'A4', volMonthly:15000 },
  { brand:'HP', model:'LaserJet Enterprise M612dn', type:'mono', format:'A4', volMonthly:20000 },
  // Mono MFP A4
  { brand:'HP', model:'LaserJet Pro MFP M428fdn',   type:'mono', format:'A4', volMonthly:4000 },
  { brand:'HP', model:'LaserJet Pro MFP M428fdw',   type:'mono', format:'A4', volMonthly:4000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M528f',  type:'mono', format:'A4', volMonthly:10000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M528dn', type:'mono', format:'A4', volMonthly:10000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M631h',  type:'mono', format:'A4', volMonthly:15000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M632h',  type:'mono', format:'A4', volMonthly:20000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M633fh', type:'mono', format:'A4', volMonthly:25000 },
  // Color A4
  { brand:'HP', model:'Color LaserJet Pro M454dn',      type:'color', format:'A4', volMonthly:3000 },
  { brand:'HP', model:'Color LaserJet Pro M454dw',      type:'color', format:'A4', volMonthly:3000 },
  { brand:'HP', model:'Color LaserJet Enterprise M554dn', type:'color', format:'A4', volMonthly:6000 },
  { brand:'HP', model:'Color LaserJet Enterprise M555dn', type:'color', format:'A4', volMonthly:8000 },
  { brand:'HP', model:'Color LaserJet Enterprise M555x',  type:'color', format:'A4', volMonthly:8000 },
  // Color MFP A4
  { brand:'HP', model:'Color LaserJet Pro MFP M479fdn',   type:'color', format:'A4', volMonthly:4000 },
  { brand:'HP', model:'Color LaserJet Pro MFP M479fdw',   type:'color', format:'A4', volMonthly:4000 },
  { brand:'HP', model:'Color LaserJet Enterprise MFP M578f',  type:'color', format:'A4', volMonthly:8000 },
  { brand:'HP', model:'Color LaserJet Enterprise MFP M578dn', type:'color', format:'A4', volMonthly:8000 },
  { brand:'HP', model:'Color LaserJet Enterprise Flow MFP M578z', type:'color', format:'A4', volMonthly:10000 },
  // A3
  { brand:'HP', model:'LaserJet Enterprise MFP M725dn',   type:'mono',  format:'A3A4', volMonthly:15000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M725f',    type:'mono',  format:'A3A4', volMonthly:15000 },
  { brand:'HP', model:'LaserJet Enterprise MFP M730f',    type:'mono',  format:'A3A4', volMonthly:20000 },
  { brand:'HP', model:'Color LaserJet Enterprise MFP M776dn',  type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'HP', model:'Color LaserJet Enterprise MFP M776f',   type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'HP', model:'Color LaserJet Enterprise Flow MFP M776z', type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'HP', model:'Color LaserJet Enterprise MFP M880z',   type:'color', format:'A3A4', volMonthly:30000 },
{ brand:'HP', model:'Color LaserJet Managed MFP E78330',       type:'color', format:'A3A4', volMonthly:30000 },
{ brand:'HP', model:'LaserJet Managed MFP E62655',             type:'mono',  format:'A4',   volMonthly:50000 },
{ brand:'HP', model:'Color LaserJet Managed Flow MFP E87660',  type:'color', format:'A3A4', volMonthly:60000 },
{ brand:'HP', model:'Color LaserJet Managed Flow MFP E87640',  type:'color', format:'A3A4', volMonthly:40000 },
{ brand:'HP', model:'Color LaserJet Managed MFP E57540',       type:'color', format:'A4',   volMonthly:15000 },
{ brand:'HP', model:'Color LaserJet Managed MFP E77830',       type:'color', format:'A3A4', volMonthly:30000 },
{ brand:'HP', model:'DesignJet T2600dr PostScript MFP',        type:'color', format:'A3A4', volMonthly:500,
  
  notes:'Plotter gran formato A0; volMonthly en planos/rollos equiv.' },
  // ══════════════════════════════════════════════════════
  // EPSON
  // ══════════════════════════════════════════════════════
  // WorkForce / EcoTank inkjet A4
  { brand:'Epson', model:'EcoTank L3250',     type:'color', format:'A4', volMonthly:1000 },
  { brand:'Epson', model:'EcoTank L3550',     type:'color', format:'A4', volMonthly:1500 },
  { brand:'Epson', model:'EcoTank L5290',     type:'color', format:'A4', volMonthly:2000 },
  { brand:'Epson', model:'EcoTank L6270',     type:'color', format:'A4', volMonthly:3000 },
  { brand:'Epson', model:'EcoTank L6490',     type:'color', format:'A4', volMonthly:4000 },
  { brand:'Epson', model:'EcoTank L6550',     type:'color', format:'A4', volMonthly:4000 },
  { brand:'Epson', model:'EcoTank L6570',     type:'color', format:'A4', volMonthly:5000 },
  { brand:'Epson', model:'EcoTank L6580',     type:'color', format:'A4', volMonthly:5000 },
  { brand:'Epson', model:'WorkForce Pro WF-C5290', type:'color', format:'A4', volMonthly:5000 },
  { brand:'Epson', model:'WorkForce Pro WF-C5790', type:'color', format:'A4', volMonthly:8000 },
  { brand:'Epson', model:'WorkForce Pro WF-C8190', type:'color', format:'A4', volMonthly:15000 },
  { brand:'Epson', model:'WorkForce Pro WF-C8690', type:'color', format:'A4', volMonthly:20000 },
  // A3
  { brand:'Epson', model:'EcoTank L15150',    type:'color', format:'A3A4', volMonthly:3000 },
  { brand:'Epson', model:'EcoTank L15160',    type:'color', format:'A3A4', volMonthly:3000 },
  { brand:'Epson', model:'WorkForce Pro WF-C17590', type:'color', format:'A3A4', volMonthly:25000 },
  { brand:'Epson', model:'WorkForce Enterprise WF-C20590', type:'color', format:'A3A4', volMonthly:50000 },

  // ══════════════════════════════════════════════════════
  // RICOH
  // ══════════════════════════════════════════════════════
  // Mono A4
  { brand:'Ricoh', model:'SP 330SN',      type:'mono', format:'A4', volMonthly:2000 },
  { brand:'Ricoh', model:'SP 330DN',      type:'mono', format:'A4', volMonthly:2000 },
  { brand:'Ricoh', model:'SP 3710DN',     type:'mono', format:'A4', volMonthly:3000 },
  { brand:'Ricoh', model:'SP 3710SF',     type:'mono', format:'A4', volMonthly:3000 },
  { brand:'Ricoh', model:'SP 4510DN',     type:'mono', format:'A4', volMonthly:5000 },
  { brand:'Ricoh', model:'SP 4510SF',     type:'mono', format:'A4', volMonthly:5000 },
  { brand:'Ricoh', model:'IM 350',        type:'mono', format:'A4', volMonthly:3500 },
  { brand:'Ricoh', model:'IM 350F',       type:'mono', format:'A4', volMonthly:3500 },
  { brand:'Ricoh', model:'IM 430F',       type:'mono', format:'A4', volMonthly:4000 },
  { brand:'Ricoh', model:'IM 460F',       type:'mono', format:'A4', volMonthly:5000 },
  { brand:'Ricoh', model:'IM 550F',       type:'mono', format:'A4', volMonthly:15000 },
  { brand:'Ricoh', model:'IM 600F',       type:'mono', format:'A4', volMonthly:20000 },
  { brand:'Ricoh', model:'IM 601F',       type:'mono', format:'A4', volMonthly:25000 },
  // Color A4
  { brand:'Ricoh', model:'IM C300',       type:'color', format:'A4', volMonthly:3000 },
  { brand:'Ricoh', model:'IM C300F',      type:'color', format:'A4', volMonthly:3000 },
  { brand:'Ricoh', model:'IM C400F',      type:'color', format:'A4', volMonthly:5000 },
  { brand:'Ricoh', model:'IM C530FB',     type:'color', format:'A4', volMonthly:8000 },
  // Mono A3
  { brand:'Ricoh', model:'IM 2702',       type:'mono', format:'A3A4', volMonthly:15000 },
  { brand:'Ricoh', model:'IM 3000',       type:'mono', format:'A3A4', volMonthly:20000 },
  { brand:'Ricoh', model:'IM 3500',       type:'mono', format:'A3A4', volMonthly:25000 },
  { brand:'Ricoh', model:'IM 4000',       type:'mono', format:'A3A4', volMonthly:30000 },
  { brand:'Ricoh', model:'IM 5000',       type:'mono', format:'A3A4', volMonthly:50000 },
  { brand:'Ricoh', model:'IM 6000',       type:'mono', format:'A3A4', volMonthly:60000 },
  { brand:'Ricoh', model:'IM 7000',       type:'mono', format:'A3A4', volMonthly:70000 },
  { brand:'Ricoh', model:'IM 8000',       type:'mono', format:'A3A4', volMonthly:80000 },
  { brand:'Ricoh', model:'IM 9000',       type:'mono', format:'A3A4', volMonthly:90000 },
  // Color A3
  { brand:'Ricoh', model:'IM C2000',      type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'Ricoh', model:'IM C2500',      type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'Ricoh', model:'IM C3000',      type:'color', format:'A3A4', volMonthly:25000 },
  { brand:'Ricoh', model:'IM C3500',      type:'color', format:'A3A4', volMonthly:30000 },
  { brand:'Ricoh', model:'IM C4500',      type:'color', format:'A3A4', volMonthly:40000 },
  { brand:'Ricoh', model:'IM C6000',      type:'color', format:'A3A4', volMonthly:60000 },

  // ══════════════════════════════════════════════════════
  // CANON
  // ══════════════════════════════════════════════════════
  // Mono A4
  { brand:'Canon', model:'imageCLASS MF262dn',   type:'mono', format:'A4', volMonthly:2000 },
  { brand:'Canon', model:'imageCLASS MF264dw',   type:'mono', format:'A4', volMonthly:2000 },
  { brand:'Canon', model:'imageCLASS MF269dw',   type:'mono', format:'A4', volMonthly:2500 },
  { brand:'Canon', model:'imageCLASS MF465dw',   type:'mono', format:'A4', volMonthly:4000 },
  { brand:'Canon', model:'imageCLASS MF525dw',   type:'mono', format:'A4', volMonthly:6000 },
  { brand:'Canon', model:'imageRUNNER 1643i',    type:'mono', format:'A4', volMonthly:8000 },
  { brand:'Canon', model:'imageRUNNER 1643iF',   type:'mono', format:'A4', volMonthly:8000 },
  { brand:'Canon', model:'imageRUNNER 1643P',    type:'mono', format:'A4', volMonthly:8000 },
  { brand:'Canon', model:'iR 2206N',             type:'mono', format:'A4', volMonthly:5000 },
  { brand:'Canon', model:'iR 2425',              type:'mono', format:'A4', volMonthly:8000 },
  // Color A4
  { brand:'Canon', model:'imageCLASS MF642Cdw',  type:'color', format:'A4', volMonthly:3000 },
  { brand:'Canon', model:'imageCLASS MF644Cdw',  type:'color', format:'A4', volMonthly:3000 },
  { brand:'Canon', model:'imageCLASS MF741Cdw',  type:'color', format:'A4', volMonthly:5000 },
  { brand:'Canon', model:'imageCLASS MF743Cdw',  type:'color', format:'A4', volMonthly:5000 },
  { brand:'Canon', model:'imageCLASS MF745Cdw',  type:'color', format:'A4', volMonthly:6000 },
  // Mono A3
  { brand:'Canon', model:'iR 2625i',             type:'mono', format:'A3A4', volMonthly:8000 },
  { brand:'Canon', model:'iR 2630i',             type:'mono', format:'A3A4', volMonthly:10000 },
  { brand:'Canon', model:'iR 2635i',             type:'mono', format:'A3A4', volMonthly:15000 },
  { brand:'Canon', model:'iR 2645i',             type:'mono', format:'A3A4', volMonthly:20000 },
  { brand:'Canon', model:'iR ADVANCE 4525i',     type:'mono', format:'A3A4', volMonthly:25000 },
  { brand:'Canon', model:'iR ADVANCE 4535i',     type:'mono', format:'A3A4', volMonthly:35000 },
  { brand:'Canon', model:'iR ADVANCE 4545i',     type:'mono', format:'A3A4', volMonthly:45000 },
  { brand:'Canon', model:'iR ADVANCE 4551i',     type:'mono', format:'A3A4', volMonthly:50000 },
  { brand:'Canon', model:'iR ADVANCE 6555i',     type:'mono', format:'A3A4', volMonthly:55000 },
  { brand:'Canon', model:'iR ADVANCE 6565i',     type:'mono', format:'A3A4', volMonthly:65000 },
  // Color A3
  { brand:'Canon', model:'iR ADVANCE C3520i',    type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'Canon', model:'iR ADVANCE C3525i',    type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'Canon', model:'iR ADVANCE C3530i',    type:'color', format:'A3A4', volMonthly:25000 },
  { brand:'Canon', model:'iR ADVANCE C5540i',    type:'color', format:'A3A4', volMonthly:30000 },
  { brand:'Canon', model:'iR ADVANCE C5550i',    type:'color', format:'A3A4', volMonthly:40000 },
  { brand:'Canon', model:'iR ADVANCE C5560i',    type:'color', format:'A3A4', volMonthly:50000 },
  { brand:'Canon', model:'imageRUNNER ADVANCE DX C3730i', type:'color', format:'A3A4', volMonthly:25000 },
  { brand:'Canon', model:'imageRUNNER ADVANCE DX C5870i', type:'color', format:'A3A4', volMonthly:60000 },

  // ══════════════════════════════════════════════════════
  // KONICA MINOLTA
  // ══════════════════════════════════════════════════════
  // Mono A4
  { brand:'Konica Minolta', model:'bizhub 4702P',   type:'mono', format:'A4', volMonthly:3000 },
  { brand:'Konica Minolta', model:'bizhub 4752',    type:'mono', format:'A4', volMonthly:5000 },
  { brand:'Konica Minolta', model:'bizhub 5000i',   type:'mono', format:'A4', volMonthly:8000 },
  { brand:'Konica Minolta', model:'bizhub 5020i',   type:'mono', format:'A4', volMonthly:10000 },
  // Color A4
  { brand:'Konica Minolta', model:'bizhub C250i',   type:'color', format:'A4', volMonthly:5000 },
  { brand:'Konica Minolta', model:'bizhub C300i',   type:'color', format:'A4', volMonthly:8000 },
  { brand:'Konica Minolta', model:'bizhub C360i',   type:'color', format:'A4', volMonthly:12000 },
  // Mono A3
  { brand:'Konica Minolta', model:'bizhub 227',     type:'mono', format:'A3A4', volMonthly:10000 },
  { brand:'Konica Minolta', model:'bizhub 287',     type:'mono', format:'A3A4', volMonthly:15000 },
  { brand:'Konica Minolta', model:'bizhub 367',     type:'mono', format:'A3A4', volMonthly:20000 },
  { brand:'Konica Minolta', model:'bizhub 458e',    type:'mono', format:'A3A4', volMonthly:30000 },
  { brand:'Konica Minolta', model:'bizhub 558e',    type:'mono', format:'A3A4', volMonthly:40000 },
  { brand:'Konica Minolta', model:'bizhub 658e',    type:'mono', format:'A3A4', volMonthly:50000 },
  { brand:'Konica Minolta', model:'bizhub 808',     type:'mono', format:'A3A4', volMonthly:80000 },
  // Color A3
  { brand:'Konica Minolta', model:'bizhub C227',    type:'color', format:'A3A4', volMonthly:10000 },
  { brand:'Konica Minolta', model:'bizhub C287',    type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'Konica Minolta', model:'bizhub C367',    type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'Konica Minolta', model:'bizhub C458',    type:'color', format:'A3A4', volMonthly:30000 },
  { brand:'Konica Minolta', model:'bizhub C558',    type:'color', format:'A3A4', volMonthly:40000 },
  { brand:'Konica Minolta', model:'bizhub C658',    type:'color', format:'A3A4', volMonthly:50000 },
  { brand:'Konica Minolta', model:'bizhub C759',    type:'color', format:'A3A4', volMonthly:70000 },

  // ══════════════════════════════════════════════════════
  // KYOCERA
  // ══════════════════════════════════════════════════════
  // Mono A4
  { brand:'Kyocera', model:'ECOSYS M2040dn',   type:'mono', format:'A4', volMonthly:3000 },
  { brand:'Kyocera', model:'ECOSYS M2540dn',   type:'mono', format:'A4', volMonthly:3500 },
  { brand:'Kyocera', model:'ECOSYS M2635dn',   type:'mono', format:'A4', volMonthly:4000 },
  { brand:'Kyocera', model:'ECOSYS M2640idw',  type:'mono', format:'A4', volMonthly:4000 },
  { brand:'Kyocera', model:'ECOSYS M3145dn',   type:'mono', format:'A4', volMonthly:6000 },
  { brand:'Kyocera', model:'ECOSYS M3655idn',  type:'mono', format:'A4', volMonthly:8000 },
  { brand:'Kyocera', model:'ECOSYS M3860idn',  type:'mono', format:'A4', volMonthly:12000 },
  // Color A4
  { brand:'Kyocera', model:'ECOSYS M5526cdn',  type:'color', format:'A4', volMonthly:4000 },
  { brand:'Kyocera', model:'ECOSYS M5526cdw',  type:'color', format:'A4', volMonthly:4000 },
  { brand:'Kyocera', model:'ECOSYS M6235cidn', type:'color', format:'A4', volMonthly:6000 },
  { brand:'Kyocera', model:'ECOSYS M6635cidn', type:'color', format:'A4', volMonthly:8000 },
  // Mono A3
  { brand:'Kyocera', model:'TASKalfa 2553ci',  type:'mono', format:'A3A4', volMonthly:15000 },
  { brand:'Kyocera', model:'TASKalfa 3253ci',  type:'mono', format:'A3A4', volMonthly:20000 },
  { brand:'Kyocera', model:'TASKalfa 4003i',   type:'mono', format:'A3A4', volMonthly:25000 },
  { brand:'Kyocera', model:'TASKalfa 5003i',   type:'mono', format:'A3A4', volMonthly:35000 },
  { brand:'Kyocera', model:'TASKalfa 6003i',   type:'mono', format:'A3A4', volMonthly:45000 },
  // Color A3
  { brand:'Kyocera', model:'TASKalfa 2553ci',  type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'Kyocera', model:'TASKalfa 3253ci',  type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'Kyocera', model:'TASKalfa 4053ci',  type:'color', format:'A3A4', volMonthly:30000 },
  { brand:'Kyocera', model:'TASKalfa 5053ci',  type:'color', format:'A3A4', volMonthly:40000 },
  { brand:'Kyocera', model:'TASKalfa 6053ci',  type:'color', format:'A3A4', volMonthly:50000 },
  { brand:'Kyocera', model:'TASKalfa 8053ci',  type:'color', format:'A3A4', volMonthly:70000 },

  // ══════════════════════════════════════════════════════
  // SHARP
  // ══════════════════════════════════════════════════════
  { brand:'Sharp', model:'MX-B382',    type:'mono',  format:'A4',   volMonthly:5000 },
  { brand:'Sharp', model:'MX-B402',    type:'mono',  format:'A4',   volMonthly:6000 },
  { brand:'Sharp', model:'MX-B452',    type:'mono',  format:'A4',   volMonthly:8000 },
  { brand:'Sharp', model:'MX-2630N',   type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'Sharp', model:'MX-2651',    type:'color', format:'A3A4', volMonthly:18000 },
  { brand:'Sharp', model:'MX-3050N',   type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'Sharp', model:'MX-3070N',   type:'color', format:'A3A4', volMonthly:25000 },
  { brand:'Sharp', model:'MX-3550N',   type:'color', format:'A3A4', volMonthly:30000 },
  { brand:'Sharp', model:'MX-4050N',   type:'color', format:'A3A4', volMonthly:40000 },
  { brand:'Sharp', model:'MX-5050N',   type:'color', format:'A3A4', volMonthly:50000 },
  { brand:'Sharp', model:'MX-6050N',   type:'color', format:'A3A4', volMonthly:60000 },
  { brand:'Sharp', model:'MX-7040N',   type:'color', format:'A3A4', volMonthly:70000 },

  // ══════════════════════════════════════════════════════
  // LEXMARK
  // ══════════════════════════════════════════════════════
  { brand:'Lexmark', model:'MB2236adw',   type:'mono',  format:'A4', volMonthly:3000 },
  { brand:'Lexmark', model:'MB2442adwe',  type:'mono',  format:'A4', volMonthly:5000 },
  { brand:'Lexmark', model:'MB2546ade',   type:'mono',  format:'A4', volMonthly:6000 },
  { brand:'Lexmark', model:'MX431adn',    type:'mono',  format:'A4', volMonthly:4000 },
  { brand:'Lexmark', model:'MX532adwe',   type:'mono',  format:'A4', volMonthly:8000 },
  { brand:'Lexmark', model:'MX632adwe',   type:'mono',  format:'A4', volMonthly:12000 },
  { brand:'Lexmark', model:'MX732adse',   type:'mono',  format:'A4', volMonthly:20000 },
  { brand:'Lexmark', model:'MC2535adwe',  type:'color', format:'A4', volMonthly:4000 },
  { brand:'Lexmark', model:'MC2640adwe',  type:'color', format:'A4', volMonthly:6000 },
  { brand:'Lexmark', model:'CX635adwe',   type:'color', format:'A4', volMonthly:8000 },
  { brand:'Lexmark', model:'CX730de',     type:'color', format:'A4', volMonthly:12000 },
  { brand:'Lexmark', model:'CX860de',     type:'color', format:'A4', volMonthly:20000 },
  { brand:'Lexmark', model:'XC9455',      type:'color', format:'A3A4', volMonthly:30000 },
  { brand:'Lexmark', model:'XC9465',      type:'color', format:'A3A4', volMonthly:40000 },

  // ══════════════════════════════════════════════════════
  // BROTHER
  // ══════════════════════════════════════════════════════
  { brand:'Brother', model:'DCP-L3550CDW',   type:'color', format:'A4', volMonthly:2000 },
  { brand:'Brother', model:'MFC-L3750CDW',   type:'color', format:'A4', volMonthly:3000 },
  { brand:'Brother', model:'MFC-L8900CDW',   type:'color', format:'A4', volMonthly:5000 },
  { brand:'Brother', model:'MFC-L9570CDW',   type:'color', format:'A4', volMonthly:8000 },
  { brand:'Brother', model:'DCP-L5510DW',    type:'mono',  format:'A4', volMonthly:4000 },
  { brand:'Brother', model:'MFC-L6800DW',    type:'mono',  format:'A4', volMonthly:6000 },
  { brand:'Brother', model:'MFC-L6900DW',    type:'mono',  format:'A4', volMonthly:8000 },
  { brand:'Brother', model:'MFC-J6955DW',    type:'color', format:'A3A4', volMonthly:3000 },
  { brand:'Brother', model:'MFC-J6945DW',    type:'color', format:'A3A4', volMonthly:3000 },

  // ══════════════════════════════════════════════════════
  // SAMSUNG (ahora HP)
  // ══════════════════════════════════════════════════════
  { brand:'Samsung', model:'ProXpress M4020ND', type:'mono',  format:'A4', volMonthly:3000 },
  { brand:'Samsung', model:'ProXpress M4070FR', type:'mono',  format:'A4', volMonthly:4000 },
  { brand:'Samsung', model:'ProXpress M4580FX', type:'mono',  format:'A4', volMonthly:8000 },
  { brand:'Samsung', model:'ProXpress C3060FR', type:'color', format:'A4', volMonthly:5000 },
  { brand:'Samsung', model:'ProXpress C4060FX', type:'color', format:'A4', volMonthly:8000 },

  // ══════════════════════════════════════════════════════
  // TOSHIBA
  // ══════════════════════════════════════════════════════
  { brand:'Toshiba', model:'e-STUDIO 2010AC',  type:'color', format:'A3A4', volMonthly:15000 },
  { brand:'Toshiba', model:'e-STUDIO 2515AC',  type:'color', format:'A3A4', volMonthly:18000 },
  { brand:'Toshiba', model:'e-STUDIO 3015AC',  type:'color', format:'A3A4', volMonthly:20000 },
  { brand:'Toshiba', model:'e-STUDIO 3515AC',  type:'color', format:'A3A4', volMonthly:25000 },
  { brand:'Toshiba', model:'e-STUDIO 4515AC',  type:'color', format:'A3A4', volMonthly:35000 },
  { brand:'Toshiba', model:'e-STUDIO 5015AC',  type:'color', format:'A3A4', volMonthly:45000 },
  { brand:'Toshiba', model:'e-STUDIO 2020AC',  type:'mono',  format:'A3A4', volMonthly:15000 },
  { brand:'Toshiba', model:'e-STUDIO 2520AC',  type:'mono',  format:'A3A4', volMonthly:20000 },
  { brand:'Toshiba', model:'e-STUDIO 4020AC',  type:'mono',  format:'A3A4', volMonthly:35000 },
  
]

// Lookup rápido por marca + modelo
export function findCompetitor(brand: string, model: string): CompetitorDevice | undefined {
  const brandNorm = normalizeText(brand)
  const modelNorm = stripNoiseWords(model)
  const inputCode = extractModelCode(brand, model)

  const candidates = COMPETITOR_DEVICES.filter(
    d => normalizeText(d.brand) === brandNorm
  )

  // 1. Match por código real del modelo
  if (inputCode) {
    const byCode = candidates.find(d => extractModelCode(d.brand, d.model) === inputCode)
    if (byCode) return byCode
  }

  // 2. Match exacto normalizado
  const exact = candidates.find(d => stripNoiseWords(d.model) === modelNorm)
  if (exact) return exact

  // 3. Match parcial por contención
  const partial = candidates.find(d => {
    const dbNorm = stripNoiseWords(d.model)
    return safeIncludes(dbNorm, modelNorm)
  })
  if (partial) return partial

  return undefined
}
export const COMPETITOR_BRANDS = Array.from(
  new Set(COMPETITOR_DEVICES.map(d => d.brand))
).sort()

export function getModelsByBrand(brand: string): CompetitorDevice[] {
  const b = normalizeText(brand)

  return COMPETITOR_DEVICES.filter(
    d => normalizeText(d.brand) === b
  )
}