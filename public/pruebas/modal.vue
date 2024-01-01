<script setup>
import { ref } from 'vue'

const message = ref('This is a modal popup');
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>
<template>
  <div class="popup" @click.self="closeModal">
    <div class="popup-content">
      <div class="popup-header">
        <h2 class="popup-title">{{ message }}</h2>
        <button class="popup-close-button" @click.prevent="closeModal">X</button>
      </div>
      <article>
        <div class="popup-content-text">
          This is a simple modal popup in Vue.js
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const message = ref('This is a modal popup');
const emit = defineEmits(['close']);
const closeModal = () => {
 emit('close');
};
</script>