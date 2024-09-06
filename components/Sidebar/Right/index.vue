<template>
    <div class="flex flex-col">
        <!-- Search bar -->
        <div class="relative m-2">
            <div
                class="absolute flex items-center h-full pl-4 text-gray-600 cursor-pointer"
            >
                <div class="size-6">
                    <MagnifyingGlassIcon @click="handleSearch" />
                </div>
            </div>
            <input
                class="flex items-center w-full pl-12 text-sm font-normal text-gray-800 bg-gray-200 border border-gray-200 rounded-full shadow dark:text-gray-200 dark:bg-dim-400 dark:border-dim-400 focus:bg-gray-100 dark:focus:bg-dim-900 focus:outline-none focus:border-blue-200 h-9"
                placeholder="Search Twitter"
                type="text"
                v-model="search"
            />
        </div>
        <!-- Preview Card: What's happening -->
        <SidebarRightPreviewCard title="What's happening">
            <SidebarRightPreviewCardItem
                v-for="item in whatHappeningItems"
                :key="item.id"
            >
                <div class="flex flex-col">
                    <h2 class="font-bold text-gray-800 text-md dark:text-white">
                        {{ item.title }}
                    </h2>
                    <p class="text-xs text-gray-400">{{ item.count }}</p>
                </div>
            </SidebarRightPreviewCardItem>
        </SidebarRightPreviewCard>

        <!-- Preview Card: Who to follow -->
        <SidebarRightPreviewCard title="Who to follow">
            <SidebarRightPreviewCardItem
                v-for="item in whoToFollowItems"
                :key="item.id"
            >
                <div class="flex flex-row justify-between p-2">
                    <div class="flex flex-row">
                        <img
                            class="size-10 rounded-full"
                            :src="item.avatar"
                            :alt="item.name"
                        />
                        <div class="flex flex-col ml-2">
                            <h1
                                class="text-sm font-bold text-gray-900 dark:text-white"
                            >
                                {{ item.name }}
                            </h1>
                            <p class="text-xs text-gray-400">
                                {{ item.username }}
                            </p>
                        </div>
                    </div>
                    <div class="flex h-full">
                        <button
                            class="px-4 py-2 font-bold text-white rounded-full bg-black dark:bg-white dark:text-black"
                        >
                            Follow
                        </button>
                    </div>
                </div>
            </SidebarRightPreviewCardItem>
        </SidebarRightPreviewCard>

        <!-- Footer -->
        <footer>
            <ul class="mx-2 my-4 text-xs text-gray-500">
                <li
                    v-for="(link, index) in footerLinks"
                    :key="index"
                    class="inline-block mx-2"
                >
                    <a
                        :href="link.href"
                        class="hover:underline"
                        @click.prevent="handleLinkClick(link)"
                    >{{ link.text }}</a>
                </li>
            </ul>
        </footer>
    </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useRouter } from "vue-router";

const search = ref("");
const emitter = useEmitter();

const handleSearch = () => {
    useRouter().push({
        path: "/search",
        query: {
            q: search.value,
        },
    });
};

const handleToggleDarkMode = () => {
    emitter.$emit("toggleDarkMode");
};

const handleLinkClick = (link) => {
    if (link.text === "Dark Mode") {
        handleToggleDarkMode();
    } else {
        useRouter().push(link.href);
    }
};

const whatHappeningItems = ref([
    { id: 1, title: "SpaceX", count: "18.8k Tweets" },
    { id: 2, title: "#NASA", count: "12.3k Tweets" },
    { id: 3, title: "#MarsRover", count: "9.7k Tweets" },
]);

const whoToFollowItems = ref([
    {
        id: 1,
        name: "Elon Musk",
        username: "@elonmusk",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYP-PcIuOFKIyUG9iHiYYUUS9ujb5QPWtYqckLn15UySTHxuj_6smIOAvxcA_JwcOz74k&usqp=CAU",
    },
    {
        id: 2,
        name: "Jeff Bezos",
        username: "@jeffbezos",
        avatar: "https://cdn.openart.ai/stable_diffusion/58cb25ca0030271eda9ad5e65c01d68a37d61b64_2000x2000.webp",
    },
    {
        id: 3,
        name: "Bill Gates",
        username: "@billgates",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1c-EPZfO2LqPuUqrAkUK3zKS1TGRtooq6QQ&s",
    },
]);

const footerLinks = ref([
    { text: "About", href: "/about" },
    { text: "Help Center", href: "/help" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Cookie Policy", href: "/cookies" },
    { text: "Ads info", href: "/ads" },
    { text: "Blog", href: "/blog" },
    { text: "Status", href: "/status" },
    { text: "Careers", href: "/careers" },
    { text: "Brand Resources", href: "/brand" },
    { text: "Advertising", href: "/advertising" },
    { text: "Marketing", href: "/marketing" },
    { text: "Twitter for Business", href: "/business" },
    { text: "Developers", href: "/developers" },
    { text: "Directory", href: "/directory" },
    { text: "Settings", href: "/settings" },
    { text: "Dark Mode", href: "#" },
]);
</script>
