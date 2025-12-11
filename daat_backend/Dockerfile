FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libpq-dev netcat-openbsd

# Instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn psycopg2-binary

COPY . .

# Coletar estáticos
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "daat_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
