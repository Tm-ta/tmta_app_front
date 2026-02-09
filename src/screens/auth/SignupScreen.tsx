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
            </View>

            <View style={styles.agreementSection}>
                <View style={styles.allAgreeRowPlaceholder}></View>
                <View style={styles.divider}></View>
                <View style={styles.agreementListPlaceholder}></View>
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
        paddingTop: 28,
    },
    title : {
        fontSize: FONT_SIZES.heading1,
        fontFamily: FONTS.pretendard.extraBold,
        color: COLORS.black['500'],
    },
    agreementSection : {
        marginTop: 24,
    },
    allAgreeRowPlaceholder : {

    },
    divider : {

    },
    agreementListPlaceholder : {

    },

})