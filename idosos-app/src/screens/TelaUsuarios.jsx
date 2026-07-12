import { useState } from "react";
import { carregarUsuarios, criarUsuario, formatarData } from "../storage";

const NOME_JOGO = {
  cruzadinha: "Cruzadinha",
  matematica: "Matemática",
};

export default function TelaUsuarios({ aoEscolherUsuario }) {
  const [usuarios, setUsuarios] = useState(() => carregarUsuarios());
  const [criando, setCriando] = useState(false);
  const [nomeDigitado, setNomeDigitado] = useState("");

  function confirmarNovoUsuario() {
    const nome = nomeDigitado.trim();
    if (!nome) return;
    const usuario = criarUsuario(nome);
    setUsuarios(carregarUsuarios());
    setCriando(false);
    setNomeDigitado("");
    aoEscolherUsuario(usuario);
  }

  if (criando) {
    return (
      <div className="tela">
        <h1 className="texto-central">Qual é o seu nome?</h1>
        <input
          autoFocus
          type="text"
          value={nomeDigitado}
          onChange={(e) => setNomeDigitado(e.target.value)}
          placeholder="Digite aqui"
          style={{
            fontSize: "28px",
            padding: "18px",
            borderRadius: "18px",
            border: "3px solid var(--cor-borda)",
            textAlign: "center",
          }}
        />
        <div className="pilha">
          <button className="botao" onClick={confirmarNovoUsuario}>
            Confirmar
          </button>
          <button
            className="botao botao--neutro"
            onClick={() => {
              setCriando(false);
              setNomeDigitado("");
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tela">
      <h1 className="texto-central">Quem está jogando?</h1>

      <div className="pilha">
        {usuarios.map((u) => (
          <button
            key={u.id}
            className="botao botao--neutro botao--grande"
            style={{ flexDirection: "column", alignItems: "stretch", textAlign: "left" }}
            onClick={() => aoEscolherUsuario(u)}
          >
            <span style={{ fontSize: "30px", fontWeight: 700 }}>{u.nome}</span>
            <span className="texto-suave">
              {u.ultimoJogo
                ? `Último jogo: ${NOME_JOGO[u.ultimoJogo]} · Nível ${u.jogos?.[u.ultimoJogo]?.nivel ?? 1}`
                : "Ainda não começou a jogar"}
              {u.ultimoAcesso ? ` · ${formatarData(u.ultimoAcesso)}` : ""}
            </span>
          </button>
        ))}

        {usuarios.length === 0 && (
          <p className="texto-central texto-suave">
            Nenhum usuário ainda. Toque no botão abaixo para começar.
          </p>
        )}

        <button className="botao botao--secundario botao--grande" onClick={() => setCriando(true)}>
          + Novo usuário
        </button>
      </div>
    </div>
  );
}
