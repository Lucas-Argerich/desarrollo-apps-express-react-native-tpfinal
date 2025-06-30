import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Text, TouchableOpacity, View, StyleSheet, ViewStyle, TextStyle, ScrollView } from "react-native"

interface SelectProps {
  value: string
  options: string[]
  onSelect: (v: string) => void
  placeholder: string
  style?: {
    dropdown?: ViewStyle
    dropdownItem?: ViewStyle
    dropdownItemText?: TextStyle
    field?: ViewStyle
    fieldText?: TextStyle
  }
}

const defaultStyles = StyleSheet.create({
  field: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 2
  },
  fieldText: {
    color: '#848282',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    flex: 1
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginTop: 2,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
    position: 'absolute',
    top: '100%',
    width: '100%',
    maxHeight: 220,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  dropdownItemText: {
    color: '#1B1B1B',
    fontSize: 16
  }
})

export default function Select({ value, options, onSelect, placeholder, style = {} }: SelectProps) {
  const [open, setOpen] = useState(false)
  return (
    <View style={{ width: '100%', position: 'relative' }}>
      <TouchableOpacity
        style={[defaultStyles.field, style.field]}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={[defaultStyles.fieldText, style.fieldText, { color: value ? '#1B1B1B' : '#848282' }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#848282" />
      </TouchableOpacity>
      {open && (
        <View style={[defaultStyles.dropdown, style.dropdown]}>
          <ScrollView>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[defaultStyles.dropdownItem, style.dropdownItem]}
                onPress={() => {
                  onSelect(opt)
                  setOpen(false)
                }}
              >
                <Text style={[defaultStyles.dropdownItemText, style.dropdownItemText]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
