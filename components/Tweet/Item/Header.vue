<template>
    <div class="p-4 flex">
        <div class="flex items-center">
            <img
                :src="author.profileImage"
                alt=""
                class="size-10 rounded-full"
            />
        </div>
        <div class="flex ml-3 items-center">
            <span class="font-medium text-gray-800 dark:text-white">
                {{ author.name }}
            </span>
            <span class="ml-3 text-sm font-medium text-gray-400">
                <NuxtLink to="/">
                    {{ `${author.handle}` }}
                </NuxtLink>
                . {{ props.tweet.postedAtHuman }}
            </span>

            <p v-if="props.tweet.replyTo" class="text-sm">
                <span class="text-gray-500"> Replying to </span>

                <NuxtLink :to="replyToTweetUrl" class="text-blue-400">
                    {{ props.tweet.replyTo.author.handle }}
                </NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    tweet: {
        type: Object,
        required: true,
    },
});

const author = props.tweet.author;
const replyToTweetUrl = computed(() => `/status/${props.tweet.replyTo.id}`);
</script>
