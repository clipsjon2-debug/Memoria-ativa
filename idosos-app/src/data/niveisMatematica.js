import { criarGerador, intAleatorio } from "./random";

// ============================================================
// niveisMatematica.js
// Gera exercícios de soma/subtração com dificuldade crescente,
// nunca usando frações, álgebra ou multiplicação/divisão difícil.
// ============================================================

// Definição das "fases" de dificuldade por faixa de nível.
function faseParaNivel(nivel) {
  if (nivel <= 15) return { op: "+", min: 1, max: 5 };
  if (nivel <= 30) return { op: "+", min: 1, max: 10 };
  if (nivel <= 45) return { op: "-", min: 1, max: 10, semNegativo: true };
  if (nivel <= 70) return { op: "+-", min: 1, max: 20 };
  if (nivel <= 100) return { op: "+-", min: 1, max: 50 };
  return { op: "+-", min: 5, max: 99 };
}

export function gerarNivelMatematica(nivel) {
  const gerador = criarGerador(nivel * 104729 + 7);
  const fase = faseParaNivel(nivel);

  let operador = fase.op;
  if (operador === "+-") {
    operador = gerador() < 0.5 ? "+" : "-";
  }

  let a = intAleatorio(gerador, fase.min, fase.max);
  let b = intAleatorio(gerador, fase.min, fase.max);

  // Nunca deixamos o resultado da subtração ficar negativo (mais simples de entender).
  if (operador === "-" && b > a) {
    [a, b] = [b, a];
  }

  const resposta = operador === "+" ? a + b : a - b;

  return {
    nivel,
    enunciado: `${a} ${operador} ${b}`,
    a,
    b,
    operador,
    resposta,
  };
}
