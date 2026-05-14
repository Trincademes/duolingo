export const EXPO_COURSE = {
  id: "expo",
  name: "Expo",
  tagline: "React Native sem atrito",
  description: "Aprenda a criar apps mobile com Expo em microlicoes praticas.",
  modules: [
    {
      id: "fundamentos",
      title: "Unidade 1: fundamentos",
      subtitle: "Entenda o que o Expo resolve no inicio de um app.",
      lessons: [
        {
          id: "expo-intro",
          title: "Por que usar Expo?",
          xp: 40,
          minCorrect: 2,
          summary: "Expo reduz configuracao nativa e acelera testes no celular.",
          exercises: [
            {
              id: "expo-intro-1",
              type: "choice",
              prompt: "Qual e a principal vantagem do Expo no inicio do projeto?",
              options: [
                "Evita boa parte da configuracao nativa inicial",
                "Remove a necessidade de usar React",
                "Funciona apenas em iPhone"
              ],
              answer: "Evita boa parte da configuracao nativa inicial",
              explanation: "Expo deixa voce focar na experiencia e testar rapido antes de mexer em codigo nativo."
            },
            {
              id: "expo-intro-2",
              type: "boolean",
              prompt: "Expo Go ajuda a testar alteracoes rapidamente no dispositivo.",
              answer: true,
              explanation: "Expo Go encurta o ciclo de feedback durante o desenvolvimento."
            },
            {
              id: "expo-intro-3",
              type: "order",
              prompt: "Ordene um fluxo simples de criacao.",
              options: ["Criar app", "Editar tela", "Testar no celular"],
              answer: ["Criar app", "Editar tela", "Testar no celular"],
              explanation: "A sequencia natural e criar a base, editar a interface e validar no aparelho."
            }
          ]
        },
        {
          id: "expo-components",
          title: "Componentes base",
          xp: 50,
          minCorrect: 2,
          summary: "Text, View, ScrollView e Pressable formam a base da tela.",
          exercises: [
            {
              id: "expo-components-1",
              type: "choice",
              prompt: "Qual componente renderiza texto em React Native?",
              options: ["Text", "View", "Pressable"],
              answer: "Text",
              explanation: "Todo texto visivel em React Native precisa ficar dentro de Text."
            },
            {
              id: "expo-components-2",
              type: "choice",
              prompt: "Qual componente e melhor para criar uma acao de toque?",
              options: ["Pressable", "ScrollView", "SafeAreaView"],
              answer: "Pressable",
              explanation: "Pressable e feito para responder a toques e estados de interacao."
            },
            {
              id: "expo-components-3",
              type: "blank",
              prompt: "Complete o componente: <_____>Ola Expo</_____>",
              options: ["Text", "View", "Button"],
              answer: "Text",
              explanation: "A resposta correta e Text porque o conteudo exibido e texto."
            }
          ]
        }
      ]
    },
    {
      id: "produto",
      title: "Unidade 2: app real",
      subtitle: "Construa fluxo, estado e publicacao com Expo.",
      lessons: [
        {
          id: "expo-state",
          title: "Estado e progresso",
          xp: 60,
          minCorrect: 2,
          summary: "Estado local deixa o app reagir as escolhas do aluno.",
          exercises: [
            {
              id: "expo-state-1",
              type: "choice",
              prompt: "Qual hook guarda dados que mudam na tela?",
              options: ["useState", "useEffect", "StyleSheet"],
              answer: "useState",
              explanation: "useState guarda valores que precisam atualizar a interface."
            },
            {
              id: "expo-state-2",
              type: "boolean",
              prompt: "AsyncStorage pode persistir progresso simples no dispositivo.",
              answer: true,
              explanation: "Ele e suficiente para um MVP local com progresso, XP e preferencias."
            },
            {
              id: "expo-state-3",
              type: "order",
              prompt: "Ordene um fluxo de licao.",
              options: ["Escolher resposta", "Receber feedback", "Ganhar XP"],
              answer: ["Escolher resposta", "Receber feedback", "Ganhar XP"],
              explanation: "Esse e o ciclo central da experiencia gamificada."
            }
          ]
        },
        {
          id: "expo-ship",
          title: "Preparar para publicar",
          xp: 70,
          minCorrect: 2,
          summary: "O MVP precisa rodar bem antes de crescer.",
          exercises: [
            {
              id: "expo-ship-1",
              type: "choice",
              prompt: "Qual comando abre o servidor de desenvolvimento do Expo?",
              options: ["npx expo start", "npm run web", "node script.js"],
              answer: "npx expo start",
              explanation: "O Expo start mostra o QR Code e inicia o Metro Bundler."
            },
            {
              id: "expo-ship-2",
              type: "boolean",
              prompt: "Um MVP mobile pode validar a experiencia antes de integracoes externas.",
              answer: true,
              explanation: "Para demonstracao, o fluxo local ja prova interface, licao, progresso e gamificacao."
            },
            {
              id: "expo-ship-3",
              type: "blank",
              prompt: "Complete: Expo e uma ferramenta para apps _____ com React Native.",
              options: ["mobile", "desktop", "terminal"],
              answer: "mobile",
              explanation: "Expo simplifica a construcao de apps mobile com React Native."
            }
          ]
        }
      ]
    }
  ]
};

export const EXPO_LESSONS = EXPO_COURSE.modules.flatMap((module) =>
  module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id }))
);
