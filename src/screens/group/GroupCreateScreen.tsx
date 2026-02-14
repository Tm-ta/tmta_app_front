/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button, Header } from '../../components';
import CameraIcon from '../../assets/icons/Camera.svg';

import { useErrorPopup } from '../../components/popup/ErrorPopupProvider';
import { createTeam } from '../../api/team';

const SHEET_TOP = 180; // 흰 패널 시작 위치
const MAX_GROUP_NAME = 20;

export function GroupCreateScreen({ navigation }: any) {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [inputWidth, setInputWidth] = useState(120);
  const displayText = groupName.length > 0 ? groupName : '모임 이름 입력';

  const {showErrorPopup} = useErrorPopup();


  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          showErrorPopup('IMAGE_PICK_FAILED');
          return;
        }
        if (response.assets?.[0]?.uri) {
          setGroupImage(response.assets[0].uri);
        }
      },
    );
  };

  const handleNext = async () => {
    const name = groupName.trim();
    if (!name || loading) return;

    if (name.length > MAX_GROUP_NAME) {
      showErrorPopup('GROUP_NAME_TOO_LONG');
      return;
    }

    try {
      setLoading(true);
      const res = await createTeam(name);
      // 2번 API 결과의 groupId를 넘겨줌 (teamId로 사용)
      navigation.navigate('GroupProfile', { teamId: res.groupId });
    } catch (e) {
      showErrorPopup('GROUP_CREATE_FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topSection}>
          <Header
            onBackPress={() => navigation.navigate('GroupList')}
            showMenu = {false}
            onMenuPress={() => {}}
          />
          <Text style={styles.title}>모임을 시작해 볼까요?</Text>
        </View>
      </SafeAreaView>

      <View style={[styles.bottomSection, { top: SHEET_TOP }]}>
        <KeyboardAvoidingView
          style={styles.bottomInner}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.inputSection}>
            <TouchableOpacity
              style={styles.imagePreview}
              onPress={handleImagePick}
              activeOpacity={0.7}
            >
              {groupImage ? (
                <Image source={{ uri: groupImage }} style={styles.groupImagePreview} />
              ) : (
                <CameraIcon width={60} height={60} />
              )}
            </TouchableOpacity>

            {/* 측정용 텍스트 */}
            <Text
              style={styles.measureText}
              numberOfLines={1}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                setTextWidth(w); 
                const nextInput = Math.min(Math.max(w, 120), 280); // 인풋 폭은 여유 포함(원하면 N)
                setInputWidth(nextInput);
              }}
            >
              {displayText}
            </Text>

            {/* 실제 인풋 */}
            <TextInput
              style={[styles.input, { width: inputWidth }]}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="모임이름입력"
              placeholderTextColor={COLORS.text.placeholder}
              textAlign="center"
            />

            {/* 밑줄: 글자 너비만큼 */}
            <View
              style={[
                styles.underline,
                { width: Math.max(textWidth, 16) }, // 너무 짧으면 최소 폭
              ]}
            />
          </View>

          {/* 버튼은 항상 바닥 */}
          <View style={styles.footer}>
            <Button
              title="모임 만들기"
              onPress={handleNext}
              disabled={!groupName.trim() || loading}
              loading={loading}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.yellow['100'], 
  },
  safe: {
    flex: 1,
    backgroundColor: COLORS.yellow['100'],
  },

  topSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
    // marginTop: 10,
    lineHeight: 33
  },

  // bottom:0까지 차지
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,                 // 중요
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
    overflow: 'hidden',
  },
  bottomInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  inputSection: {
    alignItems: 'center',
    gap: 12,
  },
  imagePreview: {
    width: 144,
    height: 144,
    borderRadius: 16,
    backgroundColor: COLORS.gray['300'],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupImagePreview: {
    width: '100%',
    height: '100%',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 34,
  },
  measureText: {
    position: 'absolute',
    opacity: 0,
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
  },
  input: {
    fontSize: FONT_SIZES.heading1,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
    lineHeight: 26,
    paddingVertical: 0,
    paddingTop: 10,
    paddingBottom: 0,
    includeFontPadding: false, // Android에서 제일 큼
    textAlignVertical: 'center', // 필요 시(멀티라인 아니면 큰 영향은 적음)
  },
  underline: {
    height: 1,
    backgroundColor: COLORS.text.placeholder,
    alignSelf: 'center',
  },
});