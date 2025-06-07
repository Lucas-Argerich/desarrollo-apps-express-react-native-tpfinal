import { ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomScreenView({ children, ...props }: { children: React.ReactNode } & ViewProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} {...props}>
      {children}
    </SafeAreaView>
  );
}