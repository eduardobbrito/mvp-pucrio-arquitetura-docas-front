// TabelaItens: produtos do pedido com quantidade, preço, peso e dimensões.
// Dados: campo `itens` do detalhe do pedido (vindos da DummyJSON na importação).
import type { ItemPedido } from '@/api/tipos'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'
import { formatarMoeda, formatarPeso } from '@/lib/formatadores'

interface PropriedadesTabelaItens {
  itens: ItemPedido[]
}

export default function TabelaItens({ itens }: PropriedadesTabelaItens) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead className="text-right">Qtd.</TableHead>
          <TableHead className="text-right">Preço unit.</TableHead>
          <TableHead className="text-right">Peso unit.</TableHead>
          <TableHead className="text-right">Dimensões (cm)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itens.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.titulo}
              {item.sku && <span className="block text-xs text-muted-foreground">SKU {item.sku}</span>}
            </TableCell>
            <TableCell className="text-right">{item.quantidade}</TableCell>
            <TableCell className="text-right">{formatarMoeda(item.preco_unitario)}</TableCell>
            <TableCell className="text-right">{formatarPeso(item.peso)}</TableCell>
            {/* Largura × altura × profundidade, base do peso cubado */}
            <TableCell className="text-right whitespace-nowrap">
              {item.largura} × {item.altura} × {item.profundidade}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
