// GraficoFreteRegiao: gráfico de barras com o frete médio contratado em cada região.
// Dados: campo `frete_medio_por_regiao` de GET /painel (recebido por props).
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import type { Painel } from '@/api/tipos'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/componentes/ui/chart'
import { formatarMoeda } from '@/lib/formatadores'

// Nome e cor da série: o azul de destaque, o mesmo dos status contratado e em trânsito
const configuracao = {
  frete_medio: { label: 'Frete médio', color: 'var(--color-blue-600)' },
} satisfies ChartConfig

interface PropriedadesGrafico {
  dados: Painel['frete_medio_por_regiao']
}

export default function GraficoFreteRegiao({ dados }: PropriedadesGrafico) {
  return (
    <ChartContainer config={configuracao} className="aspect-auto h-72 w-full">
      <BarChart data={dados} margin={{ top: 24, left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="regiao" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={(valor: number) => `R$ ${valor}`} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(valor, _nome, item) => (
                <span>
                  {formatarMoeda(Number(valor))} · {item.payload.quantidade} pedido(s)
                </span>
              )}
            />
          }
        />
        <Bar dataKey="frete_medio" fill="var(--color-frete_medio)" radius={6}>
          {/* Valor em cima de cada barra; regiões sem pedidos ficam sem rótulo */}
          <LabelList
            dataKey="frete_medio"
            position="top"
            className="fill-foreground text-xs"
            formatter={(valor: unknown) => (Number(valor) > 0 ? formatarMoeda(Number(valor)) : '')}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
