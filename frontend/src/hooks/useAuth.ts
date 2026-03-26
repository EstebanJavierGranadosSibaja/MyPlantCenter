import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";

export function useAuth() {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ID,
        iosClientId: ''
    });

    useEffect(() => {
        if (response) {
            if (response.type === 'success') {
                console.log(response.authentication)
            } else {
                console.log("Error al autenticar con google")
            }
        }
    }, [response])

    const authGoogle = () => {

        promptAsync().catch((e) => {
            console.error("Error al iniciar la sesión : ", e)
        })
    }

    return { authGoogle }
}