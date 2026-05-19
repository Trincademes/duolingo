# AWS

Este projeto pode usar DynamoDB para persistir usuarios, progresso e ranking.

## 1. Criar a tabela

Com AWS CLI configurado:

```bash
aws cloudformation deploy \
  --stack-name duotech-storage \
  --template-file infra/aws/dynamodb.yml \
  --parameter-overrides TableName=duotech-app-state
```

## 2. Configurar a API

Arquivo `apps/api/.env`:

```env
PORT=3333
JWT_SECRET=troque-este-segredo
STORE_DRIVER=dynamodb
AWS_REGION=us-east-1
AWS_DYNAMODB_TABLE=duotech-app-state
AWS_DYNAMODB_KEY=default
```

Ao iniciar com `STORE_DRIVER=dynamodb`, a API le e grava o estado no DynamoDB. Se a tabela ainda nao tiver dados, a API cria o primeiro item usando `apps/api/data/db.json` como seed.

## 3. Configurar o mobile

Arquivo `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_OU_DOMINIO:3333
```

Em celular fisico, use o IP da maquina que esta rodando a API. Em deploy real, use a URL publica da API.

## 4. Ranking

O ranking vem da rota `GET /ranking` e usa apenas usuarios com `rankingOptIn=true`. O app mobile sincroniza XP, nivel e streak com `PUT /me/stats` ao concluir uma licao.
