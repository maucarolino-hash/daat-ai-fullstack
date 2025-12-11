#!/bin/bash

# ==========================================
# Script de Ajuda para Deploy no Hostinger VPS
# ==========================================

# 1. Defina o IP do seu servidor
VPS_IP="92.113.39.141"
USER="root"

echo "--- Iniciando Preparação para Deploy ---"

# 2. Comando para copiar os arquivos para o servidor (via SCP)
echo "Copiando arquivos de configuração para o servidor..."
scp daat_backend/Dockerfile $USER@$VPS_IP:~/daat_app/daat_backend/Dockerfile
scp docker-compose.yml $USER@$VPS_IP:~/daat_app/docker-compose.yml

# 3. Instruções para o usuário rodar NO SERVIDOR
echo ""
echo "--- AGORA FACAA O SEGUINTE ---"
echo "1. Abra seu terminal e conecte-se ao servidor:"
echo "   ssh $USER@$VPS_IP"
echo ""
echo "2. No servidor, clone seu repositório (se ainda não fez):"
echo "   git clone https://github.com/SEU_GITHUB_USER/SEU_REPO.git daat_app"
echo "   cd daat_app"
echo ""
echo "3. Crie o arquivo de variáveis de ambiente (.env):"
echo "   nano daat_backend/.env"
echo "   (Cole suas chaves API aqui: OPENAI_API_KEY, TAVILY_API_KEY, etc)"
echo ""
echo "4. Rode o Deploy com Docker:"
echo "   docker-compose up -d --build"
echo ""
echo "5. Crie o superusuário e rode migrações:"
echo "   docker-compose exec backend python manage.py migrate"
echo "   docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "Pronto! Seu site estará rodando em http://$VPS_IP"
