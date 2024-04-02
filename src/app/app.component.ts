import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'domino-game';
  public player1: Array<[number, number]> = []; 
  public player2: Array<[number, number]> = []; 

  // Função para gerar todas as combinações possíveis das peças de dominó
  generateDominoPieces(): Array<[number, number]> {
    let pieces: Array<[number, number]> = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            pieces.push([i, j]);
        }
    }
    return pieces;
  }

  // Função para distribuir as peças entre os jogadores e as restantes para compra
  distributePieces(allPieces: Array<[number, number]>, numPieces: number): { player1: Array<[number, number]>, player2: Array<[number, number]>, buy: Array<[number, number]> } {
    const shuffledPieces = allPieces.sort(() => Math.random() - 0.5); // Embaralha as peças

    const player1 = shuffledPieces.slice(0, numPieces);
    const player2 = shuffledPieces.slice(numPieces, numPieces * 2);
    const buy = shuffledPieces.slice(numPieces * 2);

    return { player1, player2, buy };
  }

  ngOnInit() {
    const allPieces = this.generateDominoPieces();
    const numPiecesPerPlayer = 7; // Número de peças por jogador
    const { player1, player2, buy } = this.distributePieces(allPieces, numPiecesPerPlayer);

    this.player1 = player1; // Atribui as peças do jogador 1 à propriedade player1
    this.player2 = player2; // Atribui as peças do jogador 2 à propriedade player2

    console.log("Peças do jogador 1:", player1);
    console.log("Peças do jogador 2:", player2);
    console.log("Peças para compra:", buy);
  }
}
