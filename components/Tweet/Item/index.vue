<template>
    <div>
        <TweetItemHeader :tweet="props.tweet" />

        <div :class="tweetBodyWrapper">
            <p
                class="flex-shrink w-auto font-medium text-gray-800 dark:text-white"
                :class="textSize"
            >
                {{ props.tweet.text }}
            </p>

            <div
                v-for="image in props.tweet.mediaFiles"
                :key="image.id"
                class="flex my-3 border-2 rounded-2xl"
                :class="twitterBorderColor"
            >
                <img
                    :src="image.url"
                    alt=""
                    class="w-full rounded-2xl object-cover"
                />
            </div>

            <div class="mt-2">
                <TweetItemActions
                    v-if="!props.hideActions"
                    :tweet="props.tweet"
                    :compact="props.compact"
                    @on-comment-click="handleCommentClick"
                    @on-retweet-click="handleRetweetClick"
                    @on-like-click="handleLikeClick"
                    @on-share-click="handleShareClick"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
const { twitterBorderColor } = useTailwindConfig();
const props = defineProps({
    tweet: {
        type: Object,
        required: true,
    },
    compact: {
        type: Boolean,
        default: false,
    },
    hideActions: {
        type: Boolean,
        default: false,
    },
});
const emitter = useEmitter();

const tweetBodyWrapper = computed(() =>
    props.compact ? "ml-16" : "ml-2 mt-4"
);

const textSize = computed(() => (props.compact ? "text-base" : "text-2xl"));

const handleCommentClick = () => {
    emitter.$emit("replyTweet", props.tweet);
};

const handleRetweetClick = () => {
    console.log("retweet click");
};

const handleLikeClick = () => {
    console.log("like click");
};

const handleShareClick = () => {
    console.log("share click");
};
</script>
