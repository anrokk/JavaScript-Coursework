<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import GameStatus from '../components/GameStatus.vue'; 
import { GameState } from '../constants';

const router = useRouter();
const gameStore = useGameStore();

onMounted(() => {
  if (gameStore.gameState !== GameState.PLAYING && gameStore.gameState !== GameState.GAME_OVER) {
     console.log("GameView mounted. Current state:", gameStore.gameState);
     if (gameStore.gameState === GameState.MENU) { 
        gameStore.initializeGame();
     } else if (gameStore.gameState === GameState.PLAYING) {
     }
  }
});

onUnmounted(() => {
  gameStore.stopTimer();
});

watch(() => gameStore.gameState, (newState) => {
  if (newState === GameState.X_WINS || newState === GameState.O_WINS || newState === GameState.TIE || newState === GameState.GAME_OVER) {
    gameStore.stopTimer(); 
    router.push('/game-over');
  }
});

const goToGameOver = () => {
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
      <p>[Board Placeholder]</p>
    </div>
     <div class="controls-area">
      <p>[Action Controls Placeholder]</p>

      <p>[Grid Controls Placeholder]</p>
    </div>

    <div class="debug-controls" style="margin-top: 20px;">
        <button @click="goToGameOver">Simulate Game Over</button>
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
}
button { 
    margin: 5px;
    padding: 8px 12px;
}
</style>