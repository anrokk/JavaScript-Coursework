<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import Cell from './Cell.vue';
import { ActionType, GameState } from '../constants';

const gameStore = useGameStore();

const isSelected = (rowIndex: number, colIndex: number): boolean => {
    if (!gameStore.selectedPiece) return false;
    return gameStore.selectedPiece.y === rowIndex && gameStore.selectedPiece.x === colIndex;
}

const isCellInteractive = (rowIndex: number, colIndex: number): boolean => {
  if (gameStore.gameState !== GameState.PLAYING) return false;
  return gameStore.isValidCellForCurrentAction(rowIndex, colIndex);
};

const handleCellClick = (coords: { row: number; col: number }) => {
  if (gameStore.gameState !== GameState.PLAYING) return;
  if (gameStore.actionType === ActionType.PLACE) {
    gameStore.makeAMove(coords.row, coords.col);
  } else if (gameStore.actionType === ActionType.MOVE_PIECE) {
    if (gameStore.selectedPiece) { 
      gameStore.makeAMove(coords.row, coords.col);
    } else { 
      gameStore.selectPieceToMove(coords.row, coords.col);
    }
  }
};
</script>

<template>
  <div class="board">
    <template v-for="(row, rowIndex) in gameStore.board" :key="rowIndex">
      <Cell
        v-for="(cellValue, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :value="cellValue"
        :row="rowIndex"
        :col="colIndex"
        :is-active-in-grid="gameStore.isCellInActiveGrid(rowIndex, colIndex)"
        :is-selected="isSelected(rowIndex, colIndex)"
        :is-interactive="isCellInteractive(rowIndex, colIndex)"
        @cell-click="handleCellClick"
      />
    </template>
  </div>
</template>


<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(5, 60px); 
  grid-template-rows: repeat(5, 60px);
  gap: 5px; 
  background-color: #bdc3c7; 
  padding: 10px;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
  width: fit-content; 
  margin: 0 auto; 
}
</style>