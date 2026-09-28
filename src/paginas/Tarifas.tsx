// Tarifas: tabela de frete editável (criar, editar, remover) e modalidades.
// Dados: GET /tarifas e GET /modalidades; mutações POST/PUT/DELETE /tarifas pelos hooks de api/tarifas.
import { AlertTriangle, Info, Pencil, Plus } from 'lucide-react'

import { useTarifas } from '@/api/tarifas'
import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import BotaoRemoverTarifa from '@/componentes/tarifas/BotaoRemoverTarifa'
import DialogoTarifa from '@/componentes/tarifas/DialogoTarifa'
import TabelaModalidades from '@/componentes/tarifas/TabelaModalidades'
import { Button } from '@/componentes/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/componentes/ui/tabs'
import { formatarDistancia, formatarMoeda, formatarPeso, formatarPrazo } from '@/lib/formatadores'

// A última faixa de distância da tabela (99999 km) significa "qualquer distância"
const DISTANCIA_ILIMITADA = 99999

export default function Tarifas() {
  const { data, isLoading, isError, error } = useTarifas()

  const botaoNova = (
    <DialogoTarifa
      gatilho={
        <Button>
          <Plus /> Nova tarifa
        </Button>
      }
    />
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tarifas</h1>
          <p className="text-sm text-muted-foreground">Tabela de frete por faixa de peso e distância.</p>
        </div>
        {botaoNova}
      </div>

      <p className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Valores ilustrativos e configuráveis: não correspondem a nenhuma transportadora real. Alterações valem
        para as próximas cotações.
      </p>

      <Tabs defaultValue="tarifas">
        <TabsList>
          <TabsTrigger value="tarifas">Tabela de tarifas</TabsTrigger>
          <TabsTrigger value="modalidades">Modalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="tarifas">
          <Card>
            <CardHeader>
              <CardTitle>Faixas</CardTitle>
              <CardDescription>
                Cada linha vale até o peso e a distância indicados. Valor e prazo são os da modalidade Padrão; acima da maior faixa de peso, o valor é proporcional ao peso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <Carregando />}
              {isError && (
                <EstadoVazio icone={AlertTriangle} titulo="Falha ao carregar as tarifas" descricao={error.message} />
              )}
              {data && data.tarifas.length === 0 && (
                <EstadoVazio titulo="Nenhuma tarifa cadastrada" descricao="Sem tarifas, não é possível cotar." acao={botaoNova} />
              )}
              {data && data.tarifas.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Peso</TableHead>
                      <TableHead>Distância</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      {/* No celular o prazo aparece embaixo do valor, para a tabela caber na tela */}
                      <TableHead className="hidden text-right sm:table-cell">Prazo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.tarifas.map((tarifa) => (
                      <TableRow key={tarifa.id}>
                        <TableCell>{formatarPeso(tarifa.peso_max_kg)}</TableCell>
                        <TableCell className="whitespace-normal">
                          {tarifa.distancia_max_km >= DISTANCIA_ILIMITADA
                            ? 'Qualquer distância'
                            : formatarDistancia(tarifa.distancia_max_km)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatarMoeda(tarifa.valor)}
                          <span className="block text-xs font-normal text-muted-foreground sm:hidden">
                            {formatarPrazo(tarifa.prazo_dias_uteis)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden text-right sm:table-cell">{formatarPrazo(tarifa.prazo_dias_uteis)}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <DialogoTarifa
                            tarifa={tarifa}
                            gatilho={
                              <Button variant="ghost" size="icon-sm" aria-label="Editar tarifa">
                                <Pencil />
                              </Button>
                            }
                          />
                          <BotaoRemoverTarifa tarifa={tarifa} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modalidades">
          <Card>
            <CardHeader>
              <CardTitle>Modalidades</CardTitle>
              <CardDescription>Cada cotação gera uma opção por modalidade ativa.</CardDescription>
            </CardHeader>
            <CardContent>
              <TabelaModalidades />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
