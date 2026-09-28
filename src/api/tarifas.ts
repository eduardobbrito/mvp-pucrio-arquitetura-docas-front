// Funções e hooks (TanStack Query) de tarifas e modalidades de frete.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { atualizar, enviar, obter, remover } from './cliente'
import type { ListaModalidades, ListaTarifas, Tarifa, TarifaEntrada } from './tipos'

export const chavesTarifas = {
  todas: ['tarifas'] as const,
  modalidades: ['modalidades'] as const,
}

/** Hook da tabela de tarifas (GET /tarifas). */
export function useTarifas() {
  return useQuery({ queryKey: chavesTarifas.todas, queryFn: () => obter<ListaTarifas>('/tarifas') })
}

/** Hook das modalidades (GET /modalidades). */
export function useModalidades() {
  return useQuery({ queryKey: chavesTarifas.modalidades, queryFn: () => obter<ListaModalidades>('/modalidades') })
}

/**
 * Hook que cria (POST /tarifas) ou edita (PUT /tarifas/{id}) uma tarifa.
 * Com `id` edita; sem `id` cria.
 */
export function useSalvarTarifa() {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dados }: { id?: number; dados: TarifaEntrada }) =>
      id ? atualizar<Tarifa>(`/tarifas/${id}`, dados) : enviar<Tarifa>('/tarifas', dados),
    onSuccess: (_tarifa, { id }) => {
      clienteConsultas.invalidateQueries({ queryKey: chavesTarifas.todas })
      toast.success(id ? 'Tarifa atualizada' : 'Tarifa criada', {
        description: 'Novas cotações já usam o valor novo; cotações existentes não mudam.',
      })
    },
    onError: (erro) => toast.error('Falha ao salvar a tarifa', { description: erro.message }),
  })
}

/** Hook de remoção de tarifa (DELETE /tarifas/{id}). */
export function useRemoverTarifa() {
  const clienteConsultas = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => remover<{ id: number; mensagem: string }>(`/tarifas/${id}`),
    onSuccess: () => {
      clienteConsultas.invalidateQueries({ queryKey: chavesTarifas.todas })
      toast.success('Tarifa removida')
    },
    onError: (erro) => toast.error('Falha ao remover a tarifa', { description: erro.message }),
  })
}
