// Hook (TanStack Query) do painel de métricas.
import { useQuery } from '@tanstack/react-query'

import { obter } from './cliente'
import type { Painel } from './tipos'

// Invalidada pelas mutações de pedidos e cotações, que alteram as métricas
export const chavePainel = ['painel'] as const

/** Hook do painel (GET /painel): contagens, frete médio, atrasados e prazo médio. */
export function usePainel() {
  return useQuery({ queryKey: chavePainel, queryFn: () => obter<Painel>('/painel') })
}
