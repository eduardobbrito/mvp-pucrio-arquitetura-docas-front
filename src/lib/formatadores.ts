// Formatadores de exibição no padrão brasileiro: moeda, datas, peso e distância.

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })
const inteiro = new Intl.NumberFormat('pt-BR')

/** 1234.5 → "R$ 1.234,50"; nulo vira travessão. */
export function formatarMoeda(valor: number | null | undefined): string {
  return valor == null ? '—' : moeda.format(valor)
}

/**
 * "2026-10-06" → "06/10/2026".
 * A data vem sem fuso; montamos pelas partes para o fuso do navegador não
 * "voltar um dia", o que aconteceria com new Date("2026-10-06").
 */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

/** "2026-09-27T23:00:37" → "27/09/2026 23:00". */
export function formatarDataHora(iso: string | null | undefined): string {
  if (!iso) return '—'
  const data = new Date(iso)
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

/** 12.345 → "12,35 kg". */
export function formatarPeso(kg: number | null | undefined): string {
  return kg == null ? '—' : `${decimal.format(kg)} kg`
}

/** 1214 → "1.214 km". */
export function formatarDistancia(km: number | null | undefined): string {
  return km == null ? '—' : `${inteiro.format(km)} km`
}

/** 1 → "1 dia útil"; 3 → "3 dias úteis". */
export function formatarPrazo(dias: number): string {
  return dias === 1 ? '1 dia útil' : `${dias} dias úteis`
}
