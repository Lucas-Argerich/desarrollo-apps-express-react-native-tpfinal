import { StyleSheet, Text, type TextProps } from 'react-native';
import {
  useFonts,
  Pacifico_400Regular,
} from '@expo-google-fonts/pacifico';
import {
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Roboto_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'logo' | 'header' | 'title' | 'subtitle' | 'light' | 'label' | 'default';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const [fontsLoaded] = useFonts({
    'Pacifico': Pacifico_400Regular,
    'Montserrat-Bold': Montserrat_700Bold,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Roboto': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'logo' ? styles.logo : undefined,
        type === 'header' ? styles.header : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'light' ? styles.light : undefined,
        type === 'label' ? styles.label : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Pacifico',
  },
  header: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  light: {
    fontSize: 16,
    opacity: 0.7,
    fontFamily: 'Roboto',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});
