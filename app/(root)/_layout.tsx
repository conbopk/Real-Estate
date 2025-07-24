import {useGlobalContext} from "@/lib/global-provider";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator} from "react-native";
import {Redirect, Slot} from "expo-router";

export default function AppLayout() {
    const { loading, isLogged } = useGlobalContext();

    if (loading) {
        return (
            <SafeAreaView className='flex justify-center items-center bg-white h-full'>
                <ActivityIndicator className='text-primary-300' size='large' />
            </SafeAreaView>
        );
    }

    if (!isLogged) {
        return <Redirect href='/sign-in' />;
    }

    return <Slot />;
}