<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameSetupStore';

const store = useGameStore();
const router = useRouter();

const trainerName = ref('');
const selectedGen = ref(store.generation);

const moved = ref(false);
const hasSavedData = ref(false);

onMounted(() => {
    const saved = localStorage.getItem('trainerName');
    if (saved) {
        trainerName.value = saved;
        hasSavedData.value = true;
    }
});

const startGame = () => {
    if (!trainerName.value.trim()) return;

    localStorage.setItem('trainerName', trainerName.value);

    store.setName(trainerName.value);
    store.generation = selectedGen.value;
    store.fetchPokemons(selectedGen.value);
    store.gameStarted = true;

    hasSavedData.value = true;

    setTimeout(() => {
        moved.value = true;
    }, 500);

    setTimeout(() => {
        router.push('/capture');
    }, 1300);
};
</script>

<template>
    <main class="home">
        <form
            id="form-registration"
            @submit.prevent="startGame"
            :class="{ moved }"
        >
            <label for="trainer-name" class="sr-only">Trainer Name</label>
            <input
                type="text"
                id="trainer-name"
                v-model="trainerName"
                placeholder="Enter your name"
                required
            />

            <select id="generation" v-model="selectedGen">
                <option v-for="gen in 9" :key="gen" :value="gen">
                    Generation {{ gen }}
                </option>
            </select>

            <button type="submit" :disabled="!trainerName.trim()">
                {{ hasSavedData ? 'Continue' : 'Start' }}
            </button>
        </form>
    </main>
</template>

<style lang="scss" scoped>
.home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;

    form {
        display: flex;
        flex-direction: row;
        gap: 16px;
        transition: opacity 0.8s ease;
        bottom: 0;
        position: absolute;
        border: 2px solid var(--white);
        padding: 10px;
        border-radius: 4px;
        border: 2px solid;

        @media (max-width: 600px) {
            flex-flow: column;
            margin-bottom: 5px;
        }

        input,
        select {
            padding: 10px 16px;
            font-size: 16px;
            border: 2px solid #333;
            border-radius: 8px;
            outline: none;
        }

        button {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            background-color: var(--accent);
            color: var(--btn-color);
            transition: background 0.3s ease;
            margin: 0;

            &:hover:enabled {
                filter: brightness(90%);
            }

            &:disabled {
                background: #ccc;
            }
        }
    }

    form.moved {
        opacity: 0;
        pointer-events: none;
    }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.catchview-container {
    background-color: darkgreen;
    width: 100%;
    margin-top: 64px;
    overflow: auto;
    position: fixed;
}
</style>
