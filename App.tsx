import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { BackgroundWrapper } from './src/components/BackgroundWrapper';
import AboutScreen from './src/screens/AboutScreen';
import BackgroundScreen from './src/screens/BackgroundScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import VideoScreen from './src/screens/VideoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <BackgroundProvider>
      <NavigationContainer>
        <BackgroundWrapper>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerTransparent: true,
              headerStyle: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Background':
                    iconName = focused ? 'image' : 'image-outline';
                    break;
                  case 'Contacts':
                    iconName = focused ? 'people' : 'people-outline';
                    break;
                  case 'Video':
                    iconName = focused ? 'videocam' : 'videocam-outline';
                    break;
                  case 'Messages':
                    iconName = focused ? 'mail' : 'mail-outline';
                    break;
                  case 'About':
                    iconName = focused ? 'information-circle' : 'information-circle-outline';
                    break;
                  default:
                    iconName = 'alert';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }
            })}
          >
            <Tab.Screen name="Background" component={BackgroundScreen} />
            <Tab.Screen name="Contacts" component={ContactsScreen} />
            <Tab.Screen name="Video" component={VideoScreen} />
            <Tab.Screen name="Messages" component={MessagesScreen} />
            <Tab.Screen name="About" component={AboutScreen} />
          </Tab.Navigator>
        </BackgroundWrapper>
      </NavigationContainer>
    </BackgroundProvider>
  );
}