<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { ActionType, Direction, GameState } from '../constants';

const gameStore = useGameStore();

const emit = defineEmits(['grid-move']);

const directionButtons: { id: string; text: string; dir: Direction | null }[] = [
    { id: "up-left", text: "↖", dir: Direction.UP_LEFT },
    { id: "up", text: "↑", dir: Direction.UP },
    { id: "up-right", text: "↗", dir: Direction.UP_RIGHT },
    { id: "left", text: "←", dir: Direction.LEFT },
    { id: "center", text: "•", dir: null }, // Non-functional center button
    { id: "right", text: "→", dir: Direction.RIGHT },
    { id: "down-left", text: "↙", dir: Direction.DOWN_LEFT },
    { id: "down", text: "↓", dir: Direction.DOWN },
    { id: "down-right", text: "↘", dir: Direction.DOWN_RIGHT }
];

const isVisible = computed(() => {
    return gameStore.gameState === GameState.PLAYING && 
    gameStore.actionType === ActionType.MOVE_GRID && 
    gameStore.canMoveGrid;
});

const handleDirectionClick = (direction: Direction) => {
  emit('grid-move', direction);
};
</script>

<template>
    <div class="grid-controls-container" v-if="isVisible">
        <div class="direction-grid">
            <button 
                v-for="button in directionButtons" 
                :key="button.id" 
                :id="`dir-${button.id}`"
                class="direction-button"
                :class="{ 'center-button': !button.dir}"
                :disabled="!button.dir"
                @click="button.dir && handleDirectionClick(button.dir)">
                {{ button.text }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.grid-controls-container {
  margin-top: 15px;
  padding: 10px;
  background-color: #ecf0f1;
  border-radius: 8px;
  display: inline-block; 
}

.direction-grid {
  display: grid;
  grid-template-columns: repeat(3, 50px); 
  grid-template-rows: repeat(3, 50px);
  gap: 5px;
}

.direction-button {
  width: 50px;
  height: 50px;
  font-size: 1.5em;
  padding: 0;
  background-color: #7f8c8d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.direction-button:hover:not(:disabled) {
  background-color: #95a5a6;
}

.direction-button.center-button {
  background-color: #bdc3c7;
  cursor: default;
}
.direction-button.center-button:hover {
  background-color: #bdc3c7;
}

.direction-button:disabled {
  background-color: #cacfd2; 
  cursor: default;
  opacity: 0.7;
}
</style>