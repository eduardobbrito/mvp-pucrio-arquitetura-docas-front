// Roteador da aplicação: associa cada URL a uma página, todas dentro do LayoutApp.
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Carregando from '@/componentes/comuns/Carregando'
import EstadoVazio from '@/componentes/comuns/EstadoVazio'
import LayoutApp from '@/componentes/layout/LayoutApp'
import DetalhePedido from '@/paginas/DetalhePedido'
import FilaPedidos from '@/paginas/FilaPedidos'
import Tarifas from '@/paginas/Tarifas'

// O Painel usa a biblioteca de gráficos (recharts), que é grande; carregá-lo sob
// demanda deixa a abertura da fila mais rápida.
const Painel = lazy(() => import('@/paginas/Painel'))

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutApp />}>
        <Route path="/" element={<FilaPedidos />} />
        <Route path="/pedidos/:id" element={<DetalhePedido />} />
        <Route path="/tarifas" element={<Tarifas />} />
        <Route
          path="/painel"
          element={
            <Suspense fallback={<Carregando linhas={6} />}>
              <Painel />
            </Suspense>
          }
        />
        {/* Qualquer outra URL: aviso dentro do layout, com a navegação disponível */}
        <Route path="*" element={<EstadoVazio titulo="Página não encontrada" descricao="Use a navegação acima para voltar." />} />
      </Route>
    </Routes>
  )
}
