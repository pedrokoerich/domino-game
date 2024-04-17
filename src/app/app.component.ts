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
    const player1 = shuffledPieces.slice(0, numPieces).map(piece => ({ piece, horizontal: false }));
    const player2 = shuffledPieces.slice(numPieces, numPieces * 2).map(piece => ({ piece, horizontal: false }));
    const buy = shuffledPieces.slice(numPieces * 2);

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

  dragStarted(event: CdkDragStart) {
    const draggedPieceId = event.source.element.nativeElement.id;
    this.draggedPieceIndex = parseInt(draggedPieceId.split('_')[1]);
  }
}
