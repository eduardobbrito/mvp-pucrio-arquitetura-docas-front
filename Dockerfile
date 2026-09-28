# Interface Docas — build multi-stage

# Etapa 1: compila a aplicação React com Node
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências primeiro para aproveitar o cache de camadas
COPY package.json package-lock.json ./
RUN npm ci

# URL da API embutida no build pelo Vite (variável VITE_API_URL)
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Etapa 2: serve apenas os arquivos estáticos com nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
