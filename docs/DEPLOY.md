# Deploy de produção — Hetzner + Coolify

Este projeto roda em um VPS Hetzner na Alemanha, gerenciado pelo Coolify, com AdonisJS, PostgreSQL e volumes persistentes. O Coolify assume o proxy reverso e a emissão/renovação do HTTPS.

## Configuração recomendada

- VPS Hetzner em Falkenstein ou Nuremberg, com IPv4 e IPv6 públicos.
- Coolify instalado no Ubuntu LTS.
- Serviço da aplicação conectado ao repositório GitHub.
- PostgreSQL persistente no Coolify.
- Volume persistente montado em `/app/build/public/uploads`.

No Coolify, configure o domínio da aplicação como `https://joaoboiadeiro.org.br`. O deploy automático deve ficar habilitado para a branch de produção.

No DNS, use um registro `A` para o IPv4 e um registro `AAAA` para o IPv6 do VPS. O Coolify emitirá o certificado TLS depois que o domínio estiver apontando para o servidor.

## 1. Preparar o servidor (instalação manual alternativa)

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
APP_URL=https://joaoboiadeiro.org.br
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

## HTTPS no Coolify

Quando a aplicação for criada pelo Coolify, informe o domínio com `https://`. O proxy integrado gerencia o certificado e redireciona HTTP para HTTPS. O Nginx incluído no `docker-compose.prod.yml` serve apenas para uma instalação manual fora do Coolify.

## Deploy automático pelo GitHub

1. No Coolify, conecte o GitHub App ao repositório.
2. Crie uma aplicação a partir do `Dockerfile`.
3. Selecione a branch de produção e ative o auto deploy.
4. Configure as variáveis do `.env.production` no painel do Coolify.
5. Adicione o volume `/app/build/public/uploads`.
6. Configure o health check como `/health` na porta `3333`.

Cada push na branch configurada cria uma nova imagem, executa o health check e substitui a versão anterior conforme a política de deploy do Coolify.

Nunca versione `.env.production`.
