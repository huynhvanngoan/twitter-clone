import { jwtDecode } from "jwt-decode";
import useFetchApi from "./useFetchApi";

export default () => {
    const useAuthToken = () => useState('authToken');
    const useAuthUser = () => useState('authUser');
    const useAuthLoading = () => useState('authLoading', () => true);

    const setToken = (newToken) => {
        const authToken = useAuthToken();
        authToken.value = newToken;
    };

    const setUser = (newUser) => {
        const authUser = useAuthUser();
        authUser.value = newUser;
    };

    const setIsAuthLoading = (newLoading) => {
        const authLoading = useAuthLoading();
        authLoading.value = newLoading;
    }


    const login = ({ username, password }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $fetch('/api/auth/login', {
                    method: 'POST',
                    body: {
                        username,
                        password
                    }
                })

                setToken(data.accessToken)
                setUser(data.user)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }
    const refreshToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await $fetch('/api/auth/refresh');

                if (response.error) {
                    throw new Error(response.error);
                }

                setToken(response.accessToken);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }
    const getUser = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi('/api/auth/user');
                if (response.error) {
                    throw new Error(response.error);
                }

                setUser(response.user);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }

    const reRefreshAccessToken = () => {
        const authToken = useAuthToken();

        if (!authToken.value) {
            return;
        }

        const jwt = jwtDecode(authToken.value);

        const newRefreshTime = jwt.exp - 60000;

        setTimeout(() => {
            refreshToken();
            reRefreshAccessToken()
        }, newRefreshTime);
    }

    const initAuth = () => {
        return new Promise(async (resolve, reject) => {
            setIsAuthLoading(true);
            try {
                await refreshToken();
                await getUser();

                reRefreshAccessToken()
                resolve(true);
            } catch (error) {
                reject(error);
            } finally {
                setIsAuthLoading(false);
            }
        })
    }

    const logout = () => {
        return new Promise(async (resolve, reject) => {
            try {
                await useFetchApi('/api/auth/logout', {
                    method: 'POST'
                });

                setToken(null);
                setUser(null);

                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }

    return {
        login,
        useAuthToken,
        useAuthUser,
        initAuth,
        useAuthLoading,
        logout
    };
};
