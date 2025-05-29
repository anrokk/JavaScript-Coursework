<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { ActionType, GameState } from '../constants';

const gameStore = useGameStore();

const selectAction = (action: ActionType) => {
  gameStore.setActionType(action);
};

const canSelectPlaceAction = computed(() => {
  return gameStore.gameState === GameState.PLAYING && gameStore.playerPieces[gameStore.currentPlayer] < 3;
});

const canSelectMovePieceAction = computed(() => {
  return gameStore.gameState === GameState.PLAYING && gameStore.playerPieces.X >= 3 && gameStore.playerPieces.O >= 3;
});

const canSelectMoveGridAction = computed(() => {
  return gameStore.gameState === GameState.PLAYING && gameStore.canMoveGrid;
});
</script>

<template>
  <div class="action-controls">
    <button
      id="place-button"
      class="action-button"
      :class="{ active: gameStore.actionType === ActionType.PLACE }"
      :disabled="!canSelectPlaceAction"
      @click="selectAction(ActionType.PLACE)"
    >
      Place Piece ({{ 3 - gameStore.playerPieces[gameStore.currentPlayer] }} left)
    </button>
    <button
      id="move-button"
      class="action-button"
      :class="{ active: gameStore.actionType === ActionType.MOVE_PIECE }"
      :disabled="!canSelectMovePieceAction"
      @click="selectAction(ActionType.MOVE_PIECE)"
    >
      Move Piece
    </button>
    <button
      id="grid-button"
      class="action-button"
      :class="{ active: gameStore.actionType === ActionType.MOVE_GRID }"
      :disabled="!canSelectMoveGridAction"
      @click="selectAction(ActionType.MOVE_GRID)"
    >
      Move Grid
    </button>
  </div>
</template>

<style scoped>
.action-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.action-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 120px;
}

.action-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.action-button:active:not(:disabled) {
  transform: translateY(1px);
}

.action-button.active {
  background-color: #e67e22;
  box-shadow: 0 0 5px #e67e22, inset 0 0 5px rgba(0,0,0,0.2);
}

.action-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>