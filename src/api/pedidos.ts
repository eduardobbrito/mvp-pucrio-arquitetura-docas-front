// Funções e hooks (TanStack Query) dos pedidos.
// As páginas usam estes hooks e nunca chamam fetch diretamente.
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ROTULOS_STATUS, comoStatus } from '@/lib/status'

import { atualizar, enviar, montarQuery, obter, remover } from './cliente'
import { chavePainel } from './painel'
import type {
  AtualizarStatus,
  FiltrosPedidos,
  Importacao,
  ListaCotacoes,
  ListaPedidos,
  PedidoDetalhe,
} from './tipos'

// Chaves de cache: tudo que começa com ['pedidos'] é invalidado junto após mutações
export const chavesPedidos = {
  todos: ['pedidos'] as const,
  lista: (filtros: FiltrosPedidos) => ['pedidos', 'lista', filtros] as const,
  detalhe: (id: number) => ['pedidos', 'detalhe', id] as const,
}

/** GET /pedidos — lista paginada com filtros opcionais. */
export function listarPedidos(filtros: FiltrosPedidos) {
  return obter<ListaPedidos>(`/pedidos${montarQuery({ ...filtros })}`)
}

/** GET /pedidos/{id} — pedido completo. */
export function buscarPedido(id: number) {
  return obter<PedidoDetalhe>(`/pedidos/${id}`)
}

/** Hook da fila de pedidos. */
export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: chavesPedidos.lista(filtros),
    queryFn: () => listarPedidos(filtros),
    // Mantém a página anterior na tela enquanto a nova carrega (sem "piscar")
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook de importação (POST /pedidos/importar).
 * Ao concluir, invalida a fila e mostra quantos pedidos entraram.
 */
export function useImportarPedidos() {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: () => enviar<Importacao>('/pedidos/importar'),
    onSuccess: (resultado) => {
      clienteConsultas.invalidateQueries({ queryKey: chavesPedidos.todos })
      clienteConsultas.invalidateQueries({ queryKey: chavePainel })
      if (resultado.importados > 0) {
        toast.success(resultado.mensagem, {
          description: `${resultado.ignorados} pedido(s) já estavam na fila.`,
        })
      } else {
        toast.info(resultado.mensagem)
      }
    },
    onError: (erro) => toast.error('Falha ao buscar pedidos', { description: erro.message }),
  })
}

/** Hook do detalhe de um pedido (GET /pedidos/{id}). */
export function usePedido(id: number) {
  return useQuery({
    queryKey: chavesPedidos.detalhe(id),
    queryFn: () => buscarPedido(id),
    enabled: Number.isFinite(id) && id > 0, // não busca com id inválido na URL
  })
}

/** Hook "Cotar frete" (POST /pedidos/{id}/cotacoes): gera uma cotação por modalidade. */
export function useCotarPedido(id: number) {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: () => enviar<ListaCotacoes>(`/pedidos/${id}/cotacoes`),
    onSuccess: (resultado) => {
      clienteConsultas.invalidateQueries({ queryKey: chavesPedidos.todos })
      clienteConsultas.invalidateQueries({ queryKey: chavePainel })
      toast.success(`${resultado.cotacoes.length} cotação(ões) gerada(s)`, {
        description: 'Escolha uma modalidade e contrate o frete.',
      })
    },
    onError: (erro) => toast.error('Falha ao cotar o frete', { description: erro.message }),
  })
}

/** Hook de avanço de status (PUT /pedidos/{id}/status): em trânsito e entregue. */
export function useAtualizarStatus(id: number) {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: (corpo: AtualizarStatus) => atualizar<PedidoDetalhe>(`/pedidos/${id}/status`, corpo),
    onSuccess: (pedido) => {
      clienteConsultas.invalidateQueries({ queryKey: chavesPedidos.todos })
      clienteConsultas.invalidateQueries({ queryKey: chavePainel })
      toast.success(`Pedido marcado como ${ROTULOS_STATUS[comoStatus(pedido.status)].toLowerCase()}`)
    },
    onError: (erro) => toast.error('Falha ao atualizar o status', { description: erro.message }),
  })
}

/** Hook de cancelamento (DELETE /pedidos/{id}). */
export function useCancelarPedido(id: number) {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: () => remover<PedidoDetalhe>(`/pedidos/${id}`),
    onSuccess: (pedido) => {
      clienteConsultas.invalidateQueries({ queryKey: chavesPedidos.todos })
      clienteConsultas.invalidateQueries({ queryKey: chavePainel })
      toast.success(`Pedido #${pedido.id_externo} cancelado`)
    },
    onError: (erro) => toast.error('Falha ao cancelar o pedido', { description: erro.message }),
  })
}
