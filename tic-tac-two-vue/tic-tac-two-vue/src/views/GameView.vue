<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

const goToGameOver = () => {
  
  router.push('/game-over');
};


</script>

<template>
  <div class="game-view">
    <h2>Game View - Tic-Tac-Two</h2>
    <p>Game board and controls will go here.</p>
    <p>Current Player: {{ gameStore.currentPlayer }}</p>
    <p>Status: {{ gameStore.gameStatusMessage }}</p>
    <button @click="goToGameOver">Simulate Game Over</button>
    <button @click="gameStore.resetGame()">Reset Game (from GameView)</button>
  </div>
</template>

<style scoped>
.game-view {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
button {
  margin: 5px;
}
</style>