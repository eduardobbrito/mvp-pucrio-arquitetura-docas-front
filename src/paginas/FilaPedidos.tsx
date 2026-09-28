// FilaPedidos: página inicial com a fila de pedidos importados da loja.
// Dados: GET /pedidos via hook usePedidos, com filtros (status, UF, busca) e página
// guardados na query string da URL — assim o link da fila filtrada pode ser
// compartilhado e o botão "voltar" do navegador funciona. O botão "Buscar novos
// pedidos" usa POST /pedidos/importar (useImportarPedidos).
import { AlertTriangle, Download, Loader2, PackageSearch, SearchX } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useImportarPedidos, usePedidos } from '@/api/pedidos'
import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import Paginacao from '@/componentes/comuns/Paginacao'
import FiltrosFila, { type ValoresFiltros } from '@/componentes/pedidos/FiltrosFila'
import SeloStatus from '@/componentes/pedidos/SeloStatus'
import { Button } from '@/componentes/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'
import { formatarData, formatarDistancia, formatarPeso } from '@/lib/formatadores'
import { cn } from '@/lib/utils'

const POR_PAGINA = 10

export default function FilaPedidos() {
  const navegar = useNavigate()
  const [parametros, setParametros] = useSearchParams()

  // Filtros atuais lidos da URL (?status=&uf=&q=&pagina=)
  const valores: ValoresFiltros = {
    status: parametros.get('status') ?? '',
    uf: parametros.get('uf') ?? '',
    q: parametros.get('q') ?? '',
  }
  const pagina = Math.max(1, Number(parametros.get('pagina')) || 1)
  const temFiltro = Boolean(valores.status || valores.uf || valores.q)
  // Página além da última (ex.: link antigo) também não é "fila vazia"
  const vazioPorConsulta = temFiltro || pagina > 1

  const { data, isLoading, isError, error } = usePedidos({
    ...valores,
    pagina,
    por_pagina: POR_PAGINA,
  })

  // Grava filtros na URL; mudar um filtro volta para a página 1
  const mudarFiltros = useCallback(
    (novos: Partial<ValoresFiltros>) => {
      setParametros((atuais) => {
        const proximos = new URLSearchParams(atuais)
        for (const [chave, valor] of Object.entries(novos)) {
          if (valor) proximos.set(chave, valor)
          else proximos.delete(chave)
        }
        proximos.delete('pagina')
        return proximos
      })
    },
    [setParametros],
  )

  function mudarPagina(novaPagina: number) {
    setParametros((atuais) => {
      const proximos = new URLSearchParams(atuais)
      proximos.set('pagina', String(novaPagina))
      return proximos
    })
  }
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
        <CardHeader className="space-y-4">
          <div className="space-y-1.5">
            <CardTitle>Pedidos</CardTitle>
            {data && (
              <CardDescription>
                {data.total} pedido(s) encontrado(s), do mais recente para o mais antigo.
              </CardDescription>
            )}
          </div>
          <FiltrosFila valores={valores} aoMudar={mudarFiltros} />
        </CardHeader>
        <CardContent>
          {isLoading && <Carregando />}

          {isError && (
            <EstadoVazio icone={AlertTriangle} titulo="Não foi possível carregar a fila" descricao={error.message} />
          )}

          {/* Vazio por causa dos filtros é diferente de fila vazia */}
          {data && data.pedidos.length === 0 && vazioPorConsulta && (
            <EstadoVazio
              icone={SearchX}
              titulo="Nenhum pedido encontrado"
              descricao="Ajuste a busca, limpe os filtros ou volte para a primeira página."
            />
          )}

          {data && data.pedidos.length === 0 && !vazioPorConsulta && (
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
                  <TableHead className="hidden sm:table-cell">Cliente</TableHead>
                  <TableHead>Destino</TableHead>
                  {/* Colunas secundárias somem em telas estreitas para a tabela caber no celular */}
                  <TableHead className="hidden text-right md:table-cell">Itens</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">Peso cobrado</TableHead>
                  <TableHead className="hidden lg:table-cell">Entrega prometida</TableHead>
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
                    <TableCell className="font-medium whitespace-normal">
                      {/* Link real para acessibilidade (teclado e leitor de tela) */}
                      <a
                        href={`/pedidos/${pedido.id}`}
                        onClick={(evento) => {
                          evento.preventDefault()
                          evento.stopPropagation() // evita que o clique da linha navegue de novo
                          navegar(`/pedidos/${pedido.id}`)
                        }}
                        className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        #{pedido.id_externo}
                      </a>
                      <span className="block text-xs font-normal text-muted-foreground sm:hidden">{pedido.cliente_nome}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{pedido.cliente_nome}</TableCell>
                    {/* Destino pode quebrar linha, para o status caber em telas estreitas */}
                    <TableCell className="whitespace-normal">
                      {pedido.cidade}/{pedido.uf}
                      <span className="block text-xs text-muted-foreground">
                        {formatarDistancia(pedido.distancia_km)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-right md:table-cell">{pedido.quantidade_itens}</TableCell>
                    <TableCell className="hidden text-right sm:table-cell">{formatarPeso(pedido.peso_cobrado)}</TableCell>
                    <TableCell className={cn('hidden lg:table-cell', pedido.atrasado && 'font-medium text-red-700')}>
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

          {data && <Paginacao pagina={data.pagina} totalPaginas={data.total_paginas} aoMudar={mudarPagina} />}
        </CardContent>
      </Card>
    </div>
  )
}
