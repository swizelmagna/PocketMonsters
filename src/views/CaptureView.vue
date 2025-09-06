<script setup>
import { onMounted } from 'vue';
import { useGameStore } from '@/stores/gameSetupStore';
import ViewFinder from '@/components/ViewFinder.vue';
import EventLog from '@/components/EventLog.vue';
import GameControls from '@/components/GameControls.vue';

const store = useGameStore();

onMounted(() => {
  store.gameStarted = true; // ensures title moves/shrinks if we refresh here
});

</script>
<template>
    <main>
        <div class="game" style="display: flex; gap: 1rem">
            <ViewFinder class="item" />
            <EventLog class="item" />
        </div>
        <div style="padding: 10px 0">
            <GameControls class="controls" />
        </div>
    </main>
</template>

<style lang="scss" scoped>
main {
    padding: 0 1rem;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 70px;

    h1 {
        text-align: center;
        margin-bottom: 1rem;
        flex-shrink: 0;
    }

    .game {
        display: flex;
        gap: 1rem;
        flex: 1 1 auto;
        overflow: hidden;

        .item {
            width: 50%;
            overflow: auto;
        }

        @media (max-width: 600px) {
            flex-direction: column;

            .item {
                width: auto;
                flex: 0 0 auto;
            }

            .viewfinder {
                flex: 0 0 auto;
                min-height: 50%;
            }

            .event-log {
                flex: 1 1 0;
                min-height: 100px;
                max-height: 50vh;
                overflow-y: auto;
            }
        }
    }

    .controls {
        flex-shrink: 0;
    }
}
</style>
