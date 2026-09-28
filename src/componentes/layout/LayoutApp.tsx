// LayoutApp: estrutura comum a todas as páginas — navegação no topo e conteúdo abaixo.
// O conteúdo da rota atual é renderizado no <Outlet /> do react-router.
import { Outlet } from 'react-router-dom'

import Navegacao from './Navegacao'

export default function LayoutApp() {
  return (
    <div className="min-h-svh bg-muted/30">
      <Navegacao />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
