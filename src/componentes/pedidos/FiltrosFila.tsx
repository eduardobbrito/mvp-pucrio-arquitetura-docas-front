// FiltrosFila: filtros da fila de pedidos — status, UF de destino e busca livre.
// Não guarda estado próprio além do texto digitado: os valores vêm e voltam para a
// página (que os sincroniza com a query string da URL).
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/componentes/ui/select'
import { ROTULOS_STATUS, TODOS_STATUS } from '@/lib/status'
import { UFS } from '@/lib/ufs'

// O Select do Radix não aceita valor vazio; "todos" representa "sem filtro"
const TODOS = 'todos'
// Espera após a última tecla antes de buscar, para não chamar a API a cada letra
const ATRASO_BUSCA_MS = 400

export interface ValoresFiltros {
  status: string
  uf: string
  q: string
}

interface PropriedadesFiltrosFila {
  valores: ValoresFiltros
  aoMudar: (novos: Partial<ValoresFiltros>) => void
}

export default function FiltrosFila({ valores, aoMudar }: PropriedadesFiltrosFila) {
  const [texto, setTexto] = useState(valores.q)
  const [qAnterior, setQAnterior] = useState(valores.q)

  // Mantém o campo em dia se a URL mudar por fora (ex.: "Limpar filtros" ou voltar do
  // navegador). Ajustar o estado durante a renderização é o padrão indicado pelo React
  // para isso, em vez de um useEffect.
  if (valores.q !== qAnterior) {
    setQAnterior(valores.q)
    setTexto(valores.q)
  }

  // Debounce: só repassa a busca depois de ATRASO_BUSCA_MS sem digitação
  useEffect(() => {
    if (texto === valores.q) return
    const temporizador = setTimeout(() => aoMudar({ q: texto }), ATRASO_BUSCA_MS)
    return () => clearTimeout(temporizador)
  }, [texto, valores.q, aoMudar])

  const temFiltro = Boolean(valores.status || valores.uf || valores.q)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Cliente, cidade ou nº do pedido"
          aria-label="Buscar pedidos"
          className="pl-8"
        />
      </div>

      <Select value={valores.status || TODOS} onValueChange={(valor) => aoMudar({ status: valor === TODOS ? '' : valor })}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Filtrar por status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos os status</SelectItem>
          {TODOS_STATUS.map((status) => (
            <SelectItem key={status} value={status}>
              {ROTULOS_STATUS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={valores.uf || TODOS} onValueChange={(valor) => aoMudar({ uf: valor === TODOS ? '' : valor })}>
        <SelectTrigger className="w-full sm:w-36" aria-label="Filtrar por UF">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todas as UFs</SelectItem>
          {UFS.map((uf) => (
            <SelectItem key={uf} value={uf}>
              {uf}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {temFiltro && (
        <Button variant="ghost" onClick={() => aoMudar({ status: '', uf: '', q: '' })}>
          <X /> Limpar filtros
        </Button>
      )}
    </div>
  )
}
