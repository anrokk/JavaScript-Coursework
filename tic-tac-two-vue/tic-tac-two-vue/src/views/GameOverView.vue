<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

const playAgain = () => {
  gameStore.initializeGame();
  router.push('/game');
};

const goToMenu = () => {
  gameStore.resetGame(); 
  router.push('/');
};
</script>

<template>
  <div class="game-over-view">
    <h2>Game Over!</h2>
    <p>{{ gameStore.gameStatusMessage }}</p>
    <button @click="playAgain">Play Again</button>
    <button @click="goToMenu">Back to Menu</button>
  </div>
</template>

<style scoped>
.game-over-view {
  text-align: center;
}
button {
  margin: 10px;
  padding: 10px 15px;
  font-size: 1em; 
  cursor: pointer;
}
</style>