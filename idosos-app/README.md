# Memória Ativa

Aplicativo web (PWA) de jogos simples de memória e raciocínio, feito para idosos
usarem no celular (Android e iPhone), no lugar de livrinhos de cruzadinha e
continhas de matemática.

## O que tem no projeto

- **Tela de usuários**: cria perfis simples (só o nome, sem senha).
- **Progresso automático**: tudo é salvo sozinho no celular (localStorage).
- **Jogo Cruzadinha**: mostra uma dica, o usuário toca nas letras para formar a
  palavra. Níveis gerados automaticamente (nunca acabam).
- **Jogo Matemática**: somas e subtrações simples, com múltipla escolha,
  dificuldade que sobe aos poucos.
- **PWA**: pode ser "instalado" no celular como se fosse um aplicativo,
  funciona offline depois do primeiro acesso.

## Rodar no computador (antes de publicar)

Precisa ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais nova).

```bash
npm install
npm run dev
```

Isso abre o site em `http://localhost:5173` para você testar.

Para gerar a versão final (a mesma coisa que vai pro ar):

```bash
npm run build
npm run preview
```

## Estrutura das pastas

```
src/
  data/             -> geração de níveis e banco de palavras
  screens/          -> telas de navegação (usuários, menu, escolher jogo)
  games/            -> os dois jogos (Cruzadinha, Matemática)
  storage.js        -> salvar/carregar usuários e progresso
  App.jsx           -> controla qual tela aparece
  index.css         -> estilo (cores, tamanhos de fonte/botão)
public/
  icon-192.png / icon-512.png -> ícones do app instalado
vite.config.js      -> configuração do PWA (manifest, service worker)
```

## Como publicar (passo a passo)

### 1. Colocar o projeto no GitHub

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver).
2. No GitHub, clique em **New repository** (Novo repositório). Dê um nome,
   por exemplo `memoria-ativa`. Deixe como **Public** ou **Private**, tanto
   faz. Não marque nada de "adicionar README" (o projeto já tem um).
3. No seu computador, abra este projeto no **VS Code**.
4. No terminal do VS Code (menu Terminal → New Terminal), rode:

```bash
git init
git add .
git commit -m "Primeira versão do Memória Ativa"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/memoria-ativa.git
git push -u origin main
```

   Troque `SEU-USUARIO` pelo seu nome de usuário do GitHub. O GitHub vai
   pedir para você fazer login (ou usar um token de acesso — ele mesmo
   explica como criar na hora, se pedir).

### 2. Publicar no Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) — o mais fácil é
   clicar em "Continue with GitHub" e autorizar com a mesma conta do
   GitHub que você usou acima.
2. No painel da Vercel, clique em **Add New → Project**.
3. Escolha o repositório `memoria-ativa` que você acabou de subir.
4. A Vercel já detecta sozinha que é um projeto **Vite**. Não precisa mudar
   nada nas configurações — deixe tudo como está sugerido.
5. Clique em **Deploy**.
6. Em menos de um minuto, a Vercel te dá um link do tipo
   `https://memoria-ativa-seunome.vercel.app` — esse é o site no ar.

### 3. Instalar como aplicativo no celular

- **Android (Chrome)**: abra o link, toque nos três pontinhos (⋮) no canto
  superior direito → **Instalar aplicativo** (ou "Adicionar à tela inicial").
- **iPhone (Safari)**: abra o link, toque no ícone de compartilhar (o
  quadrado com a seta para cima) → **Adicionar à Tela de Início**.

Depois disso, aparece um ícone no celular igual a um aplicativo normal,
mesmo sendo um site.

### 4. Atualizando o site depois

Sempre que você editar algo e quiser atualizar o site publicado, no VS Code:

```bash
git add .
git commit -m "Descreva o que mudou"
git push
```

A Vercel detecta o novo envio (push) automaticamente e publica a nova
versão sozinha, sem precisar repetir os passos de configuração.

## Observação importante sobre o progresso salvo

O progresso de cada usuário fica salvo **no navegador/aplicativo daquele
celular específico** (não em um servidor). Isso significa que:

- Fechar e abrir de novo: o progresso continua normalmente. ✅
- Trocar de celular ou reinstalar o navegador do zero: o progresso **não**
  acompanha, começa vazio nesse aparelho novo. Se no futuro você quiser
  progresso sincronizado entre aparelhos, isso exigiria adicionar um banco
  de dados na nuvem — um passo a mais, que dá para fazer depois.
