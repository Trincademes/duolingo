# Arquitetura

## Visão geral

O projeto foi organizado como monorepo para separar claramente as três frentes pedidas no enunciado:

- `apps/mobile`: experiência do aluno em `Expo + React Native`
- `apps/admin`: painel administrativo em `Next.js`
- `apps/api`: backend em `Node.js`
- `packages/shared`: catálogo dos cursos e regras de negócio compartilhadas

## Decisões principais

### Frontend mobile

O app mobile concentra a jornada do estudante:

- cadastro, login e recuperação de senha
- escolha entre Expo e AWS
- trilha com desbloqueio progressivo
- execução de lições e exercícios
- feedback imediato
- XP, nível, streak e conquistas
- histórico, revisão e ranking opcional
- configuração de lembrete diário

### Frontend admin

O painel admin cobre:

- CRUD de cursos
- CRUD de módulos
- CRUD de lições
- CRUD de exercícios
- relatórios de uso

### Backend

A API fornece:

- autenticação com JWT
- recuperação e redefinição de senha por token
- progresso independente por curso
- avaliação de exercícios
- controle de desbloqueio
- cálculo de XP e nível
- manutenção de streak
- opt-in de ranking
- registro de erros para revisão
- geração de sessão adaptativa de revisão
- registro de sessões de estudo
- configurações de lembrete diário
- endpoints administrativos

## Persistência

Para manter o projeto simples de executar em contexto acadêmico, a persistência usa arquivo JSON em `apps/api/data/db.json`.

Mesmo assim, a modelagem já separa:

- `users`
- `progress`
- `recoveryRequests`
- `notificationsLog`
- `catalog`
- `studySessions`

Essa separação ajuda a cumprir:

- progresso independente por curso
- rastreio de lições concluídas
- histórico de desempenho
- evolução de conteúdo sem apagar progresso

## Regras de negócio incorporadas

- desbloqueio linear por lição anterior concluída
- aprovação por mínimo de acertos
- streak reiniciado quando o usuário deixa de estudar
- XP concedido com base em conclusão e desempenho
- revisão baseada em erros acumulados
- usuário pode iniciar Expo e AWS ao mesmo tempo
- conteúdo administrativo usa IDs estáveis e arquivamento para preservar histórico

## Requisitos não funcionais

- `RNF01 Performance`: regras compartilhadas e payloads enxutos
- `RNF02 Responsividade`: mobile em React Native e admin web responsivo
- `RNF03 Segurança`: autenticação JWT e proteção de rotas
- `RNF04 Escalabilidade`: separação em apps e pacote compartilhado
- `RNF05 Disponibilidade`: API desacoplada das UIs
- `RNF06 Modularidade`: catálogo extensível por curso, módulo, lição e exercício
- `RNF07 Acessibilidade`: contraste, estados visuais e fluxos simples
- `RNF08 Manutenibilidade`: separação por domínio, rotas e serviços
