<template>
    <div>
        <MainSection title="Search" :loading="loading">
            <Head>
                <Title>Search</Title>
            </Head>
            <TweetListFeed :tweets="searchTweets" />
        </MainSection>
    </div>
</template>

<script setup>
const { getTweets: getTweetsComposable } = useTweet();

const loading = ref(false);
const searchTweets = ref([]);
const searchQuery = useRoute().query.q;

watch(
    () => useRoute().fullPath,
    () => getTweets()
);

onBeforeMount(async () => {
    await getTweets();
});

const getTweets = async () => {
    loading.value = true;
    try {
        const { tweets } = await getTweetsComposable({
            query: searchQuery.value,
        });
        searchTweets.value = tweets;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
</script>
