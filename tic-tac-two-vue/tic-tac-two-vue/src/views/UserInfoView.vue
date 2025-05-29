<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import type { OpponentType } from '../types';

const router = useRouter();
const gameStore = useGameStore();

const startGame = (opponentMode: OpponentType) => {
  if (opponentMode) { 
    gameStore.initializeGame(opponentMode);
    router.push('/game');
  }
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
    <p>Select Game Mode:</p>
    <button @click="startGame('human')">Human vs Human</button>
    <button @click="startGame('ai')">Human vs AI</button>
    </div>
</template>

<style scoped>
.user-info-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 40px;
}
.mode-buttons {
  display: flex;
  gap: 15px;
}
button {
  padding: 12px 25px;
  font-size: 1.1em;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
}
button:hover {
  background-color: #e0e0e0;
}
</style>