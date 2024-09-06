<template>
    <div>
        <div v-if="isLoading" class="flex justify-center items-center p-6">
            <UISpinner />
        </div>
        <div v-else>
            <TweetItem :tweet="props.replyTo" v-if="props.showReply && props.replyTo" hideActions />
            <TweetFormInput
                :placeholder="props.placeholder"
                :user="props.user"
                @onSubmit="handleFormSubmit"
            />
        </div>
    </div>
</template>

<script setup>
const emits = defineEmits(["onSuccess"]);
const { postTweet } = useTweet();
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    placeholder: {
        type: String,
        default: "What's happening?",
    },
    replyTo: {
        type: Object,
        default: null,
    },
    showReply: {
        type: Boolean,
        default: false,
    },
});

const isLoading = ref(false);

const handleFormSubmit = async (data) => {
    isLoading.value = true;
    try {
        const response = await postTweet({
            text: data.text,
            mediaFile: data.mediaFile,
            replyTo: props.replyTo?.id,
        });
        console.log(response)
        emits("onSuccess", response.tweet);
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
</script>
