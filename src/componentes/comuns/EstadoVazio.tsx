// EstadoVazio: mensagem exibida quando uma lista não tem itens (ou quando houve erro).
// Recebe título, descrição e, opcionalmente, um ícone e uma ação (ex.: botão de importar).
import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface PropriedadesEstadoVazio {
  titulo: string
  descricao?: string
  icone?: LucideIcon
  acao?: ReactNode
}

export default function EstadoVazio({ titulo, descricao, icone: Icone = Inbox, acao }: PropriedadesEstadoVazio) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center">
      <Icone className="size-10 text-muted-foreground" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{titulo}</p>
        {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
      </div>
      {acao}
    </div>
  )
}
