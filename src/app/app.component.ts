import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDrag, CdkDropList, DragRef, Point, copyArrayItem } from '@angular/cdk/drag-drop';

interface PiecesInPlayArea {
  [key: string]: [number, number][];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'domino-game';
  public player1: Array<[number, number]> = []; 
  public player2: Array<[number, number]> = [];
  public playAreaData: Array<[number, number]> = []; 
  piecesInPlayArea: PiecesInPlayArea = {};
  isPieceInPlayArea = false;

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
    const shuffledPieces = allPieces.sort(() => Math.random() - 0.5);
  
    const player1 = shuffledPieces.slice(0, numPieces);
    const player2 = shuffledPieces.slice(numPieces, numPieces * 2);
    const buy = shuffledPieces.slice(numPieces * 2);
  
    return { player1, player2, buy };
  }
  

  onPieceDropped(event: CdkDragDrop<[number, number][]>): void {
    const droppedElement = event.event.target as HTMLElement;
    const droppedElementId = droppedElement.id;
    
    if (droppedElementId && droppedElementId == 'play-area') {
      this.isPieceInPlayArea = true;
      const pieceIndex = this.player1.indexOf(event.item.data);
      if (pieceIndex !== -1) {
        this.player1.splice(pieceIndex, 1); // Remover a peça do jogador 1
      } else {
        const pieceIndex = this.player2.indexOf(event.item.data);
        if (pieceIndex !== -1) {
          this.player2.splice(pieceIndex, 1); // Remover a peça do jogador 2
        }
      }
      this.piecesInPlayArea['position_' + Object.keys(this.piecesInPlayArea).length] = event.item.data;
    } else {
      this.isPieceInPlayArea = false;
      // Lógica para lidar com a solta em outras áreas, se necessário
    }
    console.log(this.piecesInPlayArea)
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
}
