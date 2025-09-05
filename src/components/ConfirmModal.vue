<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    show: Boolean,
    message: { type: String, default: 'Are you sure?' }
});

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => emit('confirm');
const onCancel = () => emit('cancel');
</script>

<template>
    <div v-if="props.show" class="modal-overlay">
        <div class="modal">
            <p>{{ props.message }}</p>
            <button class="primary" @click="onConfirm">Yes</button>
            <button class="secondary" @click="onCancel">No</button>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal {
    background: var(--background);
    color: var(--text);
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
}
</style>
