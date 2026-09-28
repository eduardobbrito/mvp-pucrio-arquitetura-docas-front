// FilaPedidos: página inicial com a fila de pedidos importados da loja.
// Dados: GET /pedidos via hook usePedidos; o botão "Buscar novos pedidos" usa
// POST /pedidos/importar (useImportarPedidos). Cada linha abre o detalhe do pedido.
import { AlertTriangle, Download, Loader2, PackageSearch } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useImportarPedidos, usePedidos } from '@/api/pedidos'
import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import SeloStatus from '@/componentes/pedidos/SeloStatus'
import { Button } from '@/componentes/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'
import { formatarData, formatarDistancia, formatarPeso } from '@/lib/formatadores'
import { cn } from '@/lib/utils'

// Sem filtros e paginação na interface (próxima etapa), a fila mostra os 50 pedidos mais recentes
const FILTROS_FILA = { pagina: 1, por_pagina: 50 }

export default function FilaPedidos() {
  const navegar = useNavigate()
  const { data, isLoading, isError, error } = usePedidos(FILTROS_FILA)
  const importacao = useImportarPedidos()

  // Botão reutilizado no cabeçalho e no estado vazio
  const botaoImportar = (
    <Button onClick={() => importacao.mutate()} disabled={importacao.isPending}>
      {importacao.isPending ? <Loader2 className="animate-spin" /> : <Download />}
      {importacao.isPending ? 'Buscando pedidos…' : 'Buscar novos pedidos'}
    </Button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fila de pedidos</h1>
          <p className="text-sm text-muted-foreground">Pedidos da loja aguardando cotação, contratação e entrega.</p>
        </div>
        {botaoImportar}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          {data && (
            <CardDescription>
              Exibindo {data.pedidos.length} de {data.total} pedido(s), do mais recente para o mais antigo.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {isLoading && <Carregando />}

          {isError && (
            <EstadoVazio icone={AlertTriangle} titulo="Não foi possível carregar a fila" descricao={error.message} />
          )}

          {data && data.pedidos.length === 0 && (
            <EstadoVazio
              icone={PackageSearch}
              titulo="Nenhum pedido na fila"
              descricao="Busque novos pedidos na loja para começar."
              acao={botaoImportar}
            />
          )}

          {data && data.pedidos.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead className="text-right">Itens</TableHead>
                  <TableHead className="text-right">Peso cobrado</TableHead>
                  <TableHead>Entrega prometida</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pedidos.map((pedido) => (
                  // Linha atrasada ganha fundo avermelhado para chamar atenção na fila
                  <TableRow
                    key={pedido.id}
                    className={cn('cursor-pointer', pedido.atrasado && 'bg-red-50 hover:bg-red-100')}
                    onClick={() => navegar(`/pedidos/${pedido.id}`)}
                  >
                    <TableCell className="font-medium">
                      {/* Link real para acessibilidade (teclado e leitor de tela) */}
                      <a
                        href={`/pedidos/${pedido.id}`}
                        onClick={(evento) => {
                          evento.preventDefault()
                          navegar(`/pedidos/${pedido.id}`)
                        }}
                        className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        #{pedido.id_externo}
                      </a>
                    </TableCell>
                    <TableCell>{pedido.cliente_nome}</TableCell>
                    <TableCell>
                      {pedido.cidade}/{pedido.uf}
                      <span className="block text-xs text-muted-foreground">
                        {formatarDistancia(pedido.distancia_km)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{pedido.quantidade_itens}</TableCell>
                    <TableCell className="text-right">{formatarPeso(pedido.peso_cobrado)}</TableCell>
                    <TableCell className={pedido.atrasado ? 'font-medium text-red-700' : undefined}>
                      {formatarData(pedido.data_prometida)}
                    </TableCell>
                    <TableCell>
                      {/* Selo "Atrasado" quando a data prometida passou (calculado pela API) */}
                      <SeloStatus status={pedido.status} atrasado={pedido.atrasado} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
