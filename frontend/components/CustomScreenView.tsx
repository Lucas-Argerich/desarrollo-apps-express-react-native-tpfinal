import { ScrollView, View, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CustomScreenView({
  children,
  noScroll = false,
  ...props
}: { children: React.ReactNode; noScroll?: boolean } & ViewProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} {...props}>
      {noScroll ? (
        children
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {children}
          <View style={{ marginBottom: 120 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
