<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();
</script>

<template>
  <div class="game-status">
    <div id="status-message" class="status">{{ gameStore.gameStatusMessage }}</div>
    <div id="timer" class="timer">Time: {{ gameStore.formattedElapsedTime }}</div>
  </div>
</template>

<style scoped>
.game-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #ecf0f1;
  border-radius: 8px;
  margin-bottom: 20px;
  min-height: 40px; 
}

.status {
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
}

.timer {
  margin-left: 50px;
  font-size: 1.1em;
  color: #7f8c8d;
}
</style>
