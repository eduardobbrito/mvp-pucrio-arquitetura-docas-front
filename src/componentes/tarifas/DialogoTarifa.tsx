// DialogoTarifa: formulário em diálogo para criar ou editar uma tarifa
// (faixa de peso × faixa de distância → valor e prazo base).
// Envia via useSalvarTarifa (POST /tarifas ou PUT /tarifas/{id}).
import { Loader2 } from 'lucide-react'
import { type FormEvent, type ReactNode, useState } from 'react'

import { useSalvarTarifa } from '@/api/tarifas'
import type { Tarifa, TarifaEntrada } from '@/api/tipos'
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
import { Input } from '@/componentes/ui/input'

interface PropriedadesDialogoTarifa {
  tarifa?: Tarifa // ausente = criação
  gatilho: ReactNode // botão que abre o diálogo
}

// Campos do formulário, com rótulo, passo do input e ajuda
const CAMPOS: { nome: keyof TarifaEntrada; rotulo: string; passo: string; ajuda: string }[] = [
  { nome: 'peso_max_kg', rotulo: 'Peso máximo (kg)', passo: '0.1', ajuda: 'Limite superior da faixa de peso' },
  { nome: 'distancia_max_km', rotulo: 'Distância máxima (km)', passo: '1', ajuda: 'Limite superior da faixa de distância' },
  { nome: 'valor', rotulo: 'Valor base (R$)', passo: '0.01', ajuda: 'Valor da modalidade Padrão' },
  { nome: 'prazo_dias_uteis', rotulo: 'Prazo base (dias úteis)', passo: '1', ajuda: 'Prazo da modalidade Padrão' },
]

/** Converte a tarifa em textos para os inputs (vazio na criação). */
function valoresIniciais(tarifa?: Tarifa): Record<keyof TarifaEntrada, string> {
  return {
    peso_max_kg: tarifa ? String(tarifa.peso_max_kg) : '',
    distancia_max_km: tarifa ? String(tarifa.distancia_max_km) : '',
    valor: tarifa ? String(tarifa.valor) : '',
    prazo_dias_uteis: tarifa ? String(tarifa.prazo_dias_uteis) : '',
  }
}

export default function DialogoTarifa({ tarifa, gatilho }: PropriedadesDialogoTarifa) {
  const [aberto, setAberto] = useState(false)
  const [valores, setValores] = useState(() => valoresIniciais(tarifa))
  const salvamento = useSalvarTarifa()

  // Ao abrir, recarrega os valores (a tarifa pode ter mudado desde a última vez)
  function alternar(abrir: boolean) {
    if (abrir) setValores(valoresIniciais(tarifa))
    setAberto(abrir)
  }

  function salvar(evento: FormEvent) {
    evento.preventDefault()
    const dados: TarifaEntrada = {
      peso_max_kg: Number(valores.peso_max_kg),
      distancia_max_km: Math.round(Number(valores.distancia_max_km)),
      valor: Number(valores.valor),
      prazo_dias_uteis: Math.round(Number(valores.prazo_dias_uteis)),
    }
    salvamento.mutate({ id: tarifa?.id, dados }, { onSuccess: () => setAberto(false) })
  }

  return (
    <Dialog open={aberto} onOpenChange={alternar}>
      <DialogTrigger asChild>{gatilho}</DialogTrigger>
      <DialogContent>
        <form onSubmit={salvar} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{tarifa ? 'Editar tarifa' : 'Nova tarifa'}</DialogTitle>
            <DialogDescription>
              A cotação usa a menor faixa de peso e de distância que comporta o pedido. As outras modalidades
              aplicam multiplicadores sobre estes valores.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {CAMPOS.map((campo) => (
              <label key={campo.nome} className="space-y-1.5 text-sm">
                <span className="font-medium">{campo.rotulo}</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step={campo.passo}
                  required
                  value={valores[campo.nome]}
                  onChange={(evento) => setValores({ ...valores, [campo.nome]: evento.target.value })}
                />
                <span className="block text-xs text-muted-foreground">{campo.ajuda}</span>
              </label>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={salvamento.isPending}>
              {salvamento.isPending && <Loader2 className="animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
