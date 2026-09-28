// SeloStatus: etiqueta colorida com o status do pedido (e, se for o caso, "Atrasado").
// As cores e rótulos vêm de lib/status.ts.
import { Badge } from '@/componentes/ui/badge'
import { COR_ATRASADO, CORES_STATUS, ROTULOS_STATUS, comoStatus } from '@/lib/status'
import { cn } from '@/lib/utils'

interface PropriedadesSeloStatus {
  status: string
  atrasado?: boolean
}

export default function SeloStatus({ status, atrasado = false }: PropriedadesSeloStatus) {
  const statusPedido = comoStatus(status)
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <Badge variant="outline" className={cn(CORES_STATUS[statusPedido])}>
        {ROTULOS_STATUS[statusPedido]}
      </Badge>
      {atrasado && (
        <Badge variant="outline" className={COR_ATRASADO}>
          Atrasado
        </Badge>
      )}
    </span>
  )
}
