/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import PlusIcon from '../../assets/icons/Plus.svg';
import CameraIcon from '../../assets/icons/Camera.svg'
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button, Header, Input } from '../../components';
import { joinTeam } from '../../api/team';
import { useErrorPopup } from '../../components/popup/ErrorPopupProvider';

export function GroupProfileScreen({ navigation, route }: any) {
  const { teamId } = route.params || {};
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showErrorPopup } = useErrorPopup();

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
          showErrorPopup('IMAGE_PICK_FAILED');
        } else if (response.assets && response.assets[0]) {
          setProfileImage(response.assets[0].uri || null);
        }
      },
    );
  };

  const handleNext = async () => {
    const name = nickname.trim();
    if (!name || !teamId) return;

    try {
      await joinTeam(String(teamId), {
        userName: name,
        profileImg: profileImage ?? '',
      });
      navigation.navigate('GroupDetail', { groupId: String(teamId) });
    } catch (e) {
      showErrorPopup('GROUP_JOIN_FAILED');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={() => navigation.goBack()}
        showMenu={false}
        onMenuPress={() => {}}
      />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>모임에서 사용할</Text>
          <Text style={styles.title}>프로필을 입력해주세요</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleImagePick}
            activeOpacity={0.7}
          >
            <View style={styles.profileImage}>
              {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImagePreview}
                  />
                ) : (
                  <CameraIcon width={60} height={60} />
                )}
            </View>
            <View style={styles.addButton}>
              <PlusIcon width={30} height={30} />
            </View>
          </TouchableOpacity>

          <Input
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChangeText={setNickname}
            maxLength={8}
            showCount
            containerStyle={styles.inputContainer}
          />
        </View>
      </View>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <Button
            title="다음"
            onPress={handleNext}
            disabled={!nickname.trim()}
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
  titleContainer: {
    marginTop: 40,
    marginBottom: 60,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
  },
  profileSection: {
    alignItems: 'center',
    gap: 40,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray['300'],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePreview: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: COLORS.main.normal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
});
