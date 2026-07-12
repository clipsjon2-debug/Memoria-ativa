// ============================================================
// random.js
// Gerador pseudo-aleatório "seedado" (mulberry32).
// Por quê? Porque assim, o nível 47 do jogo é *sempre* o mesmo
// exercício para todo mundo — se o usuário sair e voltar, ou usar
// o botão "voltar nível", o conteúdo não muda toda hora.
// Isso permite ter "1000 níveis" (ou infinitos) sem precisar
// guardar cada um deles manualmente.
// ============================================================

export function criarGerador(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Retorna um inteiro aleatório entre min e max (inclusive), usando o gerador dado.
export function intAleatorio(gerador, min, max) {
  return Math.floor(gerador() * (max - min + 1)) + min;
}

// Escolhe um item aleatório de uma lista.
export function itemAleatorio(gerador, lista) {
  return lista[Math.floor(gerador() * lista.length)];
}

// Embaralha uma cópia da lista usando o gerador (Fisher-Yates).
export function embaralhar(gerador, lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(gerador() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
