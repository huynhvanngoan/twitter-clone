<template>
    <div v-if="tweet">
        <!-- Render tweet details -->
        <TweetItem :tweet="props.tweet" :user="props.user" />
        <TweetForm
            :placeholder="`Tweet your reply`"
            :replyTo="props.tweet"
            :user="props.user"
            @on-success="handleFormSuccess"
        />

        <TweetListFeed :tweets="replies" />
    </div>
    <div v-else>
        <!-- Handle the case where tweet is null -->
        <p>No tweet available.</p>
    </div>
</template>

<script setup>
const props = defineProps({
    tweet: {
        type: Object,
        required: false,
        default: null,
    },
    user: {
        type: Object,
        required: true,
    },
});

const replies = computed(() => props.tweet?.replies || []);

const handleFormSuccess = (tweet) => {
    navigateTo({
        path: `/status/${tweet.id}`,
    });
};
</script>
