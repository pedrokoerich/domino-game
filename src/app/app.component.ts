import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'domino-game';
  public player1: Array<[number, number]> = [];
  public player2: Array<[number, number]> = [];
  public peca: Array<[number, number]> = [];
  public playAreaData: Array<[number, number]> = [];
  done: Array<[number, number]> = [];

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

  ngOnInit() {
    const allPieces = this.generateDominoPieces();
    const numPiecesPerPlayer = 7; // Número de peças por jogador
    const { player1, player2, buy } = this.distributePieces(allPieces, numPiecesPerPlayer);

    this.player1 = player1; // Atribui as peças do jogador 1 à propriedade player1
    this.player2 = player2; // Atribui as peças do jogador 2 à propriedade player2
    this.playAreaData = buy; // Atribui as peças restantes para a área de jogo

    console.log("Peças do jogador 1:", player1);
    console.log("Peças do jogador 2:", player2);
    console.log("Peças para compra:", buy);
  }

  // Função para distribuir as peças entre os jogadores e as restantes para compra
  distributePieces(allPieces: Array<[number, number]>, numPieces: number): { player1: Array<[number, number]>, player2: Array<[number, number]>, buy: Array<[number, number]> } {
    const shuffledPieces = allPieces.sort(() => Math.random() - 0.5);

    const player1 = shuffledPieces.slice(0, numPieces);
    const player2 = shuffledPieces.slice(numPieces, numPieces * 2);
    const buy = shuffledPieces.slice(numPieces * 2);

    return { player1, player2, buy };
  }
  drop(event: CdkDragDrop<Array<[number, number]>>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const droppedPiece = event.previousContainer.data[event.previousIndex];
      const targetPiece = event.container.data[event.currentIndex];
  
      const droppedLeftSide = droppedPiece[0];
      const droppedRightSide = droppedPiece[1];
  
      // Verifica se a peça de destino não é undefined
      if (targetPiece) {
        const targetLeftSide = targetPiece[0];
        const targetRightSide = targetPiece[1];
  
        if (droppedRightSide === targetLeftSide) {
          // Conectar peças com lados iguais
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else if (droppedLeftSide === targetRightSide) {
          // Se necessário, gira a peça solta
          const rotatedPiece: [number, number] = [droppedRightSide, droppedLeftSide];
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          event.container.data[event.currentIndex] = rotatedPiece;
        } else {
          // Se os lados não corresponderem, não permite a conexão
          console.log("Os lados das peças não correspondem. A conexão não é permitida.");
        }
      } else {
        // Verifica se a mesa está vazia antes de realizar a verificação
        if (this.done.length === 0) {
          // Se a mesa estiver vazia, permite colocar a peça na mesa
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {
          // Se a mesa não estiver vazia, verifique se a peça pode ser colocada na mesa
          let canPlacePiece = false;
          for (const piece of this.done) {
            const leftSide = piece[0];
            const rightSide = piece[1];
            if (droppedLeftSide === leftSide || droppedRightSide === rightSide) {
              canPlacePiece = true;
              break;
            }
          }
  
          if (canPlacePiece) {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
          } else {
            console.log("Não é possível colocar essa peça na mesa.");
          }
        }
      }
    }
  }
  


  dropPlayer1(event: CdkDragDrop<Array<[number, number]>>) {
    moveItemInArray(this.player1, event.previousIndex, event.currentIndex);
  }

  dropPlayer2(event: CdkDragDrop<Array<[number, number]>>) {
    moveItemInArray(this.player2, event.previousIndex, event.currentIndex);
  }
}
