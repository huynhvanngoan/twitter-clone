<template>
    <div>
        <label
            :for="inputId"
            v-if="label"
            class="block pl-3 ml-px text-sm font-medium text-gray-700"
            >{{ label }}</label
        >
        <div class="mt-1">
            <input
                class="block px-4 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                @input="
                    (event) => $emit('update:modelValue', event.target.value)
                "
                :id="inputId"
                :type="type"
                :value="modelValue"
                aria-label="Input field"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const { label, modelValue, placeholder, type } = defineProps({
    label: {
        type: String,
        default: "",
    },
    modelValue: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "text",
    },
});

const inputId = computed(() => `inputField-${type}`);
const autocomplete = computed(() => (type === 'password' ? 'current-password' : ''));
</script>
