<script setup lang="ts">
  import { defineProps } from 'vue';

  import { UiState } from './ui-state';

  const props = defineProps<{
    toggleGrid: (args: any) => void;
    toggleAxis: (args: any) => void;
    toggleProjection: (args: any) => void;
    toggleRotateX: (args: any) => void;
    toggleRotateY: (args: any) => void;
    toggleRotateZ: (args: any) => void;
    showExportModal: (args: any) => void;
    resetViewport: (args: any) => void;
    uiState: UiState;
  }>();
</script>

<template>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-52 border border-primary text-primary">
    <li>
      <a v-on:click="props.toggleGrid" class="flex">
        <span class="flex-1">Grid</span>
        <input type="checkbox" class="toggle toggle-primary" v-model="uiState.gridOn">
      </a>
    </li>
    <li>
      <a v-on:click="props.toggleAxis" class="flex">
        <span class="flex-1">Axis</span>
        <input type="checkbox" class="toggle toggle-primary" v-model="uiState.axisOn">
      </a>
    </li>
    <li>
      <a v-on:click="props.toggleProjection" class="flex">
        <span class="flex-1">Projection</span>
        <input type="checkbox" class="toggle toggle-primary" v-model="uiState.projectEntities">
      </a>
    </li>
    <li>
      <a v-on:click="props.toggleRotateX" class="flex">
        <span class="flex-1">Rotate X</span>
        <input type="checkbox" class="toggle toggle-primary" v-model="uiState.rotateEntitiesX">
      </a>
    </li>
    <li>
      <a v-on:click="props.toggleRotateY" class="flex">
        <span class="flex-1">Rotate Y</span>
        <input type="checkbox" class="toggle toggle-primary" v-model="uiState.rotateEntitiesY">
      </a>
    </li>
    <li>
      <a v-on:click="props.toggleRotateZ" class="flex">
        <span class="flex-1">Rotate Z</span>
        <input type="checkbox" class="toggle toggle-primary" v-model="uiState.rotateEntitiesZ">
      </a>
    </li>
    <li>
      <div class="divider"></div>
    </li>
    <li>
      <a v-on:click="props.resetViewport" class="flex">
        <span class="flex-1">Reset Parameters</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path></svg>
      </a>
    </li>
    <li>
      <div class="divider"></div>
    </li>
    <li>
      <a v-on:click="props.showExportModal" class="flex">
        <span class="flex-1">Export</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24"><path d="M22 4C22 3.44772 21.5523 3 21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4ZM4 15H7.41604C8.1876 16.7659 9.94968 18 12 18C14.0503 18 15.8124 16.7659 16.584 15H20V19H4V15ZM4 5H20V13H15C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13H4V5ZM16 11H13V14H11V11H8L12 6.5L16 11Z" fill="currentColor"></path></svg>
      </a>
    </li>
  </ul>
</template>