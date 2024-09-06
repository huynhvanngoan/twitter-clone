<template>
    <div>
        <MainSection title="Tweet" :loading="loading">
            <Head>
                <Title></Title>
            </Head>

            <!-- Ensure both tweet and user are available before rendering TweetDetails -->
            <TweetDetails :tweet="tweet" :user="user" />
        </MainSection>
    </div>
</template>

<script setup>

const { getTweetById } = useTweet();
const loading = ref(false);
const tweet = ref(null);

const { useAuthUser } = useAuth();
const user = useAuthUser();

watch(() => useRoute().fullPath, () => getTweet());

const getTweetIdFromRoute = () => {
    return useRoute().params.id;
};

const getTweet = async () => {
    loading.value = true;
    try {
        const response = await getTweetById(getTweetIdFromRoute());
        tweet.value = response.tweet;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};

onBeforeMount(() => {
     getTweet();
});
</script>
