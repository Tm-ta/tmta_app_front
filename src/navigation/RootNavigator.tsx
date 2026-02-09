import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

// Auth Screens
import { LoginScreen, EmailLoginScreen, SignupScreen } from '../screens/auth';

// Group Screens
import { GroupListScreen } from '../screens/group/GroupListScreen';
import { GroupCreateScreen } from '../screens/group/GroupCreateScreen';
import { GroupProfileScreen } from '../screens/group/GroupProfileScreen';
import { GroupDetailScreen } from '../screens/group/GroupDetailScreen';

// Schedule Screens
import { ScheduleDetailScreen } from '../screens/schedule/ScheduleDetailScreen';
import { ScheduleDateScreen } from '../screens/schedule/ScheduleDateScreen';
import { ScheduleTimeScreen } from '../screens/schedule/ScheduleTimeScreen';
import { ScheduleSettingsScreen } from '../screens/schedule/ScheduleSettingsScreen';

// Vote Screens
import { VoteScreen } from '../screens/vote/VoteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        key="force-login" 
        initialRouteName="Login" 
        // initialRouteName="GroupList"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >

        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Group Screens */}
        <Stack.Screen name="GroupList" component={GroupListScreen} />
        <Stack.Screen name="GroupCreate" component={GroupCreateScreen} />
        <Stack.Screen name="GroupProfile" component={GroupProfileScreen} />
        <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />

        {/* Schedule Screens */}
        <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
        <Stack.Screen name="ScheduleDate" component={ScheduleDateScreen} />
        <Stack.Screen name="ScheduleTime" component={ScheduleTimeScreen} />
        <Stack.Screen
          name="ScheduleSettings"
          component={ScheduleSettingsScreen}
        />

        {/* Vote Screens */}
        <Stack.Screen name="Vote" component={VoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
