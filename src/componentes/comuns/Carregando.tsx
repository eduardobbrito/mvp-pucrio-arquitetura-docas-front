// Carregando: esqueleto animado exibido enquanto os dados da API chegam.
// `linhas` controla quantas faixas cinzas aparecem.
import { Skeleton } from '@/componentes/ui/skeleton'

interface PropriedadesCarregando {
  linhas?: number
}

export default function Carregando({ linhas = 5 }: PropriedadesCarregando) {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, indice) => (
        <Skeleton key={indice} className="h-10 w-full" />
      ))}
    </div>
  )
}
