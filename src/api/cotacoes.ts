// Hooks (TanStack Query) das cotações de frete.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { atualizar } from './cliente'
import { chavePainel } from './painel'
import { chavesPedidos } from './pedidos'
import type { PedidoDetalhe } from './tipos'

/** PUT /cotacoes/{id}/contratar — contrata a cotação e move o pedido para "contratado". */
export function contratarCotacao(idCotacao: number) {
  return atualizar<PedidoDetalhe>(`/cotacoes/${idCotacao}/contratar`)
}

/** Hook "Contratar": invalida os pedidos (fila e detalhe) e avisa o resultado. */
export function useContratarCotacao() {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: contratarCotacao,
    onSuccess: () => {
      clienteConsultas.invalidateQueries({ queryKey: chavesPedidos.todos })
      clienteConsultas.invalidateQueries({ queryKey: chavePainel })
      toast.success('Frete contratado', { description: 'Quando o pedido sair do armazém, marque-o em trânsito.' })
    },
    onError: (erro) => toast.error('Falha ao contratar', { description: erro.message }),
  })
}
