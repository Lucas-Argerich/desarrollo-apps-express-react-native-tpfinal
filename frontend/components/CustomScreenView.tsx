import { ScrollView, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomScreenView({ children, ...props }: { children: React.ReactNode } & ViewProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} {...props}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}