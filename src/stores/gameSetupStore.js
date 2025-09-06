import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useGameStore = defineStore('game', () => {
    const title = ref('Pocket Monsters!');
    const generation = ref(1);
    const pokemons = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const gameStarted = ref(false);

    const trainerName = ref(localStorage.getItem('trainerName') || '');

    async function fetchPokemons(gen = generation.value) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/generation/${gen}`
            );
            if (!response.ok) throw new Error('Failed to fetch pokemons');
            const data = await response.json();
            pokemons.value = data.pokemon_species || [];
            generation.value = gen;
        } catch (err) {
            error.value = err.message;
            pokemons.value = [];
        } finally {
            loading.value = false;
        }
    }

    function setName(name) {
        trainerName.value = name;
        localStorage.setItem('trainerName', name);
    }

    watch(generation, (newGen, oldGen) => {
        if (newGen !== oldGen) {
            fetchPokemons(newGen);
        }
    });

    fetchPokemons();

    return {
        title,
        generation,
        pokemons,
        loading,
        error,
        fetchPokemons,
        trainerName,
        setName,
        gameStarted
    };
});
