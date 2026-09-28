// BotaoCancelarPedido: botão "Cancelar pedido" com diálogo de confirmação.
// Usa DELETE /pedidos/{id} (useCancelarPedido) e volta para a fila após o sucesso.
import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCancelarPedido } from '@/api/pedidos'
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

interface PropriedadesBotaoCancelar {
  idPedido: number
  idExterno: number
}

export default function BotaoCancelarPedido({ idPedido, idExterno }: PropriedadesBotaoCancelar) {
  const [aberto, setAberto] = useState(false)
  const navegar = useNavigate()
  const cancelamento = useCancelarPedido(idPedido)

  function confirmar() {
    cancelamento.mutate(undefined, {
      onSuccess: () => {
        setAberto(false)
        navegar('/')
      },
    })
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle /> Cancelar pedido
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar o pedido #{idExterno}?</DialogTitle>
          <DialogDescription>
            O pedido sai da operação e não poderá ser cotado nem enviado. O histórico é mantido.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Voltar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={confirmar} disabled={cancelamento.isPending}>
            {cancelamento.isPending && <Loader2 className="animate-spin" />}
            Confirmar cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
