export default function TelaEscolherJogo({ usuario, aoEscolher, aoVoltar }) {
  return (
    <div className="tela">
      <div className="tela__topo">
        <button className="icone-voltar" onClick={aoVoltar} aria-label="Voltar">
          ←
        </button>
      </div>

      <h1 className="texto-central">Escolha um jogo</h1>

      <div className="pilha">
        <button
          className="botao botao--grande"
          onClick={() => aoEscolher("cruzadinha")}
        >
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span>📝 Cruzadinha</span>
            <span className="texto-suave" style={{ color: "#EFEFEF" }}>
              Nível {usuario.jogos?.cruzadinha?.nivel ?? 1}
            </span>
          </span>
        </button>

        <button
          className="botao botao--secundario botao--grande"
          onClick={() => aoEscolher("matematica")}
        >
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span>🔢 Matemática</span>
            <span className="texto-suave" style={{ color: "#EFEFEF" }}>
              Nível {usuario.jogos?.matematica?.nivel ?? 1}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
