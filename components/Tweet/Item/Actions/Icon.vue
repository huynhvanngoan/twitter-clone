<template>
    <div @click.stop.prevent="emit('onClick')" class="flex items-center text-gray-400 cursor-pointer group">
        <div
            :class="`p-2 pr-auto group-hover:bg-${props.color}-100 group-hover:text-${props.color}-400 rounded-full dark:g roup-hover:bg-opacity-20 ${defaultTransition}`"
        >
            <slot name="icon" :classes="`size-${props.size}`" />
        </div>

        <span :class="`ml-1 group-hover:text-${props.color}-400`">
            <slot />
        </span>
    </div>
</template>

<script setup>
const { defaultTransition } = useTailwindConfig();

const emit = defineEmits(["onClick"]);

const props = defineProps({
    color: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 5,
    },
});
</script>
