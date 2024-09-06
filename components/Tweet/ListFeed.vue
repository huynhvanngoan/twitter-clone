<template>
    <div>
        <div v-if="isEmptyArray" class="">
            <p class="text-gray-500 text-center p-4">No tweets found</p>
        </div>
        <div
            v-else
            class="pb-4 border-b hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300"
            v-for="tweet in props.tweets"
            :key="tweet.id"
            :class="[tweetBorderColor, defaultTransition]"
            @click.native="redirect(tweet)"
        >
            <TweetItem :tweet="tweet" compact/>
        </div>
    </div>
</template>

<script setup>
const { tweetBorderColor, defaultTransition } = useTailwindConfig();
const props = defineProps({
    tweets: {
        type: Array,
        required: true,
    },
});

const isEmptyArray = computed(() => props.tweets.length === 0);

const redirect = (tweet) => {
    navigateTo(`/status/${tweet.id}`);
};
</script>
