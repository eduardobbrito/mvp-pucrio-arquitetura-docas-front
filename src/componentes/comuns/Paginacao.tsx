// Paginacao: controles "Anterior / Próxima" com a indicação "Página X de Y".
// Recebe a página atual e o total da resposta paginada da API.
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/componentes/ui/button'

interface PropriedadesPaginacao {
  pagina: number
  totalPaginas: number
  aoMudar: (pagina: number) => void
}

export default function Paginacao({ pagina, totalPaginas, aoMudar }: PropriedadesPaginacao) {
  if (totalPaginas <= 1) return null
  return (
    <nav className="flex items-center justify-between gap-2 pt-4" aria-label="Paginação">
      <Button variant="outline" size="sm" onClick={() => aoMudar(pagina - 1)} disabled={pagina <= 1}>
        <ChevronLeft /> Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {pagina} de {totalPaginas}
      </span>
      <Button variant="outline" size="sm" onClick={() => aoMudar(pagina + 1)} disabled={pagina >= totalPaginas}>
        Próxima <ChevronRight />
      </Button>
    </nav>
  )
}
