// DetalhePedido: tudo sobre um pedido — cliente, endereço, pesos, itens,
// cotações, ações do fluxo e linha do tempo.
// Dados: GET /pedidos/{id} via usePedido; as ações usam os hooks de src/api.
import { AlertTriangle, ArrowLeft, Calculator, FileSignature, Loader2, MapPin, ShieldAlert, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useContratarCotacao } from '@/api/cotacoes'
import { useAtualizarStatus, useCotarPedido, usePedido } from '@/api/pedidos'
import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import BotaoCancelarPedido from '@/componentes/pedidos/BotaoCancelarPedido'
import CartaoCotacao from '@/componentes/pedidos/CartaoCotacao'
import LinhaDoTempo from '@/componentes/pedidos/LinhaDoTempo'
import SeloStatus from '@/componentes/pedidos/SeloStatus'
import TabelaItens from '@/componentes/pedidos/TabelaItens'
import { Button } from '@/componentes/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card'
import { formatarData, formatarDataHora, formatarDistancia, formatarMoeda, formatarPeso } from '@/lib/formatadores'
import { PROXIMO_AVANCO, comoStatus, podeCancelar, podeContratar, podeCotar } from '@/lib/status'

export default function DetalhePedido() {
  const { id } = useParams()
  const idPedido = Number(id)
  const { data: pedido, isLoading, isError, error } = usePedido(idPedido)
  const cotacao = useCotarPedido(idPedido)
  const contratacao = useContratarCotacao()
  const avanco = useAtualizarStatus(idPedido)
  // Cotação escolhida pelo operador antes de clicar em "Contratar"
  const [idSelecionada, setIdSelecionada] = useState<number | null>(null)

  const voltar = (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/">
        <ArrowLeft /> Voltar para a fila
      </Link>
    </Button>
  )

  if (isLoading) return <Carregando linhas={8} />
  if (isError || !pedido) {
    return (
      <div className="space-y-4">
        {voltar}
        <EstadoVazio
          icone={AlertTriangle}
          titulo="Pedido não encontrado"
          descricao={error?.message ?? 'Verifique o endereço e tente novamente.'}
        />
      </div>
    )
  }

  // Próximo avanço manual (em trânsito ou entregue), se houver
  const proximoAvanco = PROXIMO_AVANCO[comoStatus(pedido.status)]

  return (
    <div className="space-y-6">
      {voltar}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight">
            Pedido #{pedido.id_externo}
            <SeloStatus status={pedido.status} atrasado={pedido.atrasado} />
          </h1>
          <p className="text-sm text-muted-foreground">
            Importado em {formatarDataHora(pedido.importado_em)}
            {pedido.data_prometida && ` · entrega prometida para ${formatarData(pedido.data_prometida)}`}
          </p>
        </div>

        {/* Ações do fluxo: só aparecem as permitidas no status atual (lib/status.ts) */}
        <div className="flex flex-wrap gap-2">
          {proximoAvanco && (
            <Button
              onClick={() => avanco.mutate({ status: proximoAvanco.status, observacao: null })}
              disabled={avanco.isPending}
            >
              {avanco.isPending ? <Loader2 className="animate-spin" /> : <Truck />}
              {proximoAvanco.rotulo}
            </Button>
          )}
          {podeCancelar(pedido.status) && <BotaoCancelarPedido idPedido={pedido.id} idExterno={pedido.id_externo} />}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cliente e entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">{pedido.cliente_nome}</p>
              <p className="text-muted-foreground">{pedido.cliente_email}</p>
            </div>
            <div className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <p>
                {pedido.logradouro}, {pedido.numero} — {pedido.bairro}
                <br />
                {pedido.cidade}/{pedido.uf} · CEP {pedido.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
              </p>
            </div>
            {/* Aviso quando a BrasilAPI não confirmou o endereço na importação */}
            {!pedido.endereco_verificado && (
              <p className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-800">
                <ShieldAlert className="size-4 shrink-0" aria-hidden />
                Endereço não verificado na BrasilAPI; usado o cadastro de origem.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carga e distância</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Valor da mercadoria</dt>
              <dd className="text-right font-medium">{formatarMoeda(pedido.valor_mercadoria)}</dd>
              <dt className="text-muted-foreground">Peso real</dt>
              <dd className="text-right">{formatarPeso(pedido.peso_real)}</dd>
              <dt className="text-muted-foreground">Peso cubado</dt>
              <dd className="text-right">{formatarPeso(pedido.peso_cubado)}</dd>
              {/* O frete é cobrado pelo maior entre peso real e cubado */}
              <dt className="text-muted-foreground">Peso cobrado</dt>
              <dd className="text-right font-medium">{formatarPeso(pedido.peso_cobrado)}</dd>
              <dt className="text-muted-foreground">Distância do armazém</dt>
              <dd className="text-right font-medium">{formatarDistancia(pedido.distancia_km)}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Frete</CardTitle>
            <CardDescription>
              {pedido.cotacoes.length === 0
                ? 'Gere as cotações para comparar as modalidades.'
                : podeContratar(pedido.status)
                  ? 'Selecione uma modalidade e contrate o frete.'
                  : 'Cotações geradas para este pedido.'}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {podeCotar(pedido.status) && (
              <Button
                variant={pedido.cotacoes.length ? 'outline' : 'default'}
                onClick={() => cotacao.mutate(undefined, { onSuccess: () => setIdSelecionada(null) })}
                disabled={cotacao.isPending}
              >
                {cotacao.isPending ? <Loader2 className="animate-spin" /> : <Calculator />}
                {pedido.cotacoes.length ? 'Cotar novamente' : 'Cotar frete'}
              </Button>
            )}
            {podeContratar(pedido.status) && (
              <Button
                onClick={() => idSelecionada && contratacao.mutate(idSelecionada)}
                // Habilitado só depois que o operador escolhe uma cotação
                disabled={!idSelecionada || contratacao.isPending}
              >
                {contratacao.isPending ? <Loader2 className="animate-spin" /> : <FileSignature />}
                Contratar
              </Button>
            )}
          </div>
        </CardHeader>
        {pedido.cotacoes.length > 0 && (
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {pedido.cotacoes.map((item) => (
              <CartaoCotacao
                key={item.id}
                cotacao={item}
                selecionada={item.id === idSelecionada}
                selecionavel={podeContratar(pedido.status)}
                aoSelecionar={() => setIdSelecionada(item.id)}
              />
            ))}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linha do tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <LinhaDoTempo status={pedido.status} movimentacoes={pedido.movimentacoes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itens ({pedido.itens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaItens itens={pedido.itens} />
        </CardContent>
      </Card>
    </div>
  )
}
