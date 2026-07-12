import { useState } from "react";
import TelaUsuarios from "./screens/TelaUsuarios";
import TelaMenu from "./screens/TelaMenu";
import TelaEscolherJogo from "./screens/TelaEscolherJogo";
import Cruzadinha from "./games/Cruzadinha";
import Matematica from "./games/Matematica";
import { obterUsuario, tocarUltimoAcesso } from "./storage";

// ============================================================
// App.jsx
// Em vez de usar um sistema de rotas (react-router), controlamos
// a "tela atual" com um simples useState. Para este app — poucas
// telas, fluxo linear, público que se beneficia de previsibilidade
// — isso é mais simples de entender e manter do que rotas de URL.
// ============================================================

export default function App() {
  const [tela, setTela] = useState("usuarios"); // usuarios | menu | jogos | cruzadinha | matematica
  const [usuario, setUsuario] = useState(null);

  function aoEscolherUsuario(u) {
    tocarUltimoAcesso(u.id);
    setUsuario(u);
    setTela("menu");
  }

  function atualizarUsuarioAtual() {
    if (!usuario) return;
    setUsuario(obterUsuario(usuario.id));
  }

  function irParaUsuarios() {
    setUsuario(null);
    setTela("usuarios");
  }

  function continuarUltimoJogo() {
    if (usuario?.ultimoJogo) {
      setTela(usuario.ultimoJogo);
    } else {
      setTela("jogos");
    }
  }

  if (tela === "usuarios" || !usuario) {
    return <TelaUsuarios aoEscolherUsuario={aoEscolherUsuario} />;
  }

  if (tela === "menu") {
    return (
      <TelaMenu
        usuario={usuario}
        aoContinuar={continuarUltimoJogo}
        aoEscolherJogo={() => setTela("jogos")}
        aoTrocarUsuario={irParaUsuarios}
      />
    );
  }

  if (tela === "jogos") {
    return (
      <TelaEscolherJogo
        usuario={usuario}
        aoEscolher={(jogo) => setTela(jogo)}
        aoVoltar={() => setTela("menu")}
      />
    );
  }

  if (tela === "cruzadinha") {
    return (
      <Cruzadinha
        usuario={usuario}
        aoSair={() => {
          atualizarUsuarioAtual();
          setTela("menu");
        }}
        aoAtualizarUsuario={atualizarUsuarioAtual}
      />
    );
  }

  if (tela === "matematica") {
    return (
      <Matematica
        usuario={usuario}
        aoSair={() => {
          atualizarUsuarioAtual();
          setTela("menu");
        }}
        aoAtualizarUsuario={atualizarUsuarioAtual}
      />
    );
  }

  return null;
}
