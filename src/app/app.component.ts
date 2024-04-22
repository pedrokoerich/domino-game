import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface DominoPiece {
  piece: [number, number];
  rotation: number; // Propriedade para controlar a rotação das peças
  margin: number
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
              player1.push({ piece,  rotation: 0, margin: 8});
              player1Counts.set(left, (player1Counts.get(left) ?? 0) + 1);
              player1Counts.set(right, (player1Counts.get(right) ?? 0) + 1);
            } 
            // Distribui a peça para o jogador 2 se ele ainda não atingiu o limite
            else if (player2.length < numPieces) {
              player2.push({ piece,  rotation: 0, margin: 8 });
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
    const targetIndex = event.currentIndex;
    const droppedItem = event.previousContainer.data[event.previousIndex];
    const targetPiece = this.done.length > 0 ? this.done[0] : null; // Peça adjacente à direita
    
    if (targetPiece) { // Verifica se há uma peça adjacente à direita
      const droppedLeftSide = droppedItem.piece[0];
      const droppedRightSide = droppedItem.piece[1];
      const targetLeftSide = targetPiece.piece[0];
      const targetRightSide = targetPiece.piece[1];
      
      console.log(targetPiece) 
      console.log(droppedItem)

      // Verifica se os lados da peça jogada coincidem com os lados das peças adjacentes
      if (droppedRightSide === targetLeftSide) { // Lado direito da peça jogada coincide com o lado esquerdo da peça adjacente
        if (droppedLeftSide !== droppedRightSide) { // Verifica se os lados da peça jogada são diferentes
          droppedItem.rotation = 90;
          droppedItem.margin = 22;
        }
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          targetIndex //indice destino 
        );
      } else if (droppedLeftSide === targetRightSide && targetRightSide === targetLeftSide) { // Lado esquerdo da peça jogada coincide com o lado direito da peça adjacente
        droppedItem.rotation = 90;
        droppedItem.margin = 8;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          targetIndex //indice destino 
        );
      }else if ((droppedLeftSide === targetRightSide || droppedLeftSide === targetLeftSide) && droppedLeftSide === droppedRightSide) {
        droppedItem.margin = 8;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          targetIndex //indice destino 
        );
      }else if (droppedLeftSide === targetRightSide) {
        droppedItem.rotation = 90;
        droppedItem.margin = 22;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          targetIndex //indice destino 
        );
      }else if (droppedLeftSide === targetLeftSide && targetLeftSide !== targetRightSide) {
        droppedItem.rotation = 90;
        droppedItem.margin = 22;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          targetIndex //indice destino 
        );
      } else {
        alert("Os lados das peças não correspondem. A conexão não é permitida.");
      }
    } else if (this.done.length === 0) { // Verifica se a mesa está vazia
      // Deixa a peça deitada se tiver lados diferentes
      if (droppedItem.piece[0] !== droppedItem.piece[1]) {
        droppedItem.rotation = -90;
      }
  
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        targetIndex
      );
    }
  }
  

  comprarPeca() {
    // Verifica se o jogador já possui alguma peça que pode ser jogada
    const isFirstMove = this.done.length === 0;
  
    if (isFirstMove) {
      alert("Você não pode comprar uma peça na primeira jogada. Jogue uma peça da sua mão primeiro.");
      return; // Sai da função sem comprar uma peça
    }
  
    const canPlayPiece = this.player2.some(piece => {
      const leftSide = piece.piece[0];
      const rightSide = piece.piece[1];
      return this.done.some(playAreaPiece => {
        const playAreaLeftSide = playAreaPiece.piece[0];
        const playAreaRightSide = playAreaPiece.piece[1];
        return leftSide === playAreaLeftSide || rightSide === playAreaRightSide;
      });
    });
  
    // Se o jogador não puder jogar nenhuma peça que já possui, compra uma nova peça
    if (!canPlayPiece && this.playAreaData.length > 0) {
      const proximaPeca = this.playAreaData.shift(); // Remove e retorna o próximo elemento da variável 'buy'
      if (proximaPeca) {
        this.player2.push({ piece: proximaPeca,  rotation: 0, margin: 8 }); // Adiciona a peça ao jogador 2
      }
    } else {
      alert("Você já possui uma peça que pode ser jogada. Não é necessário comprar uma nova.");
    }
  }

  dragStarted(event: CdkDragStart) {
    const draggedPieceId = event.source.element.nativeElement.id;
    this.draggedPieceIndex = parseInt(draggedPieceId.split('_')[1]);
  }
}
