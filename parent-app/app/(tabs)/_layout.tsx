import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { logout } = useAuth();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#1e3a8a',
      headerStyle: { backgroundColor: '#1e3a8a' },
      headerTintColor: '#fff',
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'الكورسات',
          tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'البث المباشر',
          tabBarIcon: ({ color }) => <MaterialIcons name="live-tv" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: 'الامتحانات',
          tabBarIcon: ({ color }) => <MaterialIcons name="assignment" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'المحفظة',
          tabBarIcon: ({ color }) => <MaterialIcons name="account-balance-wallet" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
