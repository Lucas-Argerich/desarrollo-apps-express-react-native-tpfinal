import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
  Keyboard
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface InputProps extends TextInputProps {
  label?: string
  icon?: keyof typeof MaterialIcons.glyphMap
  error?: string
}

export default function Input({
  label,
  icon,
  error,
  style,
  placeholderTextColor = '#848282',
  ...props
}: InputProps) {
  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1, minHeight: 60, height: 'auto' }}>
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
          {icon && <MaterialIcons name={icon} size={24} color={error ? '#FF3B30' : '#848282'} />}
          <TextInput
            style={[styles.input, style]}
            placeholderTextColor={placeholderTextColor}
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            {...props}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4
  },
  label: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: '#1B1B1B',
    textAlign: 'left',
    paddingLeft: 16,
    fontWeight: '500'
  },
  inputWrapper: {
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10
  },
  inputWrapperError: {
    borderWidth: 1,
    borderColor: '#FF3B30'
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#1B1B1B'
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#FF3B30',
    textAlign: 'center'
  }
})
