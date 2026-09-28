// CartaoMetrica: cartão com um indicador do painel (título, valor em destaque,
// ícone e texto de apoio). Recebe os valores já calculados pela página Painel.
import type { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card'
import { cn } from '@/lib/utils'

interface PropriedadesCartaoMetrica {
  titulo: string
  valor: string
  descricao: string
  icone: LucideIcon
  alerta?: boolean // destaca em vermelho (ex.: há pedidos atrasados)
}

export default function CartaoMetrica({ titulo, valor, descricao, icone: Icone, alerta = false }: PropriedadesCartaoMetrica) {
  return (
    <Card className={cn(alerta && 'border-red-300 bg-red-50')}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>
        <Icone className={cn('size-4 text-muted-foreground', alerta && 'text-red-600')} aria-hidden />
      </CardHeader>
      <CardContent>
        <p className={cn('text-3xl font-semibold', alerta && 'text-red-700')}>{valor}</p>
        <p className="text-xs text-muted-foreground">{descricao}</p>
      </CardContent>
    </Card>
  )
}
