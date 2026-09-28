// Regras de apresentação dos status do pedido: rótulos, cores e próximos passos.
// Espelha a máquina de estados da API (services/fluxo.py), que é quem de fato valida.
import type { StatusPedido } from '@/api/tipos'

/** Ordem do fluxo feliz, usada na linha do tempo. */
export const ORDEM_FLUXO: StatusPedido[] = ['recebido', 'cotado', 'contratado', 'em_transito', 'entregue']

/** Todos os status, na ordem em que aparecem em filtros e legendas. */
export const TODOS_STATUS: StatusPedido[] = [...ORDEM_FLUXO, 'cancelado']

export const ROTULOS_STATUS: Record<StatusPedido, string> = {
  recebido: 'Recebido',
  cotado: 'Cotado',
  contratado: 'Contratado',
  em_transito: 'Em trânsito',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

// Cores fixas e semânticas: neutro, alerta, destaque, sucesso e erro
export const CORES_STATUS: Record<StatusPedido, string> = {
  recebido: 'bg-slate-100 text-slate-700 border-slate-200',
  cotado: 'bg-amber-100 text-amber-800 border-amber-200',
  contratado: 'bg-blue-100 text-blue-800 border-blue-200',
  em_transito: 'bg-blue-600 text-white border-blue-600',
  entregue: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
}

export const COR_ATRASADO = 'bg-red-600 text-white border-red-600'

/** Próximo avanço manual (PUT /pedidos/{id}/status) permitido a partir de cada status. */
export const PROXIMO_AVANCO: Partial<Record<StatusPedido, { status: StatusPedido; rotulo: string }>> = {
  contratado: { status: 'em_transito', rotulo: 'Marcar em trânsito' },
  em_transito: { status: 'entregue', rotulo: 'Marcar entregue' },
}

/** Cotar é permitido em recebido e, para refazer a cotação, em cotado. */
export function podeCotar(status: string): boolean {
  return status === 'recebido' || status === 'cotado'
}

/** Contratar só é possível com cotações geradas e ainda não contratadas. */
export function podeContratar(status: string): boolean {
  return status === 'cotado'
}

/** Cancelar só antes de o pedido sair do armazém (em_transito). */
export function podeCancelar(status: string): boolean {
  return status === 'recebido' || status === 'cotado' || status === 'contratado'
}

/** Converte o texto vindo da API no tipo de status (com fallback seguro). */
export function comoStatus(status: string): StatusPedido {
  return (TODOS_STATUS as string[]).includes(status) ? (status as StatusPedido) : 'recebido'
}
