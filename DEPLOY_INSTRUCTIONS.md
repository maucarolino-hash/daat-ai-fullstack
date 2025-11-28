# 🚀 Guia de Deploy Gratuito - Daat AI

Este guia vai te ensinar a colocar o **Daat AI** online usando serviços gratuitos: **Vercel** (Frontend) e **Render** (Backend).

---

## ✅ Pré-requisitos
1.  Conta no [GitHub](https://github.com/).
2.  Conta na [Vercel](https://vercel.com/) (Login com GitHub).
3.  Conta no [Render](https://render.com/) (Login com GitHub).
4.  O código do projeto deve estar no seu GitHub.

---

## 📦 Passo 1: GitHub
Se ainda não fez, suba este projeto para um repositório no GitHub.
```bash
git add .
git commit -m "Preparando para deploy"
git push origin main
```

---

## ⚙️ Passo 2: Backend (Render)
O Backend (Django) vai rodar no Render.

1.  Acesse o [Dashboard do Render](https://dashboard.render.com/).
2.  Clique em **New +** -> **Web Service**.
3.  Conecte seu repositório do GitHub.
4.  Preencha os campos:
    *   **Name**: `daat-backend` (ou o que preferir)
    *   **Root Directory**: `daat_backend` ⚠️ (Muito importante!)
    *   **Runtime**: `Python 3`
    *   **Build Command**: `./build.sh`
    *   **Start Command**: `gunicorn daat_backend.wsgi:application`
    *   **Plan**: Free

5.  **Environment Variables** (Variáveis de Ambiente):
    Adicione as seguintes chaves:
    *   `PYTHON_VERSION`: `3.9.0`
    *   `OPENAI_API_KEY`: `sk-...` (Sua chave da OpenAI)
    *   `DJANGO_SECRET_KEY`: (Invente uma senha longa e segura)
    *   `DEBUG`: `False`
    *   `ALLOWED_HOSTS`: `*` (Ou a URL que o Render gerar, ex: `daat-backend.onrender.com`)

6.  Clique em **Create Web Service**.
    *   Aguarde o deploy finalizar. Pode demorar uns minutos.
    *   Copie a URL gerada (ex: `https://daat-backend.onrender.com`). Você vai precisar dela no próximo passo.

---

## 🎨 Passo 3: Frontend (Vercel)
O Frontend (React) vai rodar na Vercel.

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **Add New...** -> **Project**.
3.  Importe o mesmo repositório do GitHub.
4.  Configure o projeto:
    *   **Framework Preset**: Vite (Deve detectar automático)
    *   **Root Directory**: Clique em `Edit` e selecione a pasta `daat`. ⚠️
5.  **Environment Variables**:
    *   Nome: `VITE_API_URL`
    *   Valor: A URL do seu Backend no Render (ex: `https://daat-backend.onrender.com`) **SEM A BARRA NO FINAL**.
6.  Clique em **Deploy**.

---

## 🎉 Passo 4: Testar
1.  Acesse a URL que a Vercel gerou (ex: `https://daat-frontend.vercel.app`).
2.  Tente fazer uma análise.
3.  Se der erro, verifique:
    *   Se o Backend no Render está com status "Live".
    *   Se a variável `VITE_API_URL` na Vercel está correta (sem barra no final).
    *   Se a chave da OpenAI no Render está válida.

---

### 💡 Observação sobre o Banco de Dados
No plano gratuito do Render, estamos usando SQLite. Isso significa que **se o servidor reiniciar, o histórico de diagnósticos será apagado**.
Para um banco de dados persistente, você precisaria configurar um PostgreSQL (o Render oferece um gratuito por 90 dias ou você pode usar o Neon.tech). Mas para demonstração, o SQLite funciona perfeitamente!
