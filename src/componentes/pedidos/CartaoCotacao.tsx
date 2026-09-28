// CartaoCotacao: uma opção de frete (modalidade) com valor, prazo e data prometida.
// Clicável para seleção antes da contratação; a cotação contratada aparece em destaque.
// Dados: item de `cotacoes` do detalhe do pedido.
import { CheckCircle2 } from 'lucide-react'

import type { Cotacao } from '@/api/tipos'
import { formatarData, formatarMoeda, formatarPrazo } from '@/lib/formatadores'
import { cn } from '@/lib/utils'

interface PropriedadesCartaoCotacao {
  cotacao: Cotacao
  selecionada: boolean
  selecionavel: boolean
  aoSelecionar: () => void
}

export default function CartaoCotacao({ cotacao, selecionada, selecionavel, aoSelecionar }: PropriedadesCartaoCotacao) {
  return (
    <button
      type="button"
      onClick={aoSelecionar}
      disabled={!selecionavel}
      aria-pressed={selecionada}
      className={cn(
        'flex w-full flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        selecionavel && 'cursor-pointer hover:border-primary/50',
        selecionada && 'border-primary ring-2 ring-primary/30',
        // Destaque verde para a cotação já contratada
        cotacao.contratada && 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30',
        !selecionavel && !cotacao.contratada && 'opacity-60',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{cotacao.modalidade_nome}</span>
        {cotacao.contratada && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="size-4" aria-hidden /> Contratada
          </span>
        )}
      </div>
      <span className="text-2xl font-semibold">{formatarMoeda(cotacao.valor)}</span>
      <span className="text-sm text-muted-foreground">
        {formatarPrazo(cotacao.prazo_dias_uteis)} · entrega até {formatarData(cotacao.data_prometida)}
      </span>
    </button>
  )
}
