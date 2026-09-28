// BotaoRemoverTarifa: ícone de lixeira com diálogo de confirmação.
// Remove a tarifa via DELETE /tarifas/{id} (useRemoverTarifa).
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useRemoverTarifa } from '@/api/tarifas'
import type { Tarifa } from '@/api/tipos'
import { Button } from '@/componentes/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/componentes/ui/dialog'
import { formatarDistancia, formatarPeso } from '@/lib/formatadores'

interface PropriedadesBotaoRemover {
  tarifa: Tarifa
}

export default function BotaoRemoverTarifa({ tarifa }: PropriedadesBotaoRemover) {
  const [aberto, setAberto] = useState(false)
  const remocao = useRemoverTarifa()
  const faixa = `até ${formatarPeso(tarifa.peso_max_kg)} e ${formatarDistancia(tarifa.distancia_max_km)}`

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Remover tarifa ${faixa}`}>
          <Trash2 className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover a tarifa {faixa}?</DialogTitle>
          <DialogDescription>
            Pedidos nessa faixa passarão a usar a próxima faixa maior. Cotações já geradas não mudam.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Voltar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={remocao.isPending}
            onClick={() => remocao.mutate(tarifa.id, { onSuccess: () => setAberto(false) })}
          >
            {remocao.isPending && <Loader2 className="animate-spin" />}
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
