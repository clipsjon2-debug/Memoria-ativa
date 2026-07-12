import { useEffect, useMemo, useState } from "react";
import { gerarNivelMatematica } from "../data/niveisMatematica";
import { salvarProgressoJogo } from "../storage";
import { criarGerador, embaralhar } from "../data/random";

export default function Matematica({ usuario, aoSair, aoAtualizarUsuario }) {
  const [nivel, setNivel] = useState(usuario.jogos?.matematica?.nivel ?? 1);
  const [feedback, setFeedback] = useState(null); // "certo" | "errado" | null
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);

  const dadosNivel = useMemo(() => gerarNivelMatematica(nivel), [nivel]);

  const opcoes = useMemo(() => {
    const gerador = criarGerador(nivel * 65537 + 3);
    const certa = dadosNivel.resposta;
    const distancias = [1, -1, 2, -2, 3, -3, 5, -5];
    const erradas = new Set();
    let i = 0;
    while (erradas.size < 3 && i < distancias.length) {
      const candidata = certa + distancias[i];
      if (candidata >= 0 && candidata !== certa) erradas.add(candidata);
      i++;
    }
    // garante 3 opções erradas mesmo em casos extremos
    while (erradas.size < 3) {
      const extra = certa + erradas.size + 4;
      erradas.add(extra);
    }
    return embaralhar(gerador, [certa, ...erradas]);
  }, [nivel, dadosNivel]);

  useEffect(() => {
    setFeedback(null);
    setRespostaSelecionada(null);
  }, [nivel]);

  function escolherOpcao(valor) {
    if (feedback) return;
    setRespostaSelecionada(valor);

    if (valor === dadosNivel.resposta) {
      setFeedback("certo");
      const proximoNivel = nivel + 1;
      salvarProgressoJogo(usuario.id, "matematica", {
        nivel: proximoNivel,
        acertos: (usuario.jogos?.matematica?.acertos ?? 0) + 1,
      });
      aoAtualizarUsuario();
      setTimeout(() => setNivel(proximoNivel), 1000);
    } else {
      setFeedback("errado");
      setTimeout(() => {
        setFeedback(null);
        setRespostaSelecionada(null);
      }, 900);
    }
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
        <h1 style={{ fontSize: 56, margin: 0 }}>{dadosNivel.enunciado}</h1>
      </div>

      {feedback === "certo" && (
        <div className="mensagem-feedback mensagem-feedback--certo">Isso mesmo! 🎉</div>
      )}
      {feedback === "errado" && (
        <div className="mensagem-feedback mensagem-feedback--errado">
          Não foi dessa vez. Tente de novo.
        </div>
      )}

      <div className="pilha">
        {opcoes.map((valor) => {
          const selecionada = respostaSelecionada === valor;
          let cor = "botao--neutro";
          if (selecionada && feedback === "certo") cor = "";
          if (selecionada && feedback === "errado") cor = "botao--perigo";
          return (
            <button
              key={valor}
              className={`botao botao--grande ${cor}`}
              onClick={() => escolherOpcao(valor)}
              disabled={Boolean(feedback)}
            >
              {valor}
            </button>
          );
        })}
      </div>

      <div className="pilha">
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
