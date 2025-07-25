import {Stack} from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import './global.css'
import GlobalProvider from "@/lib/global-provider";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),
        "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),
        "Rubik-Light": require('../assets/fonts/Rubik-Light.ttf'),
        "Rubik-Medium": require('../assets/fonts/Rubik-Medium.ttf'),
        "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),
        "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!SplashScreen) {
        return null;
    }

    return (
        <GlobalProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </GlobalProvider>
    );
}
