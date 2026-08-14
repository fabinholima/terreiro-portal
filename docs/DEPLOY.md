# Deploy de produção

Este projeto possui uma stack de produção com AdonisJS, PostgreSQL e Nginx.

## 1. Preparar o servidor

Instale Docker Engine e Docker Compose Plugin. Clone o repositório e entre na pasta do projeto.

## 2. Criar o ambiente de produção

```bash
cp .env.production.example .env.production
```

Edite `.env.production` e defina valores fortes para `APP_KEY` e `DB_PASSWORD`.

Para gerar uma APP_KEY aleatória:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Mantenha:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
APP_URL=https://www.terreirojoaoboiadeiro.org.br
DB_HOST=db
```

## 3. Build

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml build
```

## 4. Subir apenas o PostgreSQL

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d db
```

Aguarde o banco ficar healthy:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

## 5. Executar migrations

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm app node ace.js migration:run --force
```

## 6. Subir aplicação e Nginx

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## 7. Verificações

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl http://127.0.0.1/health
```

O endpoint deve responder com `status: ok` e `database: ok`.

## Volumes persistentes

- `postgres_data`: banco PostgreSQL.
- `uploads_data`: imagens da galeria, imagens de notícias e documentos PDF.

Não use `docker compose down -v` em produção, pois `-v` remove os volumes persistentes.

## Atualização do sistema

```bash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml build app
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm app node ace.js migration:run --force
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## HTTPS

O Nginx incluído escuta HTTP na porta 80. Para produção pública, coloque TLS na frente dele usando Certbot/Nginx, Caddy ou um proxy gerenciado. O DNS de `terreirojoaoboiadeiro.org.br` e `www.terreirojoaoboiadeiro.org.br` deve apontar para o servidor antes da emissão do certificado.

Nunca versione `.env.production`.
