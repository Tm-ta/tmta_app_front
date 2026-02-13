import React, { useCallback , useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList} from '../../types';
import { Screen } from '../../components/Screen';
import { Button } from '../../components';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { LoginButtons } from './components/LoginButtons';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen ({ navigation }: Props){
    const handleKakaoLogin = useCallback(() => {

    }, []);

    const handleGoogleLogin = useCallback(() => {

    }, []);

    const handleAppleLogin = useCallback(() => {

    }, []);

    const handleNaverLogin = useCallback(() => {

    }, []);

    const goEmailLogin = useCallback(() => {
        navigation.navigate('EmailLogin');
    }, [navigation]);

    const goSignup = useCallback(() => {
        navigation.navigate('Signup');
    }, [navigation]);

    const handleGuestStart = useCallback(() => {
        navigation.replace('GroupList');
    }, [navigation]);


    return(
        <Screen style={styles.container}>
             <View style={styles.content}>
                {/* 카카오 로그인*/}
                <TouchableOpacity
                    style={styles.kakaoButton}
                    onPress={handleKakaoLogin}
                    activeOpacity={0.8}
                >
                    <View style={styles.kakaoContent}>
                        <Image
                            source={require('../../assets/icons/kakao.png')}
                            style={styles.kakaoIcon}
                        />
                        <Text style={styles.kakaoText}>카카오 로그인</Text>
                    </View>
                </TouchableOpacity>

                {/* 소셜 아이콘 버튼 묶음 */}
                <LoginButtons
                    onGooglePress={handleGoogleLogin}
                    onApplePress={handleAppleLogin}
                    onNaverPress={handleNaverLogin}
                />

                <View style={styles.linkRow}>
                    <TouchableOpacity onPress={goEmailLogin}>
                        <Text style={styles.linkText}>이메일로 로그인</Text>
                    </TouchableOpacity>

                    <Text style={styles.linkText}>|</Text>

                    <TouchableOpacity onPress={goSignup}>
                        <Text style={styles.linkText}>회원가입</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleGuestStart} style={styles.guestBtn}>
                    <Text style={styles.guestText}>게스트로 시작하기</Text>
                </TouchableOpacity>
             </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.main.background,
    },
    content : {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kakaoButton: {
        width: 335,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#FEE500',
        justifyContent: 'center',
        marginBottom: 45,
    },
    kakaoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    kakaoIcon: {
        width: 19.2,
        height: 19.2,
        resizeMode: 'contain',
    },
    kakaoText: {
        fontSize: FONT_SIZES.body1,
        fontFamily: FONTS.pretendard.semiBold,
        color: COLORS.text.kakao,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap : 10,
        marginTop: 20,
    },
    linkText: {
        fontSize : FONT_SIZES.body4,
        fontFamily: FONTS.pretendard.regular,
        color: COLORS.black[300],
    },
    guestBtn: {
        width: '100%',
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 60, //여백 재조정 필요
    },
    guestText: {
        fontSize: FONT_SIZES.title3,
        fontFamily: FONTS.pretendard.bold,
        color: COLORS.black[300],
    }


})