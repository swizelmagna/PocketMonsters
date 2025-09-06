<script setup>
import { computed, ref } from 'vue';
import { usePokemonStore } from '@/stores/pokemonStore';

const store = usePokemonStore();
const props = defineProps({ show: Boolean });
const emit = defineEmits(['close']);

const sortKey = ref('id');
const activeFilters = ref([]);

const availableTypes = computed(() => {
    const types = new Set();
    store.collection.forEach((p) => p.types?.forEach((t) => types.add(t)));
    return Array.from(types);
});

const uniquePokemon = computed(() => {
    const map = {};
    store.collection.forEach((p) => {
        map[p.id] = map[p.id] || { ...p, count: 0 };
        map[p.id].count += 1;
    });
    return Object.values(map);
});

const filteredPokemon = computed(() => {
    if (!activeFilters.value.length) return uniquePokemon.value;
    return uniquePokemon.value.filter((p) =>
        p.types.some((t) => activeFilters.value.includes(t))
    );
});

const sortedPokemon = computed(() => {
    return [...filteredPokemon.value].sort((a, b) => {
        if (sortKey.value === 'name') return a.name.localeCompare(b.name);
        return a[sortKey.value] - b[sortKey.value];
    });
});

const uniqueCount = computed(() => sortedPokemon.value.length);
const totalCount = computed(() =>
    sortedPokemon.value.reduce((acc, p) => acc + p.count, 0)
);

const closeModal = () => emit('close');
</script>

<template>
    <div v-if="props.show" class="modal-overlay">
        <div class="modal">
            <header>
                <h2>Pokédex</h2>
                <p>
                    {{ uniqueCount }} unique Pokémon | Total captured:
                    {{ totalCount }}
                </p>
            </header>

            <div class="controls">
                <div class="sort">
                    <label
                        >Sort by:
                        <select v-model="sortKey">
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="height">Height</option>
                            <option value="speed">Speed</option>
                        </select>
                    </label>
                </div>

                <div class="filters">
                    <span>Filter by Type:</span>
                    <div class="type-options">
                        <label
                            v-for="type in availableTypes"
                            :key="type"
                            class="type-label"
                        >
                            <input
                                type="checkbox"
                                :value="type"
                                v-model="activeFilters"
                            />
                            {{ type }}
                        </label>
                    </div>
                </div>
            </div>

            <div class="gallery">
                <div
                    v-for="poke in sortedPokemon"
                    :key="poke.id"
                    class="pokemon-card"
                >
                    <div class="img-wrapper">
                        <img :src="poke.img" :alt="poke.name" />
                    </div>
                    <div class="info">
                        <h3>{{ poke.name }}</h3>
                        <p><strong>ID:</strong> {{ poke.id }}</p>
                        <p><strong>Height:</strong> {{ poke.height }}</p>
                        <p>
                            <strong>Speed:</strong>
                            {{
                                poke.stats?.find((s) => s.stat.name === 'speed')
                                    ?.base_stat || '-'
                            }}
                        </p>
                        <p><strong>Captured:</strong> {{ poke.count }}</p>
                    </div>
                </div>
            </div>

            <div class="footer">
                <button @click="closeModal">Close</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: var(--background);
    color: var(--text);
    border-radius: 12px;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

    header {
        text-align: center;
        margin-bottom: 1rem;

        h2 {
            font-size: 1.8rem;
            margin: 0;
            color: var(--secondary);
        }

        p {
            font-size: 0.9rem;
            color: var(--text-grey);
            margin: 4px 0 0;
        }
    }

    .controls {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;

        .sort {
            flex: 1;
            label {
                font-weight: bold;
            }
            select {
                margin-left: 0.5rem;
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid var(--border);
            }
        }

        .filters {
            flex: 2;
            span {
                display: block;
                font-weight: bold;
                margin-bottom: 0.3rem;
            }
            .type-options {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                .type-label {
                    background: var(--accent);
                    color: var(--white);
                    padding: 2px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    text-transform: capitalize;
                    input {
                        margin-right: 4px;
                    }
                }
            }
        }
    }

    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;

        .pokemon-card {
            background: var(--btn-color);
            border: 2px solid var(--text-grey);
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
            padding: 10px;
            display: flex;
            flex-direction: column;
            transition:
                transform 0.2s,
                box-shadow 0.2s;

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            .img-wrapper {
                height: 120px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 8px;

                img {
                    max-height: 100%;
                    max-width: 100%;
                }
            }

            .info h3 {
                margin: 4px 0;
                text-transform: capitalize;
                color: var(--secondary);
            }

            .info p {
                margin: 2px 0;
                font-size: 0.85rem;
            }
        }
    }

    .footer {
        margin-top: 1rem;
        text-align: center;

        button {
            padding: 8px 16px;
            font-weight: bold;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            background: var(--accent);
            color: var(--white);
            transition: background 0.3s;
            &:hover {
                filter: brightness(90%);
            }
        }
    }

    @media (max-width: 600px) {
        .controls {
            flex-direction: column;
            gap: 0.5rem;
        }
        .gallery {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
    }
}
</style>
