import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components';

export function GroupCreateScreen({ navigation }: any) {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('오류', '이미지를 불러올 수 없습니다.');
        } else if (response.assets && response.assets[0]) {
          setGroupImage(response.assets[0].uri || null);
        }
      },
    );
  };

  const handleNext = () => {
    if (groupName.trim()) {
      navigation.navigate('GroupProfile', { groupName });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    color: COLORS.black['10'],
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
