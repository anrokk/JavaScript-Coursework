<script setup lang="ts">
import { onMounted,  watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import GameStatus from '../components/GameStatus.vue'; 
import Board from '../components/Board.vue';
import ActionControls from '../components/ActionControls.vue';
import GridControls from '../components/GridControls.vue';
import { GameState, Direction, ActionType } from '../constants';

const router = useRouter();
const gameStore = useGameStore();

onMounted(() => {
  console.log("GameView mounted. Current state:", gameStore.gameState);
  if (gameStore.gameState === GameState.MENU) {
    console.warn("GameView loaded but game not initialized to PLAYING. Redirecting to menu or initializing might be needed.");
  }
});

watch(() => gameStore.gameState, (newState, oldState) => {
  if (newState === GameState.X_WINS || newState === GameState.O_WINS || newState === GameState.TIE || newState === GameState.GAME_OVER) {
    if (oldState === GameState.PLAYING) { 
        gameStore.stopTimer();
        router.push('/game-over');
    }
  }
});

const handleGridMove = (direction: Direction) => {
  if (gameStore.actionType === ActionType.MOVE_GRID) {
    gameStore.moveGrid(direction);
  }
};

const goToGameOver = () => {
  gameStore.stopTimer();
  gameStore.gameState = GameState.GAME_OVER; 
};

const resetAndGoToMenu = () => {
    gameStore.resetGame(); 
    router.push('/');
}
</script>

<template>
  <div class="game-view">
    <GameStatus />

    <div class="game-area">
      <Board />
    </div>

    <div class="controls-area">
      <ActionControls />
      <GridControls @grid-move="handleGridMove" />
    </div>

    <div class="debug-controls" style="margin-top: 20px;">
        <button @click="resetAndGoToMenu">Reset & Back to Menu</button>
    </div>

  </div>
</template>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-area {
  margin-bottom: 20px;
}
.controls-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px; 
}
button { 
    margin: 5px;
    padding: 8px 12px;
}
</style>