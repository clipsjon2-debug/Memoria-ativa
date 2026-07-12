import { useEffect, useMemo, useState } from "react";
import { gerarNivelCruzadinha } from "../data/niveisCruzadinha";
import { salvarProgressoJogo } from "../storage";

export default function Cruzadinha({ usuario, aoSair, aoAtualizarUsuario }) {
  const [nivel, setNivel] = useState(usuario.jogos?.cruzadinha?.nivel ?? 1);
  const [respostaMontada, setRespostaMontada] = useState([]);
  const [letrasUsadasIds, setLetrasUsadasIds] = useState([]);
  const [feedback, setFeedback] = useState(null); // "certo" | "errado" | null

  const dadosNivel = useMemo(() => gerarNivelCruzadinha(nivel), [nivel]);

  // sempre que o nível muda, reinicia o tabuleiro de letras
  useEffect(() => {
    setRespostaMontada([]);
    setLetrasUsadasIds([]);
    setFeedback(null);
  }, [nivel]);

  function tocarLetra(item) {
    if (feedback === "certo") return;
    if (respostaMontada.length >= dadosNivel.resposta.length) return;

    const novaResposta = [...respostaMontada, item.letra];
    setRespostaMontada(novaResposta);
    setLetrasUsadasIds([...letrasUsadasIds, item.id]);

    if (novaResposta.length === dadosNivel.resposta.length) {
      const palavraFormada = novaResposta.join("");
      if (palavraFormada === dadosNivel.resposta) {
        setFeedback("certo");
        const proximoNivel = nivel + 1;
        salvarProgressoJogo(usuario.id, "cruzadinha", {
          nivel: proximoNivel,
          acertos: (usuario.jogos?.cruzadinha?.acertos ?? 0) + 1,
        });
        aoAtualizarUsuario();
        setTimeout(() => setNivel(proximoNivel), 1100);
      } else {
        setFeedback("errado");
        setTimeout(() => {
          setRespostaMontada([]);
          setLetrasUsadasIds([]);
          setFeedback(null);
        }, 900);
      }
    }
  }

  function apagarUltima() {
    if (respostaMontada.length === 0 || feedback === "certo") return;
    setRespostaMontada(respostaMontada.slice(0, -1));
    setLetrasUsadasIds(letrasUsadasIds.slice(0, -1));
  }

  function voltarNivel() {
    setNivel((n) => Math.max(1, n - 1));
  }

  return (
    <div className="tela">
      <div className="tela__topo">
        <button className="icone-voltar" onClick={aoSair} aria-label="Sair">
          ←
        </button>
        <span className="texto-suave">Nível {nivel}</span>
      </div>

      <div className="cartao texto-central">
        <p className="texto-suave" style={{ marginBottom: 6 }}>
          Dica:
        </p>
        <h2 style={{ margin: 0 }}>{dadosNivel.dica}</h2>
      </div>

      {/* espaços da palavra */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {dadosNivel.resposta.split("").map((_, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 54,
              borderRadius: 10,
              border: "3px solid var(--cor-borda)",
              background: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {respostaMontada[i] ?? ""}
          </div>
        ))}
      </div>

      {feedback === "certo" && (
        <div className="mensagem-feedback mensagem-feedback--certo">Muito bem! 🎉</div>
      )}
      {feedback === "errado" && (
        <div className="mensagem-feedback mensagem-feedback--errado">
          Quase! Vamos tentar de novo.
        </div>
      )}

      {/* teclado de letras */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {dadosNivel.letrasTeclado.map((item) => (
          <button
            key={item.id}
            disabled={letrasUsadasIds.includes(item.id) || feedback === "certo"}
            onClick={() => tocarLetra(item)}
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "none",
              background: letrasUsadasIds.includes(item.id) ? "#D8D0C0" : "var(--cor-primaria)",
              color: "#FFF",
              fontSize: 24,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {item.letra}
          </button>
        ))}
      </div>

      <div className="pilha">
        <button className="botao botao--neutro" onClick={apagarUltima}>
          ⌫ Apagar letra
        </button>
        <button className="botao botao--neutro" onClick={voltarNivel} disabled={nivel <= 1}>
          ↩ Voltar nível
        </button>
        <button className="botao botao--perigo" onClick={aoSair}>
          Sair
        </button>
      </div>
    </div>
  );
}
