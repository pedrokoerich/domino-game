# Changelog
Todas as mudanças envolvendo este projeto estarão destacadas nesse documento. 

Utilizamos o versionamento semantico (https://semver.org/)
## [1.0.0] 30/04/2024 - https://pedrokoerich.github.io/domino-game/

## Features

 * Implementada a mecânica básica de jogo para um jogo de dominó 1x1.
 * Desenvolvida uma UI simples usando o framework Angular.
 * Criação de um oponente bot usando TypeScript para o modo single-player.
 * Adicionada lógica para o oponente do bot fazer movimentos inteligentes com base nas peças disponíveis.
 * Implementada validação de colocação de blocos para garantir movimentos legais.
 * Adicionado sistema de pontuação para rastrear pontuações de jogadores e bots.
 * Detecção de final de jogo incluída para determinar o vencedor ou empate.
 * Layout responsivo projetado para vários tamanhos de tela.

## Known Issues

 * Ocasionalmente, o bot faz movimentos abaixo do ideal em determinados cenários de jogo.
 * Ao realizar uma jogada incoerente, o bot entende que foi realizada uma jogada e joga uma peça, mesmo não sendo sua vez.
 * A UI pode ter pequenas inconsistências de estilo em determinados navegadores.

## Future Improvements

 * Aprimorar a IA do bot para fornecer uma jogabilidade mais desafiadora.
 * Implementar a funcionalidade multijogador para jogos online.
 * Adicionar animações e efeitos sonoros para uma experiência de usuário mais envolvente.
 * Otimizar a UI para melhorar a acessibilidade e a interação do usuário.