<template>
    <div>
        <div class="flex items-center flex-shrink-0 p-4 pb-0">
            <div class="flex w-12 place-items-start">
                <img
                    class="inline-block size-10 rounded-full"
                    :src="props?.user?.profileImage"
                    alt="User profile image"
                />
            </div>
            <div class="w-full p-2 pt-4">
                <textarea
                    class="w-full h-10 text-lg text-gray-900 overflow-hidden placeholder:text-gray-400 bg-transparent border-0 dark:text-white focus:ring-0"
                    v-model="text"
                    :placeholder="props?.placeholder"
                ></textarea>
            </div>
        </div>

        <!-- File Selector -->
        <div class="p-4 pl-16">
            <img
                v-if="inputImageUrl"
                :src="inputImageUrl"
                alt=""
                class="rounded-2xl border"
                :class="twitterBorderColor"
                width="200"
                height="200"
            />
            <input
                type="file"
                accept="image/*,video/*"
                name=""
                id=""
                ref="imageInput"
                aria-label="Upload file"
                hidden
                @change="handleImageChange"
            />
        </div>

        <!-- Icons -->
        <div class="flex p-2 pl-14">
            <div class="flex w-full text-white">
                <div
                    v-for="iconName in iconNames"
                    :key="iconName"
                    class="p-2 pt-3 text-blue-400 rounded-full cursor-pointer hover:bg-blue-50 dark:hover:bg-dim-800"
                    @click="iconName === 'image' ? handleImageClick() : null"
                >
                    <Icon :name="iconName" />
                </div>
                <div class="ml-auto">
                    <UIButton
                        :disabled="isDisabled"
                        @click="handleFormSubmit"
                    >
                        <strong class="font-bold"> Tweet </strong>
                    </UIButton>
                    <!-- <button @click="handleFormSubmit" class="btn btn-primary">
                    Tweet
                </button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { twitterBorderColor } = useTailwindConfig();

import { ref } from "vue";
import Icon from "@/components/UI/Icon.vue";

const emits = defineEmits(["onSubmit"]);
const text = ref("");
const imageInput = ref();
const selectedFile = ref(null);
const inputImageUrl = ref(null);

const isDisabled = computed(() => text.value === "");

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    placeholder: {
        type: String,
        default: 'What\'s happening?',
    },
});

const iconNames = ["image", "gif", "chart", "emoji", "calendar"];
const handleFormSubmit = () => {
    emits("onSubmit", {
        text: text.value,
        mediaFile: [selectedFile.value],
    });
};

const handleImageClick = () => {
    imageInput.value.click();
};

const handleImageChange = (event) => {
    const file = event.target.files[0];
    selectedFile.value = file;

    const reader = new FileReader();

    reader.onload = (event) => {
        inputImageUrl.value = event.target.result;
    };
    reader.readAsDataURL(file);
};
</script>
