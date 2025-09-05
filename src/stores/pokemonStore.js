import { defineStore } from 'pinia';

export const usePokemonStore = defineStore('pokemon', {
    state: () => ({
        currentEncounter: null,
        eventLogs: [],
        throwFailures: 0,
        isThrowing: false,
        collection: []
    }),
    actions: {
        setPokemons(pokemons) {
            this.pokemons = pokemons;
        },
        addLog(message) {
            this.eventLogs.push(message);
        },
        setEncounter(pokemon) {
            this.currentEncounter = pokemon;
        },
        updateEncoutnerDetails(details) {
            if (this.currentEncounter) {
                this.currentEncounter = {
                    ...this.currentEncounter,
                    ...details
                };
            }
        },
        resetEncounter() {
            this.currentEncounter = null;
            this.throwFailures = 0;
        },
        addToCollection() {
            const exists = this.collection.find(
                (p) => p.id === this.currentEncounter.id
            );
            if (exists) return;
            this.collection.push(this.currentEncounter);
        }
    }
});
