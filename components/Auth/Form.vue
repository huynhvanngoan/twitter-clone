<template>
    <div class="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-3xl hover:bg-blue-50">
        <div class="space-y-8">
            <UIInput
                label="Username"
                placeholder="@username"
                type="text"
                v-model="data.username"
                class="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-blue-100"
            ></UIInput>
            <UIInput
                label="Password"
                placeholder="*******"
                type="password"
                v-model="data.password"
                class="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105  hover:bg-blue-100"
            ></UIInput>

            <div>
                <button 
                    @click="handleLogin" 
                    :disabled="data.loading"
                    class="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg transform transition duration-500 hover:scale-110  hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <span v-if="data.loading">Loading...</span>
                    <span v-else>Login</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const data = reactive({
    username: "",
    password: "",
    loading: false,
    error: null,
});

const handleLogin = async () => {
    const { login } = useAuth();
    data.loading = true;
    data.error = null;
    try {
        await login({
            username: data.username,
            password: data.password,
        });
    } catch (error) {
        data.error = "Login failed. Please check your credentials and try again.";
        console.log(error);
    } finally {
        data.loading = false;
    }
};
</script>
