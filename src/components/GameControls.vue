<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameSetupStore';
import { usePokemonStore } from '@/stores/pokemonStore';
import ConfirmModal from '@/components/ConfirmModal.vue';
import PokedexModal from '@/components/PokedexModal.vue';

const gameStore = useGameStore();
const pokemonStore = usePokemonStore();
const router = useRouter();

const showQuitModal = ref(false);
const showPokedex = ref(false);
const foundPokemon = ref(null);
const pokedexRef = ref(null);

const pokedexCount = computed(() => {
    if (!pokemonStore.collection) return 0;

    const unique = pokemonStore.collection.filter(
        (pokemon, index, self) =>
            self.findIndex((p) => p.id === pokemon.id) === index
    );

    return unique.length;
});

const isFindDisabled = computed(
    () => !!(foundPokemon.value && foundPokemon.value.name)
);
const isThrowDisabled = computed(() => !foundPokemon.value);
const isIgnoreDisabled = computed(() => {
    return !foundPokemon.value || pokemonStore.isThrowing;
});

const findPokemon = () => {
    const pokemons = gameStore.pokemons;
    if (pokemons && pokemons.length > 0) {
        const randomIndex = Math.floor(Math.random() * pokemons.length);
        const pokemon = { ...pokemons[randomIndex] };
        pokemon.id = pokemon.url.split('/').filter(Boolean).pop();

        foundPokemon.value = pokemon;

        pokemonStore.setEncounter &&
            pokemonStore.setEncounter(foundPokemon.value);
        pokemonStore.addLog &&
            pokemonStore.addLog(
                `${gameStore.trainerName} found ${foundPokemon.value.name}`
            );
    }
};

const throwPokeball = () => {
    if (!foundPokemon.value) {
        pokemonStore.addLog &&
            pokemonStore.addLog('No Pokémon to throw a ball at.');
        return;
    }

    pokemonStore.isThrowing = true;
    pokemonStore.addLog &&
        pokemonStore.addLog(
            `${gameStore.trainerName} throws ball at ${foundPokemon.value.name}`
        );
    const catchSuccess = Math.random() < 2 / 3;
    if (catchSuccess) {
        pokemonStore.addLog &&
            pokemonStore.addLog(`Caught a ${foundPokemon.value.name}!`);
        pokemonStore.addToCollection && pokemonStore.addToCollection();
        resetEncounter();
    } else {
        pokemonStore.throwFailures += 1;
        if (pokemonStore.throwFailures >= 2) {
            pokemonStore.addLog &&
                pokemonStore.addLog(
                    `${foundPokemon.value.name} ran away after too many failed attempts.`
                );
            resetEncounter();
            return;
        }
        pokemonStore.addLog &&
            pokemonStore.addLog(
                `${foundPokemon.value.name} broke free! Try again.`
            );
        pokemonStore.isThrowing = false;
    }
};
const ignorePokemon = () => {
    pokemonStore.addLog && pokemonStore.addLog('Ignored a Pokémon.');
    resetEncounter();
};
const confirmQuit = () => {
    resetEncounter();
    localStorage.setItem('trainerName', gameStore.trainerName);
    localStorage.setItem(
        'trainerCollection',
        JSON.stringify(pokemonStore.collection)
    );
    localStorage.setItem('gameState', JSON.stringify(gameStore.state));
    router.push('/');
};
const resetEncounter = () => {
  foundPokemon.value = null
  pokemonStore.resetEncounter()
  pokemonStore.throwFailures = 0
  pokemonStore.isThrowing = false
}
</script>

<template>
    <form id="form-controls">
        <fieldset>
            <legend class="sr-only">Controls</legend>
            <button
                name="btn-find"
                :disabled="isFindDisabled"
                @click.prevent="findPokemon"
                aria-label="Find a Pokémon"
            >
                Find
            </button>
            <button
                name="btn-throw"
                :disabled="isThrowDisabled"
                @click.prevent="throwPokeball"
                aria-label="Throw a Pokéball at the current Pokémon"
            >
                Throw
            </button>
            <button
                name="btn-ignore"
                :disabled="isIgnoreDisabled"
                @click.prevent="ignorePokemon"
                aria-label="Ignore the current Pokémon"
            >
                Ignore
            </button>
            <button 
                name="btn-collection" 
                @click.prevent="showPokedex = true" 
                aria-label="Open Pokedex modal">
                Pokedex ({{ pokedexCount }})
            </button>
            <PokedexModal :show="showPokedex" @close="showPokedex = false" ref="pokedexRef"/>
            <button name="btn-quit" @click.prevent="showQuitModal = true" aria-label="Quit game">
                Quit
            </button>
            <ConfirmModal
                :show="showQuitModal"
                message="Are you sure you want to quit the game?"
                @confirm="confirmQuit"
                @cancel="showQuitModal = false"
            />
        </fieldset>
    </form>
</template>

<style lang="scss" scoped>
#form-controls {
    fieldset {
        border: 2px solid var(--white);
        border-radius: 8px;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 0;

        button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            transition: background 0.3s;
            flex: 1 1 auto;
            border: 2px solid var(--text-light);
        }
    }
}
</style>
