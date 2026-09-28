// LinhaDoTempo: os cinco status do fluxo (recebido → entregue) marcados conforme o
// progresso do pedido, seguidos do histórico de movimentações com data e observação.
// Dados: `status` e `movimentacoes` do detalhe do pedido.
import { Check, Circle, XCircle } from 'lucide-react'

import type { Movimentacao } from '@/api/tipos'
import { formatarDataHora } from '@/lib/formatadores'
import { ORDEM_FLUXO, ROTULOS_STATUS, comoStatus } from '@/lib/status'
import { cn } from '@/lib/utils'

interface PropriedadesLinhaDoTempo {
  status: string
  movimentacoes: Movimentacao[]
}

export default function LinhaDoTempo({ status, movimentacoes }: PropriedadesLinhaDoTempo) {
  const cancelado = status === 'cancelado'
  // Em um pedido cancelado, o progresso vai até o último status antes do cancelamento
  const ultimoAtivo = cancelado
    ? comoStatus(movimentacoes.at(-1)?.de_status ?? 'recebido')
    : comoStatus(status)
  const indiceAtual = ORDEM_FLUXO.indexOf(ultimoAtivo)

  return (
    <div className="space-y-6">
      <ol className="grid grid-cols-5 gap-2" aria-label="Progresso do pedido">
        {ORDEM_FLUXO.map((etapa, indice) => {
          const concluida = indice <= indiceAtual
          return (
            <li key={etapa} className="flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2',
                  concluida ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30',
                  cancelado && concluida && 'border-muted-foreground bg-muted-foreground',
                )}
              >
                {concluida ? <Check className="size-4" /> : <Circle className="size-3 text-muted-foreground/40" />}
              </span>
              <span className={cn('text-xs', concluida ? 'font-medium' : 'text-muted-foreground')}>
                {ROTULOS_STATUS[etapa]}
              </span>
            </li>
          )
        })}
      </ol>

      {cancelado && (
        <p className="flex items-center gap-2 text-sm font-medium text-red-700">
          <XCircle className="size-4" aria-hidden /> Pedido cancelado antes da entrega.
        </p>
      )}

      {/* Histórico: da movimentação mais recente para a mais antiga */}
      <ul className="space-y-3 border-l pl-4">
        {[...movimentacoes].reverse().map((mov) => (
          <li key={mov.id} className="relative text-sm">
            <span className="absolute top-1.5 -left-[21px] size-2.5 rounded-full bg-primary" aria-hidden />
            <p className="font-medium">
              {mov.de_status
                ? `${ROTULOS_STATUS[comoStatus(mov.de_status)]} → ${ROTULOS_STATUS[comoStatus(mov.para_status)]}`
                : ROTULOS_STATUS[comoStatus(mov.para_status)]}
            </p>
            <p className="text-muted-foreground">
              {formatarDataHora(mov.criado_em)}
              {mov.observacao && ` · ${mov.observacao}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
