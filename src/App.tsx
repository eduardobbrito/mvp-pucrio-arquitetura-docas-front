// Roteador da aplicação: associa cada URL a uma página, todas dentro do LayoutApp.
// Tarifas (/tarifas) e Painel (/painel) são próximas etapas e ainda não têm rota.
import { Route, Routes } from 'react-router-dom'

import LayoutApp from '@/componentes/layout/LayoutApp'
import DetalhePedido from '@/paginas/DetalhePedido'
import FilaPedidos from '@/paginas/FilaPedidos'

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutApp />}>
        <Route path="/" element={<FilaPedidos />} />
        <Route path="/pedidos/:id" element={<DetalhePedido />} />
      </Route>
    </Routes>
  )
}
