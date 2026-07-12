import { BANCO_PALAVRAS } from "./palavras";
import { criarGerador, itemAleatorio } from "./random";

// ============================================================
// niveisCruzadinha.js
// Transforma o banco de palavras em "níveis" numerados (1, 2, 3...
// até o infinito). A dificuldade sobe aos poucos: primeiro
// palavras curtas, depois médias, depois longas — e depois
// disso, tudo se repete embaralhado (a repetição não é problema
// aqui, é até bom para exercitar a memória).
// ============================================================

const CURTAS = BANCO_PALAVRAS.filter((p) => p.resposta.length <= 4);
const MEDIAS = BANCO_PALAVRAS.filter(
  (p) => p.resposta.length >= 5 && p.resposta.length <= 7
);
const LONGAS = BANCO_PALAVRAS.filter((p) => p.resposta.length >= 8);

// Quantos níveis cada "tier" de dificuldade ocupa antes de passar pro próximo.
const TAMANHO_TIER = 15;

function bancoParaNivel(nivel) {
  // Os primeiros TAMANHO_TIER níveis usam só palavras curtas.
  // Os próximos TAMANHO_TIER usam curtas + médias.
  // A partir daí, todas as dificuldades entram no sorteio.
  if (nivel <= TAMANHO_TIER) return CURTAS;
  if (nivel <= TAMANHO_TIER * 2) return [...CURTAS, ...MEDIAS];
  return [...CURTAS, ...MEDIAS, ...LONGAS];
}

// Gera o "alfabeto de apoio" (letras extras erradas) para completar o teclado.
const ALFABETO = "AEIOUBCDFGHJLMNPQRSTVXZ".split("");

export function gerarNivelCruzadinha(nivel) {
  const gerador = criarGerador(nivel * 7919 + 13); // seed fixo por nível
  const banco = bancoParaNivel(nivel);
  const item = itemAleatorio(gerador, banco);

  const letrasCorretas = item.resposta.split("");
  const quantidadeExtra = Math.min(6, Math.max(3, Math.floor(letrasCorretas.length / 2)));

  // monta um conjunto de letras "distratoras" que ainda não estão na resposta
  const disponiveis = ALFABETO.filter((l) => !letrasCorretas.includes(l));
  const extras = [];
  const copiaDisponiveis = [...disponiveis];
  for (let i = 0; i < quantidadeExtra && copiaDisponiveis.length > 0; i++) {
    const idx = Math.floor(gerador() * copiaDisponiveis.length);
    extras.push(copiaDisponiveis.splice(idx, 1)[0]);
  }

  // embaralha todas as letras (corretas + distratoras) para os botões do teclado
  const todasLetras = [...letrasCorretas, ...extras];
  for (let i = todasLetras.length - 1; i > 0; i--) {
    const j = Math.floor(gerador() * (i + 1));
    [todasLetras[i], todasLetras[j]] = [todasLetras[j], todasLetras[i]];
  }

  return {
    nivel,
    dica: item.dica,
    resposta: item.resposta,
    letrasTeclado: todasLetras.map((letra, i) => ({ id: `${nivel}-${i}`, letra })),
  };
}
