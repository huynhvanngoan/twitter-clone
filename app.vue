<template>
    <NuxtLayout>
        <div :class="{ dark: darkMode }">
            <div class="bg-white dark:bg-dim-900">
                <Loading v-if="isLoading" />

                <!-- App -->
                <div v-else-if="user" class="min-h-full">
                    <div
                        class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5"
                    >
                        <!-- Left Side -->
                        <div
                            class="hidden md:block xs:col-span-1 xl:col-span-2"
                        >
                            <div class="sticky top-0">
                                <SidebarLeft
                                    @on-tweet="handleOpenTweetModal"
                                    :user="user"
                                    @on-logout="handleLogout"
                                />
                            </div>
                        </div>
                        <!-- Main Content -->
                        <main
                            class="col-span-12 mt-2 md:col-span-8 xl:col-span-6"
                        >
                            <NuxtPage />
                        </main>
                        <!-- Right Side -->
                        <div
                            class="hidden col-span-12 md:block xl:col-span-4 md:col-span-3"
                        >
                            <div class="sticky top-0">
                                <SidebarRight />
                            </div>
                        </div>
                    </div>
                </div>
                <AuthPage v-else />

                <UIModal :isOpen="postTweetModal" @on-close="handleModalClose">
                    <TweetForm
                        :replyTo="replyTweet"
                        showReply
                        :user="user"
                        @onSuccess="handleFormSuccess"
                    />
                </UIModal>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { onBeforeMount } from "vue";

const darkMode = ref(false);
const { useAuthUser, initAuth, useAuthLoading, logout } = useAuth();
const isLoading = useAuthLoading();

const {
    closePostTweetModal,
    usePostTweetModal,
    openPostTweetModal,
    useReplyTweet,
} = useTweet();

const replyTweet = useReplyTweet();
const emitter = useEmitter();

emitter.$on("replyTweet", (tweet) => {
    openPostTweetModal(tweet);
    replyTweet.value = tweet;
});

const postTweetModal = usePostTweetModal();
const user = useAuthUser();

emitter.$on("toggleDarkMode", () => {
    darkMode.value = !darkMode.value;
});

onBeforeMount(() => {
    initAuth();
});

const handleFormSuccess = (tweet) => {
    closePostTweetModal();

    navigateTo({
        path: `/status/${tweet.id}`,
    });
};

const handleModalClose = () => {
    closePostTweetModal();
};

const handleOpenTweetModal = () => {
    openPostTweetModal(null);
};

const handleLogout = async () => {
    await logout();
};
</script>
