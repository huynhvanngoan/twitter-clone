<template>
    <div class="h-screen flex flex-col">
        <div
            class="p-2 m-2 hover:bg-blue-50 hover:rounded-full w-min dark:hover:bg-white/20"
            :class="defaultTransition"
        >
            <nuxt-link to="">
                <div class="size-8">
                    <LogoTwitter />
                </div>
            </nuxt-link>
        </div>

        <div class="mt-2 space-y-3">
            <SidebarLeftTab
                v-for="(tab, index) in tabs"
                :key="index"
                :active="tab.active"
            >
                <template #icon>
                    <component :is="tab.icon" />
                </template>
                <template #label>
                    <span>{{ tab.label }}</span>
                </template>
            </SidebarLeftTab>
            <div class="hidden xl:block">
                <UIButton liquid size="lg" @click="emits('onTweet')">
                    <span class="font-bold"> Tweet </span>
                </UIButton>
            </div>
            <div class="block xl:hidden">
                <UIButton @click="emits('onTweet')">
                    <div class="size-6 font-bold">
                        <PencilIcon />
                    </div>
                </UIButton>
            </div>
        </div>
        <div
            class="flex flex-row items-center justify-center p-2 mx-auto mt-auto mb-5 rounded-full cursor-pointer w-14 xl:w-full hover:bg-gray-100 dark:bg-dim-800"
            :class="defaultTransition"
            @click="emits('onLogout')"
        >
            <div class="flex flex-row">
                <img
                    :src="props.user?.profileImage"
                    alt="avatar"
                    class="size-10 rounded-full"
                />
                <div class="flex-col hidden ml-2 xl:block">
                    <h1 class="text-sm font-bold text-gray-800 dark:text-white">
                        {{ user.name }}
                    </h1>
                    <p class="text-sm text-gray-400">
                        {{ user.handle }}
                    </p>
                </div>
            </div>

            <!-- Icon -->
            <div class="hidden ml-auto xl:block">
                <div class="size-6">
                    <ChevronDownIcon />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { HomeIcon } from "@heroicons/vue/24/solid";
import {
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    DocumentTextIcon,
    UserIcon,
    EllipsisHorizontalCircleIcon,
    PencilIcon,
    ChevronDownIcon,
} from "@heroicons/vue/24/outline";
const { defaultTransition } = useTailwindConfig();
const emits = defineEmits(["onTweet", "onLogout"]);

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});

const tabs = [
    {
        icon: HomeIcon,
        label: "Home",
        active: true,
    },
    {
        icon: HashtagIcon,
        label: "Explore",
        active: false,
    },
    {
        icon: BellIcon,
        label: "Notifications",
        active: false,
    },
    {
        icon: InboxIcon,
        label: "Messages",
        active: false,
    },
    {
        icon: BookmarkIcon,
        label: "Bookmarks",
        active: false,
    },
    {
        icon: DocumentTextIcon,
        label: "Lists",
        active: false,
    },
    {
        icon: UserIcon,
        label: "Profile",
        active: false,
    },
    {
        icon: EllipsisHorizontalCircleIcon,
        label: "More",
        active: false,
    },
];
</script>

<style lang="scss" scoped></style>
