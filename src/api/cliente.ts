// Cliente HTTP da API Docas.
//
// Centraliza a URL base (VITE_API_URL, lida do .env no build), os cabeçalhos
// JSON e o tratamento de erro. Toda resposta de erro da API tem o formato
// { mensagem }, que vira um ErroApi com essa mensagem para exibir no toast.

const URL_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/** Erro lançado quando a API responde com status fora de 2xx ou está inacessível. */
export class ErroApi extends Error {
  status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

/** Faz a requisição, converte o JSON e transforma respostas de erro em ErroApi. */
async function requisitar<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: corpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    // Falha de rede: API fora do ar, URL errada ou CORS bloqueado
    throw new ErroApi('Não foi possível conectar à API Docas. Verifique se ela está rodando.', 0)
  }

  const dados = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    const mensagem = dados?.mensagem ?? `Erro ${resposta.status} ao chamar a API`
    throw new ErroApi(mensagem, resposta.status)
  }
  return dados as T
}

/** Monta a query string ignorando parâmetros vazios. */
export function montarQuery(parametros: Record<string, string | number | undefined>): string {
  const busca = new URLSearchParams()
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== '') busca.set(chave, String(valor))
  }
  const texto = busca.toString()
  return texto ? `?${texto}` : ''
}

/** GET: busca dados. */
export const obter = <T>(caminho: string) => requisitar<T>('GET', caminho)

/** POST: cria ou dispara uma ação. */
export const enviar = <T>(caminho: string, corpo?: unknown) => requisitar<T>('POST', caminho, corpo)

/** PUT: atualiza um recurso. */
export const atualizar = <T>(caminho: string, corpo?: unknown) => requisitar<T>('PUT', caminho, corpo)

/** DELETE: remove (ou, no caso de pedidos, cancela) um recurso. */
export const remover = <T>(caminho: string) => requisitar<T>('DELETE', caminho)
