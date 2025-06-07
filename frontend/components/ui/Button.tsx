import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  title: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  title,
  onPress,
  icon,
  iconPosition = 'right',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled) {
      return [...baseStyle, styles.disabled];
    }
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (disabled) {
      return [...baseStyle, styles.disabledText];
    }
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      case 'outline':
        return [...baseStyle, styles.outlineText];
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && (
        <Ionicons 
          name={icon} 
          size={size === 'small' ? 16 : 20} 
          color={variant === 'outline' ? '#1B1B1B' : '#FFFFFF'} 
          style={styles.leftIcon}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      {icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={size === 'small' ? 16 : 20} 
          color={variant === 'outline' ? '#1B1B1B' : '#FFFFFF'} 
          style={styles.rightIcon}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  primary: {
    backgroundColor: '#EE964B',
  },
  secondary: {
    backgroundColor: '#F5F5F5',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  disabled: {
    backgroundColor: '#E1E1E1',
    borderColor: '#E1E1E1',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#2F2F2F',
  },
  outlineText: {
    color: '#1B1B1B',
  },
  disabledText: {
    color: '#A5A5A5',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
}); 