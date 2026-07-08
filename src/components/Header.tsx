import { View, Text, Image } from 'react-native'
import React from 'react'
import { Button } from './ui/button'
import { ChevronLeft } from "../libs/icons/ChevronLeft"
import { router, useRoute } from 'expo-router'
import MenuPopover from './MenuPopover'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TITLES } from '@/libs/constants'
import MenuModal from './MenuModel'

type Props = {
    isBackVisible?: boolean;
    headerTitle?: string;
    isLogoVisible?: boolean;
}

const Header = ({ isBackVisible = false, headerTitle, isLogoVisible }: Props) => {

    const route = useRoute();
    const insets = useSafeAreaInsets();

    return (
        <View className={`flex-row items-center justify-between w-full p-4 ${route.name != "camera" && "bg-white"}`} style={{ paddingTop: insets.top }}>

            {isLogoVisible && !headerTitle && (
                <Image
                    className='size-16'
                    source={require("@/assets/images/logos/icon.png")}
                    resizeMode='contain'
                />
            )}

            {isBackVisible && !headerTitle && (
                <Button
                    className='gap-4 flex-row items-center'
                    variant={"ghost"}
                    size={"icon"}
                    onPress={() => router.back()}
                >
                    <ChevronLeft className={`text-stone-900 ${route.name == "camera" && "text-white"}`} />
                </Button>
            )}

            {isBackVisible && headerTitle && (
                <View className='flex-row items-center gap-2'>
                    <Button
                        className='gap-4 flex-row items-center p-0'
                        onPress={() => router.back()}
                        variant={"ghost"}
                        size={"icon"}
                    >
                        <ChevronLeft className={`text-stone-900 ${route.name == "camera" && "text-white"}`} />
                    </Button>
                    <View>
                        <Text className={`text-base xs:text-lg font-semibold text-black ${route.name == "camera" && "text-white"}`}>
                            {headerTitle}
                        </Text>
                    </View>
                </View>
            )}

            {isLogoVisible && headerTitle && (
                <View className='flex-row items-center gap-2'>
                    <Image
                        className='size-16'
                        source={require("@/assets/images/logos/icon.png")}
                        resizeMode='contain'
                    />
                    <View>
                        <Text className={`text-base xs:text-xl text-black text-wrap w-72`}>
                            {TITLES.APP_NAME} SeQR Docs
                        </Text>
                    </View>
                </View>
            )}

            {route.name === "home" && (
                <View className='items-end'>
                    <MenuModal />
                </View>
            )}
        </View>
    )
}

export default Header