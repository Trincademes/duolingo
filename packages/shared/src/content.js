export const COURSES = [
  {
    id: "expo",
    name: "Expo",
    description: "Aprenda a criar apps mobile com React Native e Expo em microlições práticas.",
    color: "#0f766e",
    modules: [
      {
        id: "expo-fundamentos",
        title: "Fundamentos",
        order: 1,
        lessons: [
          {
            id: "expo-hello-world",
            title: "Seu primeiro app",
            order: 1,
            minCorrectAnswers: 2,
            xpReward: 40,
            explanation: "Expo acelera o desenvolvimento mobile com configuração mínima e feedback rápido.",
            reviewTags: ["expo", "setup", "mobile-basics"],
            exercises: [
              {
                id: "expo-hello-1",
                type: "multiple_choice",
                prompt: "Qual é a principal vantagem do Expo no início do projeto?",
                options: [
                  "Evita toda a configuração nativa inicial",
                  "Substitui JavaScript por Kotlin",
                  "Impede publicar na loja",
                  "Funciona apenas no iOS"
                ],
                correctAnswer: "Evita toda a configuração nativa inicial",
                explanation: "Expo reduz o atrito inicial e permite focar no produto."
              },
              {
                id: "expo-hello-2",
                type: "true_false",
                prompt: "Expo Go permite testar rapidamente no dispositivo durante o desenvolvimento.",
                options: ["Verdadeiro", "Falso"],
                correctAnswer: "Verdadeiro",
                explanation: "Ele acelera a iteração local."
              },
              {
                id: "expo-hello-3",
                type: "order_steps",
                prompt: "Ordene o fluxo básico para iniciar um app Expo.",
                options: [
                  "Criar projeto",
                  "Executar app",
                  "Editar a tela inicial"
                ],
                correctAnswer: [
                  "Criar projeto",
                  "Editar a tela inicial",
                  "Executar app"
                ],
                explanation: "Você cria a base, ajusta a interface e então valida o resultado."
              }
            ]
          },
          {
            id: "expo-components",
            title: "Componentes essenciais",
            order: 2,
            minCorrectAnswers: 2,
            xpReward: 50,
            explanation: "Text, View, ScrollView e Pressable formam a base da composição de interfaces React Native.",
            reviewTags: ["components", "layout"],
            exercises: [
              {
                id: "expo-components-1",
                type: "matching",
                prompt: "Associe o componente ao seu papel.",
                options: [
                  { left: "View", right: "Container de layout" },
                  { left: "Text", right: "Renderizar texto" },
                  { left: "Pressable", right: "Capturar interação" }
                ],
                correctAnswer: [
                  { left: "View", right: "Container de layout" },
                  { left: "Text", right: "Renderizar texto" },
                  { left: "Pressable", right: "Capturar interação" }
                ],
                explanation: "Cada componente cobre um comportamento específico de interface."
              },
              {
                id: "expo-components-2",
                type: "fill_code",
                prompt: "Complete o JSX para exibir um texto na tela.",
                snippet: "<_____>Olá Expo</_____>",
                options: ["Text", "View", "Image", "Button"],
                correctAnswer: "Text",
                explanation: "Texto em React Native deve ser renderizado dentro de Text."
              }
            ]
          }
        ]
      },
      {
        id: "expo-navigation",
        title: "Navegação e APIs",
        order: 2,
        lessons: [
          {
            id: "expo-navigation-basics",
            title: "Fluxo entre telas",
            order: 1,
            minCorrectAnswers: 2,
            xpReward: 60,
            explanation: "Navegação cria fluxos previsíveis para onboarding, trilhas e perfil.",
            reviewTags: ["navigation", "ux"],
            exercises: [
              {
                id: "expo-navigation-1",
                type: "multiple_choice",
                prompt: "Qual cenário combina melhor com pilha de navegação?",
                options: [
                  "Entrar em uma lição e voltar para a trilha",
                  "Animar um ícone estático",
                  "Persistir dados localmente",
                  "Gerar uma imagem"
                ],
                correctAnswer: "Entrar em uma lição e voltar para a trilha",
                explanation: "Fluxos sequenciais entre telas se encaixam em stack."
              },
              {
                id: "expo-navigation-2",
                type: "true_false",
                prompt: "A navegação ajuda a manter contexto de progresso no app.",
                options: ["Verdadeiro", "Falso"],
                correctAnswer: "Verdadeiro",
                explanation: "Ela organiza o percurso do usuário."
              }
            ]
          },
          {
            id: "expo-storage-build",
            title: "Armazenamento e build",
            order: 2,
            minCorrectAnswers: 2,
            xpReward: 70,
            explanation: "Persistência local e publicação fazem parte da maturidade do app.",
            reviewTags: ["storage", "deploy"],
            exercises: [
              {
                id: "expo-storage-1",
                type: "multiple_choice",
                prompt: "Qual dado vale persistir localmente neste produto?",
                options: [
                  "Token de sessão e preferências do usuário",
                  "Senha em texto puro",
                  "Código-fonte do app",
                  "Log completo do servidor"
                ],
                correctAnswer: "Token de sessão e preferências do usuário",
                explanation: "Sessão e preferências precisam sobreviver ao fechamento do app."
              },
              {
                id: "expo-storage-2",
                type: "true_false",
                prompt: "Build e deploy fazem parte do ciclo de entrega do app.",
                options: ["Verdadeiro", "Falso"],
                correctAnswer: "Verdadeiro",
                explanation: "A publicação é a última etapa para colocar o produto nas mãos do usuário."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "aws",
    name: "AWS Nuvem",
    description: "Aprenda computação em nuvem com foco em serviços essenciais da AWS.",
    color: "#b45309",
    modules: [
      {
        id: "aws-cloud-iam",
        title: "Cloud e IAM",
        order: 1,
        lessons: [
          {
            id: "aws-cloud-basics",
            title: "Conceitos de cloud",
            order: 1,
            minCorrectAnswers: 2,
            xpReward: 40,
            explanation: "Cloud oferece elasticidade, disponibilidade e pagamento sob demanda.",
            reviewTags: ["cloud", "aws-basics"],
            exercises: [
              {
                id: "aws-cloud-1",
                type: "multiple_choice",
                prompt: "Qual benefício é típico de cloud computing?",
                options: [
                  "Escalar conforme demanda",
                  "Comprar servidor físico para cada experimento",
                  "Evitar monitoramento",
                  "Remover autenticação"
                ],
                correctAnswer: "Escalar conforme demanda",
                explanation: "Elasticidade é uma das principais vantagens da nuvem."
              },
              {
                id: "aws-cloud-2",
                type: "true_false",
                prompt: "Cloud permite reduzir o investimento inicial em infraestrutura.",
                options: ["Verdadeiro", "Falso"],
                correctAnswer: "Verdadeiro",
                explanation: "O modelo sob demanda reduz custos iniciais."
              }
            ]
          },
          {
            id: "aws-iam-basics",
            title: "IAM",
            order: 2,
            minCorrectAnswers: 2,
            xpReward: 50,
            explanation: "IAM controla quem pode acessar quais recursos e com quais permissões.",
            reviewTags: ["iam", "security"],
            exercises: [
              {
                id: "aws-iam-1",
                type: "matching",
                prompt: "Associe o item do IAM ao conceito.",
                options: [
                  { left: "User", right: "Identidade individual" },
                  { left: "Policy", right: "Conjunto de permissões" },
                  { left: "Role", right: "Permissão assumível" }
                ],
                correctAnswer: [
                  { left: "User", right: "Identidade individual" },
                  { left: "Policy", right: "Conjunto de permissões" },
                  { left: "Role", right: "Permissão assumível" }
                ],
                explanation: "Esses blocos compõem o controle de acesso na AWS."
              },
              {
                id: "aws-iam-2",
                type: "multiple_choice",
                prompt: "Qual boa prática é recomendada no IAM?",
                options: [
                  "Princípio do menor privilégio",
                  "Permitir tudo para acelerar",
                  "Compartilhar a mesma senha",
                  "Usar root em todas as tarefas"
                ],
                correctAnswer: "Princípio do menor privilégio",
                explanation: "Acesso mínimo reduz risco e impacto."
              }
            ]
          }
        ]
      },
      {
        id: "aws-services",
        title: "Serviços essenciais",
        order: 2,
        lessons: [
          {
            id: "aws-storage-compute",
            title: "S3 e EC2",
            order: 1,
            minCorrectAnswers: 2,
            xpReward: 60,
            explanation: "S3 armazena objetos; EC2 fornece computação escalável.",
            reviewTags: ["s3", "ec2"],
            exercises: [
              {
                id: "aws-services-1",
                type: "multiple_choice",
                prompt: "Qual serviço é mais adequado para armazenar arquivos estáticos?",
                options: ["S3", "EC2", "Lambda", "IAM"],
                correctAnswer: "S3",
                explanation: "S3 é o serviço de armazenamento de objetos da AWS."
              },
              {
                id: "aws-services-2",
                type: "order_steps",
                prompt: "Ordene um fluxo simples para publicar um arquivo.",
                options: [
                  "Criar bucket",
                  "Enviar objeto",
                  "Definir política de acesso"
                ],
                correctAnswer: [
                  "Criar bucket",
                  "Enviar objeto",
                  "Definir política de acesso"
                ],
                explanation: "Primeiro criamos o bucket, depois enviamos e configuramos acesso."
              }
            ]
          },
          {
            id: "aws-serverless-data",
            title: "Lambda, API Gateway e DynamoDB",
            order: 2,
            minCorrectAnswers: 2,
            xpReward: 70,
            explanation: "Lambda executa código sob demanda; API Gateway expõe endpoints; DynamoDB persiste dados em escala.",
            reviewTags: ["lambda", "api-gateway", "dynamodb"],
            exercises: [
              {
                id: "aws-serverless-1",
                type: "multiple_choice",
                prompt: "Qual combinação forma uma API serverless?",
                options: [
                  "API Gateway + Lambda + DynamoDB",
                  "S3 + IAM + CloudWatch",
                  "EC2 + FTP + root",
                  "Lambda + Photoshop + CDN"
                ],
                correctAnswer: "API Gateway + Lambda + DynamoDB",
                explanation: "Essa tríade é comum em backends serverless."
              },
              {
                id: "aws-serverless-2",
                type: "true_false",
                prompt: "Lambda cobra apenas pelo tempo de execução utilizado.",
                options: ["Verdadeiro", "Falso"],
                correctAnswer: "Verdadeiro",
                explanation: "O modelo é orientado a consumo."
              }
            ]
          }
        ]
      }
    ]
  }
];

export const ACHIEVEMENTS = [
  {
    id: "streak-3",
    title: "3 dias seguidos",
    description: "Mantenha uma ofensiva de 3 dias.",
    type: "streak",
    threshold: 3
  },
  {
    id: "streak-7",
    title: "7 dias seguidos",
    description: "Mantenha uma ofensiva de 7 dias.",
    type: "streak",
    threshold: 7
  },
  {
    id: "module-master",
    title: "Módulo completo",
    description: "Conclua um módulo inteiro.",
    type: "module_completion",
    threshold: 1
  }
];

