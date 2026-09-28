// TabelaModalidades: modalidades de frete (somente leitura) e como cada uma
// ajusta o valor e o prazo da tarifa base. Dados: GET /modalidades (useModalidades).
import { AlertTriangle } from 'lucide-react'

import { useModalidades } from '@/api/tarifas'
import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import { Badge } from '@/componentes/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'

/** Descreve a regra de prazo: "+4 dias", "−2 dias (mín. 1, máx. 3)". */
function descreverPrazo(ajuste: number, minimo: number, maximo: number | null): string {
  const base = ajuste === 0 ? 'Prazo base' : `${ajuste > 0 ? '+' : '−'}${Math.abs(ajuste)} dia(s)`
  const limites = [`mín. ${minimo}`, maximo != null ? `máx. ${maximo}` : null].filter(Boolean).join(', ')
  return `${base} (${limites})`
}

export default function TabelaModalidades() {
  const { data, isLoading, isError, error } = useModalidades()

  if (isLoading) return <Carregando linhas={3} />
  if (isError) return <EstadoVazio icone={AlertTriangle} titulo="Falha ao carregar modalidades" descricao={error.message} />
  if (!data || data.modalidades.length === 0) return <EstadoVazio titulo="Nenhuma modalidade cadastrada" />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Modalidade</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.modalidades.map((modalidade) => (
          <TableRow key={modalidade.id}>
            <TableCell className="font-medium">{modalidade.nome}</TableCell>
            {/* Multiplicador em texto: 0,7 → "70% da tarifa" */}
            <TableCell>{Math.round(modalidade.multiplicador_valor * 100)}% da tarifa</TableCell>
            <TableCell>
              {descreverPrazo(modalidade.ajuste_prazo_dias, modalidade.prazo_minimo_dias, modalidade.prazo_maximo_dias)}
            </TableCell>
            <TableCell>
              <Badge variant={modalidade.ativa ? 'secondary' : 'outline'}>{modalidade.ativa ? 'Ativa' : 'Inativa'}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
