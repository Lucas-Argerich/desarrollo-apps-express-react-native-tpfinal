import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  AccessibilityProps,
  Modal,
  Pressable
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`
}

interface DateSelectProps extends AccessibilityProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  a11yLabel?: string
}

export default function DateSelect({
  value,
  onChange,
  placeholder,
  a11yLabel,
  accessibilityLabel
}: DateSelectProps) {
  const [show, setShow] = useState(false)
  const [tempDate, setTempDate] = useState<Date | undefined>(value ? new Date(value) : undefined)

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios')
    if (selectedDate) {
      setTempDate(selectedDate)
      onChange(selectedDate.toISOString())
    }
  }

  const handleClear = () => {
    setTempDate(undefined)
    onChange('')
  }

  const hasValue = !!value

  return (
    <View>
      <TouchableOpacity
        style={[styles.inputFieldRow]}
        onPress={() => setShow(true)}
        activeOpacity={0.85}
        accessibilityLabel={accessibilityLabel || a11yLabel || placeholder || 'Seleccionar fecha'}
        accessibilityRole="button"
      >
        <Ionicons name="calendar-outline" size={20} color={'#A5A5A5'} style={{ marginRight: 8 }} />
        <Text
          style={[
            styles.inputFieldDropdownText,
            { color: hasValue ? '#1B1B1B' : '#848282', flex: 1 }
          ]}
        >
          {hasValue ? formatDate(new Date(value)) : placeholder || 'Seleccionar fecha'}
        </Text>
        {hasValue && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityLabel="Borrar fecha"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={20} color="#CAC8C8" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {show && (
        <Modal
          transparent
          animationType="fade"
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setShow(false)} />
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={tempDate ? tempDate : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleChange}
            />
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputFieldRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#EDEDED'
  },
  inputFieldDropdownText: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
    borderRadius: 12
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1000
  },
  pickerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    zIndex: 1001
  }
})
