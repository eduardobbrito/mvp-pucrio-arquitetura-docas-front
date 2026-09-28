// Painel: visão geral da operação — cartões de métricas, gráfico de frete médio
// por região e distribuição dos pedidos por status. Dados: GET /painel (usePainel).
import { AlertTriangle, CalendarClock, Clock, DollarSign, Truck } from 'lucide-react'

import { usePainel } from '@/api/painel'
import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import CartaoMetrica from '@/componentes/painel/CartaoMetrica'
import GraficoFreteRegiao from '@/componentes/painel/GraficoFreteRegiao'
import SeloStatus from '@/componentes/pedidos/SeloStatus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card'
import { formatarMoeda } from '@/lib/formatadores'
import { TODOS_STATUS } from '@/lib/status'

export default function Painel() {
  const { data: painel, isLoading, isError, error } = usePainel()

  if (isLoading) return <Carregando linhas={6} />
  if (isError || !painel) {
    return <EstadoVazio icone={AlertTriangle} titulo="Falha ao carregar o painel" descricao={error?.message} />
  }

  const contagem = painel.contagem_por_status
  const temFrete = painel.frete_medio_por_regiao.some((regiao) => regiao.quantidade > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Painel</h1>
        <p className="text-sm text-muted-foreground">{painel.total_pedidos} pedido(s) na operação.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CartaoMetrica
          titulo="Aguardando cotação"
          valor={String(contagem.recebido ?? 0)}
          descricao="Pedidos recebidos ainda sem cotação"
          icone={Clock}
        />
        <CartaoMetrica
          titulo="Em trânsito"
          valor={String(contagem.em_transito ?? 0)}
          descricao="Pedidos a caminho do cliente"
          icone={Truck}
        />
        <CartaoMetrica
          titulo="Atrasados"
          valor={String(painel.atrasados)}
          descricao="Data prometida vencida e ainda não entregues"
          icone={CalendarClock}
          alerta={painel.atrasados > 0}
        />
        <CartaoMetrica
          titulo="Frete médio"
          valor={formatarMoeda(painel.frete_medio_geral)}
          descricao={
            painel.prazo_medio_contratado != null
              ? `Prazo médio de ${painel.prazo_medio_contratado.toLocaleString('pt-BR')} dia(s) útil(eis)`
              : 'Nenhum frete contratado ainda'
          }
          icone={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Frete médio por região</CardTitle>
            <CardDescription>Valor médio das cotações contratadas (sem pedidos cancelados).</CardDescription>
          </CardHeader>
          <CardContent>
            {temFrete ? (
              <GraficoFreteRegiao dados={painel.frete_medio_por_regiao} />
            ) : (
              <EstadoVazio titulo="Sem fretes contratados" descricao="Contrate cotações para ver o gráfico." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos por status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {TODOS_STATUS.map((status) => (
                <li key={status} className="flex items-center justify-between gap-2">
                  <SeloStatus status={status} />
                  <span className="font-medium tabular-nums">{contagem[status] ?? 0}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
