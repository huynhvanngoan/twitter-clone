<template>
    <div>
        <MainSection title="Home" :loading="loading">
            <Head>
                <Title>Home / Twitter</Title>
            </Head>
            <div class="border-b" :class="twitterBorderColor">
                <TweetForm :user="user" @on-success="handleFormSuccess" />
            </div>
            <TweetListFeed :tweets="homeTweets" />
        </MainSection>
    </div>
</template>

<script setup>
import { onBeforeMount } from "vue";

const { twitterBorderColor } = useTailwindConfig();
const { getTweets } = useTweet();

const loading = ref(false);
const homeTweets = ref([]);
const { useAuthUser } = useAuth();
const user = useAuthUser();

onBeforeMount(async () => {
    loading.value = true;
    try {
        const { tweets } = await getTweets();
        homeTweets.value = tweets;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});
const handleFormSuccess = (tweet) => {
    navigateTo({
        path: `/status/${tweet.id}`,
    });
}
</script>
