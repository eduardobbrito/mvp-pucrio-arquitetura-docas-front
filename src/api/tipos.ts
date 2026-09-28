// Tipos das respostas e corpos da API Docas.
//
// Os tipos vêm do arquivo esquemaOpenapi.ts, gerado automaticamente a partir do
// Swagger da API (http://localhost:5000/openapi/openapi.json) com o comando
// `npm run gerar:tipos`. Não edite esquemaOpenapi.ts à mão: rode o comando de
// novo sempre que os schemas da API mudarem. Aqui só damos nomes curtos a eles.
import type { components } from './esquemaOpenapi'

type Esquemas = components['schemas']

export type Erro = Esquemas['ErroSchema']
export type PedidoResumo = Esquemas['PedidoResumoSchema']
export type PedidoDetalhe = Esquemas['PedidoDetalheSchema']
export type ListaPedidos = Esquemas['ListaPedidosSchema']
export type ItemPedido = Esquemas['ItemPedidoSchema']
export type Movimentacao = Esquemas['MovimentacaoSchema']
export type Importacao = Esquemas['ImportacaoSchema']
export type AtualizarStatus = Esquemas['AtualizarStatusSchema']
export type Cotacao = Esquemas['CotacaoSchema']
export type ListaCotacoes = Esquemas['ListaCotacoesSchema']
export type Tarifa = Esquemas['TarifaSchema']
export type TarifaEntrada = Esquemas['TarifaEntradaSchema']
export type ListaTarifas = Esquemas['ListaTarifasSchema']
export type Modalidade = Esquemas['ModalidadeSchema']
export type ListaModalidades = Esquemas['ListaModalidadesSchema']
export type Painel = Esquemas['PainelSchema']

// Status possíveis de um pedido, na ordem do fluxo
export type StatusPedido = 'recebido' | 'cotado' | 'contratado' | 'em_transito' | 'entregue' | 'cancelado'

// Filtros aceitos por GET /pedidos
export interface FiltrosPedidos {
  status?: string
  uf?: string
  q?: string
  pagina?: number
  por_pagina?: number
}
