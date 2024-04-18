import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface DominoPiece {
  piece: [number, number];
  horizontal: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'domino-game';
  player1: DominoPiece[] = [];
  player2: DominoPiece[] = [];
  peca: [number, number][] = [];
  playAreaData: [number, number][] = [];
  done: DominoPiece[] = [];
  horizontalPiece = false;
  draggedPieceIndex: number | null = null;

  generateDominoPieces(): [number, number][] {
    const pieces: [number, number][] = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        pieces.push([i, j]);
      }
    }
    return pieces;
  }

  ngOnInit() {
    const allPieces = this.generateDominoPieces();
    const numPiecesPerPlayer = 7;
    const { player1, player2, buy } = this.distributePieces(allPieces, numPiecesPerPlayer);

    this.player1 = player1;
    this.player2 = player2;
    this.playAreaData = buy;
  }

  distributePieces(allPieces: [number, number][], numPieces: number): { player1: DominoPiece[], player2: DominoPiece[], buy: [number, number][] } {
    const shuffledPieces = allPieces.sort(() => Math.random() - 0.5);
    const player1: DominoPiece[] = [];
    const player2: DominoPiece[] = [];
    const buy: [number, number][] = [];

    const player1Counts = new Map<number, number>();
    const player2Counts = new Map<number, number>();

    for (const piece of shuffledPieces) {
        const [left, right] = piece;

        // Verifica se algum jogador já possui mais de 5 peças com o mesmo número
        if ((player1Counts.get(left) ?? 0) >= 5 || (player1Counts.get(right) ?? 0) >= 5) {
            buy.push(piece);
        } else if ((player2Counts.get(left) ?? 0) >= 5 || (player2Counts.get(right) ?? 0) >= 5) {
            buy.push(piece);
        } else {
            // Distribui a peça para o jogador 1 se ele ainda não atingiu o limite
            if (player1.length < numPieces) {
                player1.push({ piece, horizontal: false });
                player1Counts.set(left, (player1Counts.get(left) ?? 0) + 1);
                player1Counts.set(right, (player1Counts.get(right) ?? 0) + 1);
            } 
            // Distribui a peça para o jogador 2 se ele ainda não atingiu o limite
            else if (player2.length < numPieces) {
                player2.push({ piece, horizontal: false });
                player2Counts.set(left, (player2Counts.get(left) ?? 0) + 1);
                player2Counts.set(right, (player2Counts.get(right) ?? 0) + 1);
            } 
            // Adiciona a peça à pilha de compra caso ambos os jogadores já tenham atingido o limite
            else {
                buy.push(piece);
            }
        }
    }

    return { player1, player2, buy };
}


  drop(event: CdkDragDrop<DominoPiece[]>) {
    const droppedItem = event.previousContainer.data[event.previousIndex];
    const targetPiece = event.container.data[event.currentIndex]?.piece;
    const droppedLeftSide = droppedItem.piece[0];
    const droppedRightSide = droppedItem.piece[1];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (targetPiece) {
      const targetLeftSide = targetPiece[0];
      const targetRightSide = targetPiece[1];

      if (droppedRightSide === targetLeftSide) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        droppedItem.horizontal = droppedLeftSide !== droppedRightSide;
      } else if (droppedLeftSide === targetRightSide) {
        const rotatedPiece: [number, number] = [droppedRightSide, droppedLeftSide];
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        event.container.data[event.currentIndex].piece = rotatedPiece;
        droppedItem.horizontal = true;
      } else if (droppedLeftSide === targetLeftSide) {
        const attachedPiece: [number, number] = [droppedRightSide, targetRightSide];
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        event.container.data[event.currentIndex].piece = attachedPiece;
        droppedItem.horizontal = true;
      } else if (droppedRightSide === targetRightSide) {
        const attachedPiece: [number, number] = [targetLeftSide, droppedLeftSide];
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        event.container.data[event.currentIndex].piece = attachedPiece;
        droppedItem.horizontal = true;
      } else {
        console.log("Os lados das peças não correspondem. A conexão não é permitida.");
      }
    } else if (this.done.length === 0) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      droppedItem.horizontal = droppedLeftSide !== droppedRightSide;
    } else {
      let canPlacePiece = false;
      for (const piece of this.done) {
        const leftSide = piece.piece[0];
        const rightSide = piece.piece[1];
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
        droppedItem.horizontal = droppedLeftSide !== droppedRightSide;
      } else {
        console.log("Não é possível colocar essa peça na mesa.");
      }
    }

    if (this.draggedPieceIndex !== null && event.currentIndex === this.draggedPieceIndex) {
      if (droppedItem) {
        const droppedPiece = droppedItem.piece;
        const droppedLeftSide = droppedPiece[0];
        const droppedRightSide = droppedPiece[1];

        if (droppedLeftSide !== droppedRightSide) {
          droppedItem.horizontal = true;
        }
      }
    }
    this.draggedPieceIndex = null;
  }

  comprarPeca() {
    if (this.playAreaData.length > 0) {
      console.log("TESTE")
      const proximaPeca = this.playAreaData.shift(); // Remove e retorna o próximo elemento da variável 'buy'
      if (proximaPeca) {
        this.player2.push({ piece: proximaPeca, horizontal: false }); // Adiciona a peça ao jogador 2
      }
    }
  }
  

  dragStarted(event: CdkDragStart) {
    const draggedPieceId = event.source.element.nativeElement.id;
    this.draggedPieceIndex = parseInt(draggedPieceId.split('_')[1]);
  }
}
