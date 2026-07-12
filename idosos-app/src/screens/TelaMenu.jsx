const NOME_JOGO = {
  cruzadinha: "Cruzadinha",
  matematica: "Matemática",
};

export default function TelaMenu({ usuario, aoContinuar, aoEscolherJogo, aoTrocarUsuario }) {
  const temUltimoJogo = Boolean(usuario.ultimoJogo);

  return (
    <div className="tela">
      <div className="tela__topo">
        <button className="icone-voltar" onClick={aoTrocarUsuario} aria-label="Trocar de usuário">
          ←
        </button>
      </div>

      <h1 className="texto-central">Olá, {usuario.nome}!</h1>

      <div className="pilha">
        {temUltimoJogo && (
          <button className="botao botao--grande" onClick={aoContinuar}>
            ▶ Continuar {NOME_JOGO[usuario.ultimoJogo]}
          </button>
        )}

        <button
          className={`botao botao--grande ${temUltimoJogo ? "botao--secundario" : ""}`}
          onClick={aoEscolherJogo}
        >
          🎮 Escolher jogo
        </button>

        <button className="botao botao--neutro" onClick={aoTrocarUsuario}>
          Trocar de usuário
        </button>
      </div>
    </div>
  );
}
