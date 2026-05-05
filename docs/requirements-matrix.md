# Matriz de Requisitos

## Requisitos funcionais e critérios

| Item | Cobertura |
| --- | --- |
| US01 Cadastro | `apps/api/src/routes/auth.js`, `apps/api/src/services/authService.js`, `apps/mobile/App.js` |
| US02 Login | `apps/api/src/routes/auth.js`, `apps/api/src/services/authService.js`, `apps/mobile/App.js`, `apps/admin/components/AdminConsole.jsx` |
| US03 Visualizar cursos | `packages/shared/src/content.js`, `apps/api/src/services/courseService.js`, `apps/mobile/App.js` |
| US04 Iniciar curso | `apps/api/src/services/courseService.js:startCourse`, `apps/mobile/App.js:handleStartCourse` |
| US05 Visualizar trilha | `packages/shared/src/domain.js:buildTrack`, `apps/mobile/App.js` |
| US06 Desbloqueio progressivo | `packages/shared/src/domain.js:isLessonUnlocked`, `apps/api/src/services/courseService.js:getLesson` |
| US07 Iniciar lição | `apps/api/src/services/courseService.js:getLesson`, `apps/mobile/App.js` |
| US08 Responder exercício | `apps/mobile/App.js:ExerciseCard` |
| US09 Feedback imediato | `packages/shared/src/domain.js:evaluateLessonSubmission`, `apps/mobile/App.js` |
| US10 Concluir lição | `apps/api/src/services/courseService.js:submitLesson`, `packages/shared/src/domain.js:mergeLessonProgress` |
| US11 Ganhar XP | `packages/shared/src/domain.js:evaluateLessonSubmission`, `mergeLessonProgress` |
| US12 Sistema de níveis | `packages/shared/src/domain.js:calculateLevel`, `apps/mobile/App.js` |
| US13 Streak diário | `packages/shared/src/domain.js:updateStreak`, `apps/mobile/App.js` |
| US14 Conquistas | `packages/shared/src/content.js:ACHIEVEMENTS`, `packages/shared/src/domain.js:mergeLessonProgress` |
| US15 Visualizar progresso | `packages/shared/src/domain.js:calculateCourseProgress`, `calculateModuleProgress`, `apps/mobile/App.js` |
| US16 Histórico de lições | `apps/api/src/services/courseService.js:getHistory`, `apps/mobile/App.js` |
| US17 Identificar erros | `packages/shared/src/domain.js:mergeLessonProgress`, `buildReviewSuggestions` |
| US18 Sugerir revisão | `apps/api/src/services/courseService.js:getReview`, `apps/mobile/App.js` |
| US19 Exercícios de revisão | `packages/shared/src/domain.js:buildAdaptiveReviewSession`, `apps/api/src/services/courseService.js:createReviewSession` |
| US20 Criar curso | `apps/api/src/routes/admin.js`, `apps/api/src/services/adminService.js:createCourse`, `apps/admin/components/AdminConsole.jsx` |
| US21 Criar módulo | `apps/api/src/services/adminService.js:createModule`, `apps/admin/components/AdminConsole.jsx` |
| US22 Criar lição | `apps/api/src/services/adminService.js:createLesson`, `apps/admin/components/AdminConsole.jsx` |
| US23 Criar exercício | `apps/api/src/services/adminService.js:createExercise`, `apps/admin/components/AdminConsole.jsx` |
| US24 Lembrete diário | `apps/mobile/App.js:scheduleReminder`, `apps/api/src/services/courseService.js:updateNotificationSettings` |
| US25 Configurar notificações | `apps/mobile/App.js`, `apps/api/src/routes/student.js` |

## Funcionalidades complementares do escopo

| Item | Cobertura |
| --- | --- |
| Recuperação de senha | `apps/api/src/routes/auth.js`, `apps/api/src/services/authService.js:createRecoveryRequest`, `resetPassword`, `apps/mobile/App.js` |
| Edição de perfil | `apps/api/src/services/authService.js:updateProfile`, `apps/mobile/App.js` |
| Ranking opcional com opt-in | `apps/api/src/services/courseService.js:getRanking`, `apps/mobile/App.js`, `apps/api/src/services/authService.js:updateProfile` |
| Relatórios de uso/KPIs | `packages/shared/src/domain.js:buildUsageReport`, `apps/api/src/services/reportService.js`, `apps/admin/components/AdminConsole.jsx` |

## Regras de negócio

| Regra | Cobertura |
| --- | --- |
| RN01 Cursos simultâneos | progresso separado por `courseId` em `apps/api/data/db.json` e `createInitialCourseProgress` |
| RN02 Progresso independente | `apps/api/src/services/courseService.js`, coleção `progress` |
| RN03 Conclusão de lição com mínimo | `packages/shared/src/domain.js:evaluateLessonSubmission` |
| RN04 Desbloqueio progressivo | `packages/shared/src/domain.js:isLessonUnlocked` |
| RN05 Regra de streak | `packages/shared/src/domain.js:updateStreak` |
| RN06 Cálculo de XP | `packages/shared/src/domain.js:evaluateLessonSubmission` e `mergeLessonProgress` |
| RN07 Revisão baseada em erro | `buildReviewSuggestions`, `buildAdaptiveReviewSession` |
| RN08 Ranking opcional | endpoint `/ranking`, campo `rankingOptIn` e seção `Ranking opcional` no mobile |
| RN09 Evolução de conteúdo sem apagar progresso | progresso persistido separado do catálogo e arquivamento em `apps/api/src/services/adminService.js` |

## Requisitos não funcionais

| Requisito | Cobertura |
| --- | --- |
| RNF01 Performance | regras em memória no pacote compartilhado e payloads objetivos |
| RNF02 Responsividade | `apps/mobile` para mobile e `apps/admin/app/globals.css` para web responsiva |
| RNF03 Segurança | JWT em `apps/api/src/utils/security.js`, middlewares em `apps/api/src/middleware.js` |
| RNF04 Escalabilidade | monorepo com separação `mobile/admin/api/shared` |
| RNF05 Disponibilidade | serviços desacoplados e endpoint `/health` |
| RNF06 Modularidade | catálogo extensível em `packages/shared/src/content.js` e `apps/api/src/services/adminService.js` |
| RNF07 Acessibilidade | textos legíveis, contraste e controles simples nas UIs |
| RNF08 Manutenibilidade | divisão por rotas, serviços e domínio compartilhado |

## Observações de uso

- Login administrativo inicial:
  - email: `admin@duotech.com`
  - senha: `admin123`
- Cursos iniciais entregues:
  - Expo
  - AWS Nuvem
- Tipos de exercício cobertos:
  - múltipla escolha
  - verdadeiro/falso
  - associação
  - completar código
  - ordenar passos
