import { Tabs } from 'expo-router';
import BottomNav from '../../components/ui/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="busqueda"
        options={{
          title: 'Búsqueda',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="recetario"
        options={{
          title: 'Recetario',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="recientes"
        options={{
          title: 'Recientes',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
