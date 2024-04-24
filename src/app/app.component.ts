import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface DominoPiece {
  piece: [number, number];
  rotation: number; // Propriedade para controlar a rotação das peças
  margin: number;
  orientation: string;
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
  public message: string = '';

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
              player1.push({ piece,  rotation: 0, margin: 8, orientation: ''});
              player1Counts.set(left, (player1Counts.get(left) ?? 0) + 1);
              player1Counts.set(right, (player1Counts.get(right) ?? 0) + 1);
            } 
            // Distribui a peça para o jogador 2 se ele ainda não atingiu o limite
            else if (player2.length < numPieces) {
              player2.push({ piece,  rotation: 0, margin: 8, orientation: ''});
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
    const pieceFreeLeft = this.done && this.done.length > 0 ? { piece: this.done[0].piece, orientation: this.done[0].orientation } : null;
    const pieceFreeRight = this.done && this.done.length > 0 ? { piece: this.done[this.done.length-1].piece, orientation:this.done[this.done.length-1].orientation } : null;
    
    const droppedLeftSide = droppedItem.piece[0];
    const droppedRightSide = droppedItem.piece[1];

    console.log(pieceFreeLeft)
    console.log(pieceFreeRight)

    //se a mesa possuir peças
    if (targetPiece) {
      //AQUI SÃO VALIDAÇÃO DA EXTREMIDADE ESQUERDA
      //se o lado de cima da peça jogada for igual ao lado de cima da peça que está na extremidade esquerda da mesa
      if ((pieceFreeLeft && pieceFreeRight) && (droppedLeftSide === pieceFreeLeft.piece[0]) && (pieceFreeLeft.orientation === 'left' || pieceFreeLeft.orientation === '')) {
        //se a peça da extremidade estiver rotacionada pra esquerda
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = 90;
          droppedItem.orientation = 'right';
          droppedItem.margin = 15;
        }
        let index = 0;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );

      }else if ((pieceFreeLeft && pieceFreeRight) && (droppedRightSide === pieceFreeLeft.piece[0]) && (pieceFreeLeft.orientation === 'left' || pieceFreeLeft.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = -90;
          droppedItem.orientation = 'left';
          droppedItem.margin = 15;
        }
        let index = 0;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );
      }else if  ((pieceFreeLeft && pieceFreeRight) && (droppedLeftSide === pieceFreeLeft.piece[1]) && (pieceFreeLeft.orientation === 'right' || pieceFreeLeft.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = 90;
          droppedItem.orientation = 'right';
          droppedItem.margin = 15;
        
        }
        let index = 0;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );

      }else if  ((pieceFreeLeft && pieceFreeRight) && (droppedRightSide === pieceFreeLeft.piece[1]) && (pieceFreeLeft.orientation === 'right' || pieceFreeLeft.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        } else {
          droppedItem.rotation = -90;
          droppedItem.orientation = 'left';
          droppedItem.margin = 15;
        }
        let index = 0;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );

      //AQUI SÃO VALIDAÇÃO DA EXTREMIDADE DIREITA
      }else if ((pieceFreeLeft && pieceFreeRight) && (droppedLeftSide === pieceFreeRight.piece[0]) && (pieceFreeRight.orientation === 'right' || pieceFreeRight.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = -90;
          droppedItem.orientation = 'left';
          droppedItem.margin = 15;
        }
        let index = this.done.length;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );
      }else if ((pieceFreeLeft && pieceFreeRight) && (droppedRightSide === pieceFreeRight.piece[0]) && (pieceFreeRight.orientation === 'right' || pieceFreeRight.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = 90;
          droppedItem.orientation = 'right';
          droppedItem.margin = 15;
        }
        let index = this.done.length;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );
      }else if ((pieceFreeLeft && pieceFreeRight) && (droppedLeftSide === pieceFreeRight.piece[1]) && (pieceFreeRight.orientation === 'left' || pieceFreeRight.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = -90;
          droppedItem.orientation = 'left';
          droppedItem.margin = 15;
        }
        let index = this.done.length;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );
      }else if ((pieceFreeLeft && pieceFreeRight) && (droppedRightSide === pieceFreeRight.piece[1]) &&  (pieceFreeRight.orientation === 'left' || pieceFreeRight.orientation === '')) {
        if (droppedLeftSide === droppedRightSide) {
          droppedItem.rotation = 0;
          droppedItem.orientation = '';
          droppedItem.margin = 4;
        }else {
          droppedItem.rotation = 90;
          droppedItem.orientation = 'right';
          droppedItem.margin = 15;
        }
        let index = this.done.length;
        transferArrayItem(
          event.previousContainer.data, //mão do jogador
          event.container.data, //mesa
          event.previousIndex, //indice origem 
          index //indice destino 
        );
      }else {
        this.message = "Não é possível jogar esta peça nesta posição."
        this.openModal();
      }

    } else if (this.done.length === 0) { // Verifica se a mesa está vazia
      // Deixa a peça deitada se tiver lados diferentes
      if (droppedItem.piece[0] !== droppedItem.piece[1]) {
        droppedItem.rotation = -90; //Left
        droppedItem.orientation = 'left';
        droppedItem.margin = 15;
      }else {
        droppedItem.rotation = 0;
        droppedItem.orientation = '';
        droppedItem.margin = 4;
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
      this.message = 'Você não pode comprar uma peça na primeira jogada. Jogue uma peça da sua mão primeiro.'
      this.openModal();
      return; // Sai da função sem comprar uma peça
    }

    // Verifica se o jogador pode jogar alguma peça
    const canPlayPiece = this.player2.some(piece => {
      const leftSide = piece.piece[0];
      const rightSide = piece.piece[1];
      const pieceOrientation = piece.orientation; // Obtém a orientação da peça

      // Obtém as peças das extremidades da mesa
      const playAreaLeftPiece = this.done[0]?.piece;
      const playAreaRightPiece = this.done[this.done.length - 1]?.piece;

      // Verifica se a peça pode ser jogada na mesa com base na orientação
      return (
        (pieceOrientation === 'left' && (leftSide === playAreaLeftPiece[0] || rightSide === playAreaLeftPiece[0])) ||
        (pieceOrientation === 'right' && (leftSide === playAreaRightPiece[1] || rightSide === playAreaRightPiece[1])) ||
        (!pieceOrientation && (
          (leftSide === playAreaLeftPiece[0] || rightSide === playAreaLeftPiece[0]) ||
          (leftSide === playAreaRightPiece[1] || rightSide === playAreaRightPiece[1])
        ))
      );
    });

    // Se o jogador não puder jogar nenhuma peça que já possui, compra uma nova peça
    if (!canPlayPiece && this.playAreaData.length > 0) {
      const proximaPeca = this.playAreaData.shift(); // Remove e retorna o próximo elemento da variável 'buy'
      if (proximaPeca) {
        this.player2.push({ piece: proximaPeca,  rotation: 0, margin: 8, orientation: '' }); // Adiciona a peça ao jogador 2
      }
    } else if (canPlayPiece) {
      this.message = "Você já possui uma peça que pode ser jogada. Não é necessário comprar uma nova.";
    } else {
      this.message = "Não há mais peças disponíveis para compra.";
    }
    this.openModal();
  }

  closeModal() {
    let modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "none"; // Oculta o modal
    }
  }

  openModal() {
    let modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "block"; // Oculta o modal
    }
  }

  dragStarted(event: CdkDragStart) {
    const draggedPieceId = event.source.element.nativeElement.id;
    this.draggedPieceIndex = parseInt(draggedPieceId.split('_')[1]);
  }


}
