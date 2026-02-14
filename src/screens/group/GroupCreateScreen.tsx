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

import { useErrorPopup } from '../../components/popup/ErrorPopupProvider';
import { createTeam } from '../../api/team';

const MAX_GROUP_NAME = 20;

export function GroupCreateScreen({ navigation }: any) {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const {showErrorPopup} = useErrorPopup();

  const [loading, setLoading] = useState(false);


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
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={() => navigation.navigate('GroupList')}
        showMenu
        onMenuPress={() => {}}
      />
      <View style={styles.content}>
        <Text style={styles.title}>모임을 시작해봐요!</Text>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="모임이름입력"
            placeholderTextColor={COLORS.text.tertiary}
            value={groupName}
            onChangeText={setGroupName}
            autoFocus
          />
          <TouchableOpacity
            style={styles.imagePreview}
            onPress={handleImagePick}
            activeOpacity={0.7}
          >
            {groupImage && (
              <Image
                source={{ uri: groupImage }}
                style={styles.imagePreviewContent}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <Button
            title="모임 만들기"
            onPress={handleNext}
            disabled={!groupName.trim()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
    marginTop: 40,
    marginBottom: 60,
  },
  inputSection: {
    alignItems: 'center',
    gap: 12,
  },
  input: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.black['500'],
    textAlign: 'center',
    paddingVertical: 4,
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
  imagePreviewContent: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
});
