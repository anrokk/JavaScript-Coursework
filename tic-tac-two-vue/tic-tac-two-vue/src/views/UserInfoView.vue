<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

const startGame = () => {
  gameStore.initializeGame();
  router.push('/game');
};

// const startGameVsAi = () => {
//   gameStore.resetGame();
//   // gameStore.setOpponentType('ai');
//   router.push('/game');
// };
</script>

<template>
  <div class="user-info-view">
    <h1>Tic-Tac-Two</h1>
    <p>Welcome! Set up your game.</p>
    <button @click="startGame">Start Game</button>
    </div>
</template>

<style scoped>
.user-info-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}
</style>