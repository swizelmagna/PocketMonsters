<template>
    <div class="viewfinder">
        <h2 class="name" v-if="pokemon">{{ pokemon?.name }}</h2>
        <div class="detailsContainer" v-if="pokemon && stats">
            <div class="imageContainer">
                <img
                    v-if="imgSrc"
                    class="image"
                    :src="imgSrc"
                    :alt="pokemon?.name"
                />
            </div>
            <div class="details">
                <ul>
                    <li><strong>Name:</strong> {{ pokemon?.name }}</li>
                    <li><strong>Type:</strong> {{ types.join(', ') }}</li>
                    <li><strong>Height:</strong> {{ height }}</li>
                    <li v-for="stat in stats.slice(0, 2)" :key="stat.stat.name">
                        <strong>{{ stat.stat.name }}:</strong>
                        {{ stat.base_stat }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemonStore';

const store = usePokemonStore();
const pokemon = computed(() => store.currentEncounter);
const stats = ref(null);
const imgSrc = ref('');
const types = ref([]);
const height = ref(null);
const url = 'https://pokeapi.co/api/v2/pokemon/';

watch(pokemon, (newVal, oldVal) => {
    if (newVal?.id !== oldVal?.id) {
        if (newVal && newVal.url) {
            getPokeData(newVal.id);
        } else {
            stats.value = null;
            imgSrc.value = '';
            types.value = [];
            height.value = null;
        }
    }
});

const getPokeData = (id) => {
    fetch(url + id)
        .then((res) => res.json())
        .then((data) => {
            stats.value = data.stats;
            imgSrc.value = data.sprites.front_default || data.sprites.other.dream_world.front_default;
            types.value = data.types.map((t) => t.type.name);
            height.value = data.height;
            store.updateEncoutnerDetails({
                stats: data.stats,
                img: imgSrc.value,
                types: types.value,
                height: data.height
            });
        });
};
</script>

<style lang="scss" scoped>
.viewfinder {
    align-items: flex-start;
    gap: 1rem;
    border: 3px solid var(--accent);
    border-radius: 8px;
    background: var(--primary);
    color: var(--background);
    padding: 1rem;
    min-height: 250px;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
}

.detailsContainer {
    display: flex;
    @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
}

.imageContainer {
    flex: 0 0 50%;
    display: flex;
    justify-content: center;

    @media (max-width: 600px) {
        width: 100%;
    }
}

.image {
    max-width: 90%;
    max-height: 250px;
}

.details {
    flex: 1;
    margin: 0 0 0.5rem;
    color: var(--text);
    text-transform: capitalize;
    background-color: var(--btn-disabled-bg);
    border-radius: 4px;
    padding: 15px;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;

        li {
            margin: 0.25rem 0;
            @media (max-width: 600px) {
                width: 100%;
            }
        }
        @media (max-width: 600px) {
            flex-direction: row;
        }
    }
}

.name {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    color: var(--secondary);
    text-transform: uppercase;
    text-align: center;
    background-color: var(--btn-disabled-bg);
    border-radius: 4px;
    padding: 5px;
}
</style>
