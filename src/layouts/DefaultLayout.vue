<script setup>
import { ref, watch, computed, onMounted  } from 'vue';
import { useGameStore } from '@/stores/gameSetupStore';

const store = useGameStore();

const started = ref(false);
const moved = ref(false);

onMounted(() => {
  if (store.gameStarted) {
    if (store.currentScreen === 'capture') {
      started.value = true;
      moved.value = true;
    } else {
      started.value = true;
      moved.value = false;
    }
  }
});

watch(
  () => store.gameStarted,
  (val) => {
    if (val && !started.value) {
      started.value = true;
      setTimeout(() => (moved.value = true), 500);
    }
  }
);
</script>

<template>
  <div class="layout">
    <h1 class="title" :class="{ started, moved }">{{ store.title }}</h1>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;

  .title {
    font-family: var(--poke-font);
    color: var(--white);
    text-shadow: 2px 2px 0px var(--primary);
    font-size: 64px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1); // true center
    transition: transform 0.5s ease, top 0.6s ease;
    will-change: transform, top;
    margin: 0;
    width: max-content;

    &.started {
      transform: translate(-50%, -50%) scale(0.5); // shrink in center
    }

    &.moved {
      top: 0; // move to top
      transform: translate(-50%, 0) scale(0.5);
      width: max-content;
    }
    @media (max-width: 600px) {
      width: auto;
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
