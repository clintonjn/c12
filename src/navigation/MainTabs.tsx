import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, StyleSheet } from 'react-native';
import Welcome from '../components/Welcome';
import ChatScreen from '../screens/ChatScreen';
import IndividualChatScreen from '../screens/IndividualChatScreen';

const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

interface TabIconProps {
  focused: boolean;
  iconSource: any;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, iconSource }) => (
  <View
    style={[
      styles.tabIconContainer,
      focused ? styles.tabIconFocused : styles.tabIconUnfocused,
    ]}
  >
    <Image
      source={iconSource}
      style={[styles.tabIcon, { tintColor: focused ? '#fff' : '#666' }]}
    />
  </View>
);

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator id="ChatStack" screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="FriendsList" component={ChatScreen} />
      <ChatStack.Screen
        name="IndividualChat"
        component={IndividualChatScreen}
      />
    </ChatStack.Navigator>
  );
}

interface MainTabsProps {
  onLogout: () => void;
  user: unknown;
}

export default function MainTabs({ onLogout, user }: MainTabsProps) {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/icons/home.png')}
            />
          ),
        }}
      >
        {() => <Welcome onLogout={onLogout} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/icons/message.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  tabIconFocused: {
    backgroundColor: '#333',
  },
  tabIconUnfocused: {
    backgroundColor: 'transparent',
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
});
