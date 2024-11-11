import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ContactsScreen from './src/screens/ContactsScreen';
import BackgroundScreen from './src/screens/BackgroundScreen';
import VideoScreen from './src/screens/VideoScreen';
import AboutScreen from './src/screens/AboutScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { BackgroundWrapper } from './src/components/BackgroundWrapper';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <BackgroundProvider>
      <NavigationContainer>
        <BackgroundWrapper>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Contacts') {
                  iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'Background') {
                  iconName = focused ? 'images' : 'images-outline';
                } else if (route.name === 'Video') {
                  iconName = focused ? 'videocam' : 'videocam-outline';
                } else if (route.name === 'About') {
                  iconName = focused ? 'information-circle' : 'information-circle-outline';
                } else if (route.name === 'Messages') {
                  iconName = focused ? 'mail' : 'mail-outline';
                }

                return <Ionicons name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen 
              name="Contacts" 
              component={ContactsScreen}
              options={{ title: 'Contactos' }}
            />
            <Tab.Screen 
              name="Background" 
              component={BackgroundScreen}
              options={{ title: 'Fondo' }}
            />
            <Tab.Screen 
              name="Video" 
              component={VideoScreen}
              options={{ title: 'Video' }}
            />
            <Tab.Screen 
              name="Messages" 
              component={MessagesScreen}
              options={{ title: 'Mensajes' }}
            />
            <Tab.Screen 
              name="About" 
              component={AboutScreen}
              options={{ title: 'Acerca de' }}
            />
          </Tab.Navigator>
        </BackgroundWrapper>
      </NavigationContainer>
    </BackgroundProvider>
  );
}