import { StyleSheet, TouchableOpacity } from 'react-native'

interface ActionButtonProps {
  children: React.ReactNode
  onPress: () => void
}

export default function ActionButton({ children, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 38,
    left: 32,
    right: 32,
    height: 66,
    backgroundColor: '#EE964B',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 13
    },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 5
  }
})