import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Input, Button } from '../../components';
import { COLORS } from '../../constants';

export function GroupJoinScreen({ navigation }: any) {
  const [teamId, setTeamId] = useState('');

  const handleConfirm = () => {
    const id = teamId.trim();
    if (!id) return;
    navigation.navigate('GroupProfile', { teamId: id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showMenu={false}
        onBackPress={() => navigation.navigate('GroupList')}
      />

      <View style={styles.content}>
        <Input
          label="모임 코드"
          placeholder="teamId를 입력해주세요"
          value={teamId}
          onChangeText={setTeamId}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="확인"
          onPress={handleConfirm}
          disabled={!teamId.trim()}
        />
      </View>
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
    paddingTop: 40,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
});

