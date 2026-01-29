export const motivationalMessages = {
  low: [
    "Comienza tu dia con energia, toma agua!",
    "Tu cuerpo necesita hidratacion, dale lo que pide!",
    "Cada gota cuenta, empieza ahora!",
    "El agua es vida, no la hagas esperar!",
    "Un vaso de agua puede cambiar tu dia!",
  ],
  medium: [
    "Vas muy bien! Sigue asi!",
    "Tu cuerpo te lo agradece!",
    "Estas en el camino correcto!",
    "Excelente progreso, no pares!",
    "La consistencia es clave, sigue adelante!",
  ],
  high: [
    "Increible! Casi llegas a tu meta!",
    "Eres un ejemplo de hidratacion!",
    "Tu pareja te esta alcanzando!",
    "Solo un poco mas para ser campeon!",
    "La meta esta cerca, puedes lograrlo!",
  ],
  complete: [
    "META CUMPLIDA! Eres increible!",
    "Lo lograste! Tu cuerpo esta feliz!",
    "Campeon de la hidratacion!",
    "Mision cumplida! Nos vemos manana!",
    "100% hidratado! Felicidades!",
  ],
  partner: {
    ahead: [
      "Tu pareja va adelante, alcanzala!",
      "No te quedes atras, tu puedes!",
      "Es hora de ponerte al dia!",
    ],
    behind: [
      "Vas ganando! Sigue asi!",
      "Eres un ejemplo para tu pareja!",
      "Lidera con el ejemplo!",
    ],
    tied: [
      "Van parejos! Quien llegara primero?",
      "Empate tecnico! A beber agua!",
      "Juntos son un gran equipo!",
    ],
  },
};

export function getMotivationalMessage(glasses: number, goal: number): string {
  const percentage = (glasses / goal) * 100;
  
  if (percentage >= 100) {
    return motivationalMessages.complete[Math.floor(Math.random() * motivationalMessages.complete.length)];
  } else if (percentage >= 70) {
    return motivationalMessages.high[Math.floor(Math.random() * motivationalMessages.high.length)];
  } else if (percentage >= 30) {
    return motivationalMessages.medium[Math.floor(Math.random() * motivationalMessages.medium.length)];
  } else {
    return motivationalMessages.low[Math.floor(Math.random() * motivationalMessages.low.length)];
  }
}

export function getPartnerComparisonMessage(myGlasses: number, partnerGlasses: number): string {
  if (myGlasses > partnerGlasses) {
    return motivationalMessages.partner.ahead[Math.floor(Math.random() * motivationalMessages.partner.ahead.length)];
  } else if (myGlasses < partnerGlasses) {
    return motivationalMessages.partner.behind[Math.floor(Math.random() * motivationalMessages.partner.behind.length)];
  } else {
    return motivationalMessages.partner.tied[Math.floor(Math.random() * motivationalMessages.partner.tied.length)];
  }
}
