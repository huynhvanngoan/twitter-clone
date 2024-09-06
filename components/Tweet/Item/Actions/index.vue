<template>
    <div class="flex items-center justify-evenly w-full">
        <TweetItemActionsIcon
            v-for="(icon, index) in icons"
            :key="index"
            :color="icon.color"
            :size="size"
            @on-click="handleClick(icon.component)"
        >
            <template #icon="{ classes }">
                <component :is="icon.component" :class="classes" />
            </template>

            <template #default v-if="showStats">
                <span>
                    {{
                        icon.component === ChatBubbleOvalLeftEllipsisIcon
                            ? props.tweet.repliesCount
                            : generateRandomNumber()
                    }}
                </span>
            </template>
        </TweetItemActionsIcon>
    </div>
</template>
<script setup>
import {
    ChatBubbleOvalLeftEllipsisIcon,
    ArrowPathIcon,
    HeartIcon,
    ArrowUpOnSquareIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
    tweet: {
        type: Object,
        required: true,
    },
    compact: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["onCommentClick", "onRetweetClick", "onLikeClick", "onShareClick"]);

const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100);
};

const icons = [
    { component: ChatBubbleOvalLeftEllipsisIcon, color: "blue" },
    { component: ArrowPathIcon, color: "green" },
    { component: HeartIcon, color: "red" },
    { component: ArrowUpOnSquareIcon, color: "blue" },
];

const size = computed(() => (props.compact ? 5 : 6));

const showStats = computed(() => props.compact);

const handleClick = (component) => {
    if (component === ChatBubbleOvalLeftEllipsisIcon) {
        emit('onCommentClick');
    } else if (component === ArrowPathIcon) {
        emit('onRetweetClick');
    } else if (component === HeartIcon) {
        emit('onLikeClick');
    } else if (component === ArrowUpOnSquareIcon) {
        emit('onShareClick');
    }
};
</script>
