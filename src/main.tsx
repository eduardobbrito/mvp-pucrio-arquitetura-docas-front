// Ponto de entrada: monta os provedores globais (cache de dados e roteador) e a aplicação.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Toaster } from '@/componentes/ui/sonner'

import App from './App.tsx'
import './index.css'

// Cliente do TanStack Query: guarda em cache as respostas da API.
// staleTime de 10 s evita refazer a mesma busca a cada troca de tela.
const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10_000, retry: 1, refetchOnWindowFocus: false },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={clienteConsultas}>
      <BrowserRouter>
        <App />
        {/* Toasts de sucesso e erro das ações (sonner) */}
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
