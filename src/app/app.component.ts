import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface DominoPiece {
  piece: [number, number];
  horizontal: boolean;
  rotation: number; // Propriedade para controlar a rotação das peças
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
              player1.push({ piece, horizontal: false, rotation: 0 });
              player1Counts.set(left, (player1Counts.get(left) ?? 0) + 1);
              player1Counts.set(right, (player1Counts.get(right) ?? 0) + 1);
            } 
            // Distribui a peça para o jogador 2 se ele ainda não atingiu o limite
            else if (player2.length < numPieces) {
              player2.push({ piece, horizontal: false, rotation: 0 });
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
  const targetPiece = this.done[this.done.length - 1]; // Obtém a última peça jogada
  const droppedLeftSide = droppedItem.piece[0];
  const droppedRightSide = droppedItem.piece[1];

  if (event.previousContainer === event.container) {
    const needsRotation = this.canRotatePiece(droppedItem, targetPiece);
    console.log(needsRotation)
    if (needsRotation === true) {
      // Atualiza a propriedade de rotação da peça para -90deg
      droppedItem.rotation = 90;
    } else {
      console.log("TEM QUE ENTRAR AQUI")
      // Caso contrário, a rotação será 0deg
      droppedItem.rotation = -90;
    }

    moveItemInArray(event.container.data, event.previousIndex, targetIndex);
  } else if (targetPiece) { // Verifica se há uma peça alvo
    const targetLeftSide = targetPiece.piece[0];
    const targetRightSide = targetPiece.piece[1];

    const needsRotation = this.canRotatePiece(droppedItem, targetPiece);
    console.log(needsRotation)
    if (needsRotation === true) {
      // Atualiza a propriedade de rotação da peça para -90deg
      droppedItem.rotation = 90;
    } else {
      console.log("TEM QUE ENTRAR AQUI")
      // Caso contrário, a rotação será 0deg
      droppedItem.rotation = -90;
    }

    console.log("droppedRightSide: "+droppedRightSide) 
    console.log("targetLeftSide: "+targetLeftSide) 

    console.log("droppedLeftSide: "+droppedLeftSide) 
    console.log("targetRightSide: "+targetRightSide) 

    if (droppedRightSide === targetLeftSide) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        targetIndex
      );
      droppedItem.horizontal = droppedLeftSide !== droppedRightSide;
    } else if (droppedLeftSide === targetRightSide) {
      const rotatedPiece: [number, number] = [droppedRightSide, droppedLeftSide];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        targetIndex
      );
      event.container.data[targetIndex].piece = rotatedPiece;
      droppedItem.horizontal = true;
    } else if (droppedLeftSide === targetLeftSide) {
      const attachedPiece: [number, number] = [droppedRightSide, targetRightSide];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        targetIndex
      );
      event.container.data[targetIndex].piece = attachedPiece;
      droppedItem.horizontal = true;
    } else if (droppedRightSide === targetRightSide) {
      const attachedPiece: [number, number] = [targetLeftSide, droppedLeftSide];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        targetIndex
      );
      event.container.data[targetIndex].piece = attachedPiece;
      droppedItem.horizontal = true;
    } else {
      alert("Os lados das peças não correspondem. A conexão não é permitida.");
    }
  } else if (this.done.length === 0) { // Verifica se a mesa está vazia
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      targetIndex
    );
    droppedItem.horizontal = droppedLeftSide !== droppedRightSide;
  } else { // Caso contrário
    let canPlacePiece = false;
    const needsRotation = this.canRotatePiece(droppedItem, targetPiece);
    console.log(needsRotation)
    if (needsRotation === true) {
      // Atualiza a propriedade de rotação da peça para -90deg
      droppedItem.rotation = -90;
    } else {
      console.log("TEM QUE ENTRAR AQUI")
      // Caso contrário, a rotação será 0deg
      droppedItem.rotation = 90;
    }
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
        targetIndex
      );
      droppedItem.horizontal = droppedLeftSide !== droppedRightSide;
    } else {
      alert("Não é possível colocar essa peça na mesa.");
    }
  }

  if (this.draggedPieceIndex !== null && targetIndex === this.draggedPieceIndex) {
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
        this.player2.push({ piece: proximaPeca, horizontal: false, rotation: 0 }); // Adiciona a peça ao jogador 2
      }
    } else {
      alert("Você já possui uma peça que pode ser jogada. Não é necessário comprar uma nova.");
    }
  }

  // Função para verificar se uma peça pode ser girada para se conectar corretamente com uma peça adjacente
// Função para verificar se uma peça pode ser girada para se conectar corretamente com uma peça adjacente
canRotatePiece(currentPiece: DominoPiece, adjacentPiece: DominoPiece): boolean {
  const currentLeftSide = currentPiece.piece[0];
  const currentRightSide = currentPiece.piece[1];

  // Verifica se a peça adjacente existe e se tem lados diferentes
  if (adjacentPiece && adjacentPiece.piece && adjacentPiece.piece[0] !== adjacentPiece.piece[1]) {
    const adjacentLeftSide = adjacentPiece.piece[0];
    const adjacentRightSide = adjacentPiece.piece[1];

    // Verifica se os lados da peça atual correspondem aos lados da peça adjacente
    if (currentLeftSide === adjacentLeftSide || currentRightSide === adjacentRightSide) {
      return false; // Não precisa girar a peça
    } else {
      return true; // Precisa girar a peça
    }
  }

  return false; // Retorna falso por padrão se a peça adjacente não existir ou tiver lados iguais
}

  

  dragStarted(event: CdkDragStart) {
    const draggedPieceId = event.source.element.nativeElement.id;
    this.draggedPieceIndex = parseInt(draggedPieceId.split('_')[1]);
  }
}
