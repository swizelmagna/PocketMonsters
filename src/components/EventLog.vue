<script setup>
import { computed } from 'vue';
import { usePokemonStore } from '@/stores/pokemonStore';

const store = usePokemonStore();

const eventLogs = computed(() => store.eventLogs);

</script>
<template>
    <div class="event-log">
        <h2>Event Log</h2>
        <div v-for="(logMessage, index) in eventLogs" :key="index" class="log">{{ logMessage }}</div>
    </div>
</template>
<style lang="scss" scoped>
.event-log {
    border: 3px solid var(--accent);
    border-radius: 8px;
    background: #33324226;
    padding: 1rem;
    overflow-y: auto;
    font-size: 1rem;
    color: var(--primary);
}
.log {
    background: #5469a54d;
    padding: 10px;
    border-radius: 4px;
    margin: 5px 0;
    text-transform: capitalize;
}
</style>
