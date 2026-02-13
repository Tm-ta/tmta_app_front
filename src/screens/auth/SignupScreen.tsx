import React, { useCallback , useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList} from '../../types';
import {Header, Input, Button } from '../../components';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;
export function SignupScreen({ navigation }: Props){
    return(
        <SafeAreaView style={styles.container}>
            <Header
                showBack
                onBackPress={() => navigation.goBack()}
            />

            <View style={styles.content}>
                <Text style={styles.title}>
                    서비스 이용 약관에{'\n'}동의해주세요
                </Text>

                <View style={styles.agreementSection}>
                    {/* 모두 동의 */}
                    <View style={styles.allAgreeRowPlaceholder}>
                        <View style={styles.circle}/>
                        <Text style={styles.rowText}>네, 모두 동의합니다</Text>
                    </View>

                    <View style={styles.divider}></View>

                    {/* 개별 약관 */}
                    <View style={styles.agreementRowWrap}>
                        <View style={styles.rowLeft}>
                            <View style={styles.circle}/>
                            <Text style={styles.rowText}>(필수) 서비스 이용약관에 동의</Text>
                        </View>
                        <Text style={styles.viewText}>보기</Text>
                    </View>

                    <View style={styles.agreementRowWrap}>
                        <View style={styles.rowLeft}>
                            <View style={styles.circle}/>
                            <Text style={styles.rowText}>(필수) 개인정보 처리방침에 동의</Text>
                        </View>
                        <Text style={styles.viewText}>보기</Text>
                    </View>

                    <View style={styles.agreementRowWrap}>
                        <View style={styles.rowLeft}>
                            <View style={styles.circle}/>
                            <Text style={styles.rowText}>(필수) 만 14세 이상입니다</Text>
                        </View>
                    </View>

                    <View style={styles.agreementRowWrap}>
                        <View style={styles.rowLeft}>
                            <View style={styles.circle}/>
                            <Text style={styles.rowText}>(선택) 마케팅 정보 수신에 동의</Text>
                        </View>
                        <Text style={styles.viewText}>보기</Text>
                    </View>
                </View>
            </View>
            <View style={styles.bottom}>
                <Button title="다음" onPress={()=>{}}></Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#FFFEF9',
    },
    content : {
        flex: 1,
        paddingHorizontal: 20,
        // paddingTop: 28,
    },
    title : {
        fontSize: FONT_SIZES.heading1,
        fontFamily: FONTS.pretendard.extraBold,
        color: COLORS.black['500'],
        marginVertical: 55,
    },
    agreementSection : {
        // marginTop: 24,
    },
    allAgreeRowPlaceholder : {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle : {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.gray[500],
        backgroundColor: 'transparent',
    },
    rowText : {
        marginLeft: 10,
        fontSize : FONT_SIZES.body1,
        fontFamily : FONTS.pretendard.regular,
        color: COLORS.black[500],
    },

    divider : {
        height: 1,
        backgroundColor: COLORS.gray[500],
        marginVertical: 24,
    },

    agreementRowWrap : {
        // backgroundColor: '#ededed',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    rowLeft : {
        flex: 1,
        flexDirection : 'row',
        alignItems: 'center',
    },
    viewText : {
        fontSize: FONT_SIZES.body4,
        fontFamily: FONTS.pretendard.regular,
        color: COLORS.gray[700],
    },
    
    bottom:{
        paddingHorizontal: 16,
        paddingVertical: 10,
    }

})