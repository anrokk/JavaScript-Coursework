<script setup lang="ts">
import type { PropType } from 'vue';
import type { BoardCellValue } from '../types';

const props = defineProps({
    value: {
        type: String as PropType<BoardCellValue>,
        default: null
    },
    row: {
        type: Number,
        required: true
    },
    col: {
        type: Number,
        required: true
    },
    isInteractive: {
        type: Boolean,
        default: true
    },
    isActiveInGrid: {
        type: Boolean,
        default: false
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['cell-click']);

const handleClick = () => {
    if (props.isInteractive){
        emit('cell-click', { row: propps.row, col: props.col });
    }
}
</script>

<template>
  <div
    class="cell"
    :class="{
      'active-grid': isActiveInGrid,
      'selected': isSelected,
      'player-x': value === 'X',
      'player-o': value === 'O',
      'interactive': isInteractive
    }"
    @click="handleClick"
  >
    {{ value || '' }}
  </div>
</template>

<style scoped>
.cell {
  width: 60px;
  height: 60px;
  background-color: #ecf0f1;
  border: 1px solid #95a5a6;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  font-weight: bold;
  user-select: none;
  transition: background-color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}

.cell.interactive {
  cursor: pointer;
}

.cell.interactive:hover {
  background-color: #dfe6e9;
}

.cell.active-grid {
  border: 2px solid #3498db;
}

.cell.selected {
  background-color: #f1c40f;
  border-color: #f39c12;
  transform: scale(1.05);
}

.cell.player-x {
  color: #e74c3c;
}

.cell.player-o {
  color: #2980b9;
}
</style>