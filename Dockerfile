# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --include=dev

# Copiar código fonte
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar config do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
