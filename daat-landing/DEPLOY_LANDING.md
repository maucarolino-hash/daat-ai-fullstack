# Como Publicar a Landing Page (Daat AI)

A maneira mais fácil de publicar sua Landing Page é usando a **Vercel**, a mesma plataforma que você usa para o App principal.

## Opção 1: Via Terminal (Recomendado)

1.  Abra um novo terminal na pasta `daat-landing`:
    ```bash
    cd daat-landing
    ```

2.  Execute o comando de deploy:
    ```bash
    npx vercel
    ```

3.  Responda às perguntas do assistente:
    *   **Set up and deploy?** [y]
    *   **Which scope?** [Selecione sua conta]
    *   **Link to existing project?** [n] (Não, é um projeto novo)
    *   **Project Name:** `daat-landing` (ou outro nome que preferir)
    *   **In which directory?** `./` (Apenas aperte Enter)
    *   **Want to modify these settings?** [n] (Não precisa)

4.  Aguarde o upload e a build.
5.  No final, ele vai te dar um link **Production**, algo como: `https://daat-landing.vercel.app`.

## Opção 2: Via GitHub (Automático)

1.  Certifique-se de que o código está no seu GitHub.
2.  Vá no painel da Vercel (vercel.com).
3.  Clique em **"Add New..."** -> **"Project"**.
4.  Importe o repositório do `project Daat`.
5.  **Importante:** Na configuração "Root Directory", clique em "Edit" e selecione a pasta `daat-landing`.
6.  Clique em **Deploy**.

---

## Pós-Deploy (Conectando com o App)

Depois que a Landing Page estiver no ar, você terá dois links:
1.  **Landing Page:** `https://daat-landing.vercel.app` (Vitrine)
2.  **App Principal:** `https://daat-ai-fullstack.vercel.app` (Produto)

Os botões "Login" e "Testar Agora" da Landing Page já estão configurados para levar o usuário para o App Principal.
