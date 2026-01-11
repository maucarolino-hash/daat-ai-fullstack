# 🚀 Guia de Migração para Hostinger (VPS)

Este guia explica como hospedar o **Daat AI** (Fullstack Django + React) na Hostinger.

> **⚠️ Importante:** Para este projeto, que utiliza **Django, Celery e Redis** (para tarefas em segundo plano), a hospedagem compartilhada (Shared Hosting) **NÃO É RECOMENDADA**, pois não suporta processos de longa duração nem instalação de Redis/Docker nativamente.
>
> **Recomendação:** Utilize um plano **VPS KVM** (ex: KVM 1 ou superior) com **Ubuntu 22.04** e **Docker**.

---

## 🏗️ Passo 1: Preparar o VPS (Hostinger)

1.  **Contrate o VPS:** No painel da Hostinger, escolha um plano VPS.
2.  **Sistema Operacional:** Selecione "Application" -> **Docker on Ubuntu 22.04** (Isso economiza muito tempo).
3.  **Acesso SSH:** Anote o IP do servidor e a senha de root.
4.  Conecte-se via terminal:
    ```bash
    ssh root@92.113.39.141
    ```

---

## 🐳 Passo 2: Estrutura com Docker (Recomendado)

A maneira mais fácil e robusta de rodar tudo junto é usando **Docker Compose**.

### 1. Criar arquivo `Dockerfile` no Backend
Crie um arquivo chamado `Dockerfile` na pasta `daat_backend/`:

```dockerfile
# daat_backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y gcc libpq-dev netcat-openbsd

# Instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn psycopg2-binary

COPY . .

# Coletar estáticos
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "daat_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### 2. Criar arquivo `docker-compose.yml` na Raiz
Crie um arquivo `docker-compose.yml` na raiz do projeto (`project Daat/`):

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: daat_db
      POSTGRES_USER: daat_user
      POSTGRES_PASSWORD: super_secure_password

  redis:
    image: redis:alpine

  backend:
    build: ./daat_backend
    command: gunicorn daat_backend.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./daat_backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      DATABASE_URL: postgres://daat_user:super_secure_password@db:5432/daat_db
      CELERY_BROKER_URL: redis://redis:6379/0
      DEBUG: 'False'
      ALLOWED_HOSTS: 'SEU_IP_AQUI,seu-dominio.com'

  celery:
    build: ./daat_backend
    command: celery -A daat_backend worker -l info
    depends_on:
      - backend
      - redis
    environment:
      DATABASE_URL: postgres://daat_user:super_secure_password@db:5432/daat_db
      CELERY_BROKER_URL: redis://redis:6379/0

  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - ./package.json:/app/package.json
      - ./vite.config.ts:/app/vite.config.ts
      - ./index.html:/app/index.html
    # Para produção, o ideal é fazer o build e servir com Nginx.
    # Para simplificar aqui, vamos usar o preview do Vite ou instalar um servidor estático.
    command: sh -c "npm install && npm run build && npx serve -s dist -l 3000"
    ports:
      - "80:3000"

volumes:
  postgres_data:
```

---

## 🚀 Passo 3: Deploy no VPS

1.  **Clone seu repositório no VPS:**
    ```bash
    git clone https://github.com/maucarolino-hash/daat-ai-fullstack.git
    cd daat-ai-fullstack
    ```

2.  **Crie o arquivo .env no servidor:**
    Crie um arquivo `.env` dentro de `daat_backend/` com suas chaves de produção (OpenAI, Tavily, etc).

3.  **Suba os containers:**
    ```bash
    docker-compose up -d --build
    ```

4.  **Execute as migrações do banco:**
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

5.  **Crie o superusuário:**
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```

---

## 🌐 Passo 4: Domínio

1.  Na Hostinger, vá em **DNS Zone Editor**.
2.  Crie um registro **A** apontando `@` para o **IP do seu VPS**.
3.  Acesse seu site pelo domínio (ou pelo IP se ainda não propagou).

---

## 🛡️ Passo Extra: HTTPS (SSL)

Para ter HTTPS (o cadeado verde), recomenda-se adicionar um container **Nginx** na frente de tudo ou configurar o **Certbot** diretamente no VPS. No Docker, uma solução fácil é usar o **Nginx Proxy Manager**.
