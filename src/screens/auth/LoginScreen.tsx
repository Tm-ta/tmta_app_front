import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Input, Button } from '../../components';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';

export function LoginScreen() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('login', { id, password });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title='이메일로 계속하기'
                showBack
                onBackPress={() => console.log('back')}
            />

            <View style={styles.form}>
                <Input
                    label="아이디"
                    placeholder='아이디를 입력해주세요'
                    value={id}
                    onChangeText={setId}
                    autoCapitalize='none'
                    variant='auth'
                />
                <Input
                    label="비밀번호"
                    placeholder='비밀번호를 입력해주세요'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    variant='auth'
                />

                <View style={styles.subActionRow}>
                    <TouchableOpacity onPress={() => console.log('계정 찾기')}> 
                        <Text style={styles.subActionText}>계정 찾기</Text>
                    </TouchableOpacity>

                    <Text style={styles.subActionDivider}>|</Text>

                    <TouchableOpacity onPress={() => console.log('회원 가입')}>
                        <Text style={styles.subActionText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>
            

            <View style={styles.footer}>
                <Button
                    title='로그인'
                    onPress={()=>{}}
                    disabled={!id.trim() || !password.trim()}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        gap: 24,
    },
    subActionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
    },
    subActionText: {
        fontSize: FONT_SIZES.body4, // 12
        fontFamily: FONTS.pretendard.regular,
        color: COLORS.gray['700'],
    },
    subActionDivider: {
        fontSize: FONT_SIZES.body4,
        fontFamily: FONTS.pretendard.regular,
        color: COLORS.gray['700'],
    },
    footer: {
        // paddingHorizontal: 20,
        // paddingBottom: 34,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
  
});