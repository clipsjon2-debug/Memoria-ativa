// ============================================================
// storage.js
// Tudo que é "banco de dados" do app mora aqui.
// Usamos localStorage do navegador: funciona offline, não
// precisa de internet nem de servidor, e sobrevive a fechar
// o navegador/app. A limitação é que o progresso fica só
// naquele aparelho (não sincroniza entre celulares).
// ============================================================

const CHAVE_USUARIOS = "memoria-ativa:usuarios";

// Estrutura de um usuário salvo:
// {
//   id: string,
//   nome: string,
//   criadoEm: number (timestamp),
//   ultimoAcesso: number (timestamp),
//   jogos: {
//     cruzadinha: { nivel: number, acertos: number },
//     matematica: { nivel: number, acertos: number }
//   },
//   ultimoJogo: "cruzadinha" | "matematica" | null
// }

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function carregarUsuarios() {
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIOS);
    if (!bruto) return [];
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return [];
    return lista;
  } catch (erro) {
    console.error("Falha ao carregar usuários:", erro);
    return [];
  }
}

function salvarTodos(lista) {
  try {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
  } catch (erro) {
    console.error("Falha ao salvar usuários:", erro);
  }
}

export function criarUsuario(nome) {
  const lista = carregarUsuarios();
  const novo = {
    id: gerarId(),
    nome: nome.trim(),
    criadoEm: Date.now(),
    ultimoAcesso: Date.now(),
    jogos: {
      cruzadinha: { nivel: 1, acertos: 0 },
      matematica: { nivel: 1, acertos: 0 },
    },
    ultimoJogo: null,
  };
  lista.push(novo);
  salvarTodos(lista);
  return novo;
}

export function obterUsuario(id) {
  return carregarUsuarios().find((u) => u.id === id) || null;
}

export function tocarUltimoAcesso(id) {
  const lista = carregarUsuarios();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) return;
  lista[idx].ultimoAcesso = Date.now();
  salvarTodos(lista);
}

export function excluirUsuario(id) {
  const lista = carregarUsuarios().filter((u) => u.id !== id);
  salvarTodos(lista);
}

// Salva o progresso de um jogo específico para um usuário.
export function salvarProgressoJogo(usuarioId, jogo, { nivel, acertos }) {
  const lista = carregarUsuarios();
  const idx = lista.findIndex((u) => u.id === usuarioId);
  if (idx === -1) return;

  if (!lista[idx].jogos) lista[idx].jogos = {};
  if (!lista[idx].jogos[jogo]) lista[idx].jogos[jogo] = { nivel: 1, acertos: 0 };

  if (typeof nivel === "number") lista[idx].jogos[jogo].nivel = nivel;
  if (typeof acertos === "number") lista[idx].jogos[jogo].acertos = acertos;

  lista[idx].ultimoJogo = jogo;
  lista[idx].ultimoAcesso = Date.now();

  salvarTodos(lista);
}

export function formatarData(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleDateString("pt-BR");
}
