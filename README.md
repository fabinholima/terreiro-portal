# Terreiro de Umbanda Oxóssi e João Boiadeiro — Portal

Portal institucional em AdonisJS 7.

## Stack

- AdonisJS 7
- Edge
- Lucid ORM
- PostgreSQL
- VineJS
- Alpine.js
- Docker Compose para desenvolvimento do banco

## Módulos implementados

### Agenda
- CRUD administrativo
- data e horário
- local
- categoria
- status
- visibilidade pública

### Galeria
- álbuns
- upload múltiplo de fotos
- legenda e texto alternativo
- créditos
- ordenação
- autorização individual de publicação
- página pública `/galeria`

### Ações sociais
- CRUD administrativo
- título, descrição e slug
- status: planejada, ativa, concluída, permanente ou cancelada
- meta e resultado atual
- unidade de medida
- cálculo de progresso percentual
- período de início e fim
- controle de publicação
- página pública `/acoes-sociais`

## Desenvolvimento

```bash
npm install
cp .env.example .env
docker compose up -d db
node ace migration:run
npm run typecheck
npm run dev
```

Site: `http://localhost:3333`
