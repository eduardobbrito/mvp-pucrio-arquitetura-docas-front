// Navegacao: barra superior com o nome do sistema e os links das páginas.
import { Anchor } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

import { cn } from '@/lib/utils'

// Links exibidos na barra; `ativoEm` lista os prefixos de URL que também ativam o link
const LINKS = [
  { para: '/', rotulo: 'Fila', ativoEm: ['/pedidos/'] },
  { para: '/tarifas', rotulo: 'Tarifas', ativoEm: [] },
  { para: '/painel', rotulo: 'Painel', ativoEm: [] },
]

export default function Navegacao() {
  const { pathname } = useLocation()
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <Anchor className="size-5 text-primary" aria-hidden />
          Docas
        </NavLink>
        <nav className="flex items-center gap-1" aria-label="Navegação principal">
          {LINKS.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end
              // A fila também fica ativa no detalhe do pedido (/pedidos/:id)
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  (isActive || link.ativoEm.some((prefixo) => pathname.startsWith(prefixo))) &&
                    'bg-muted text-foreground',
                )
              }
            >
              {link.rotulo}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
