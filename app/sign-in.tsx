import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import {useGlobalContext} from "@/lib/global-provider";
import {Redirect} from "expo-router";
import {login} from "@/lib/appwrite";


const Auth = () => {
    const { refetch, loading, isLogged } = useGlobalContext();

    if (!loading && isLogged) return <Redirect href='/' />;

    const handleLogin = async () => {
        const result = await login();
        if (result) {
            await refetch();
        } else {
            Alert.alert("Error", "Failed to login");
        }
    };
    
    return (
        <SafeAreaView className='bg-accent-100 h-full'>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <Image
                    source={images.onboarding}
                    className='w-full h-4/6'
                    resizeMode='contain'
                />

                <View className='px-10'>
                    <Text className='text-base text-center uppercase font-rubik text-black-200'>
                        Welcome To Real Estate
                    </Text>

                    <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>
                        Let's Get You Closer {"\n"} To{" "}
                        <Text className='text-primary-300'>Your Ideal Home</Text>
                    </Text>

                    <Text className='text-lg font-rubik text-black-200 text-center mt-12'>
                        Login to Real Estate with Google
                    </Text>

                    <TouchableOpacity
                        onPress={handleLogin}
                        className='bg-accent-100 shadow-md rounded-full w-full py-4 mt-5 flex'
                    >
                        <View className='flex flex-row items-center justify-center'>
                            <Image
                                source={icons.google}
                                className='w-5 h-5'
                                resizeMode='contain'
                            />
                            <Text className='text-lg ml-2 font-rubik-medium text-black-300'>
                                Continue with Google
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Auth;
