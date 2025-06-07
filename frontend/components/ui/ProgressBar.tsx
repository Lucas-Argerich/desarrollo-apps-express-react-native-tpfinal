import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
}

export default function ProgressBar({
  progress,
  height = 4,
  backgroundColor = '#E0E0E0',
  progressColor = '#EE964B',
  style,
}: ProgressBarProps) {
  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${progress * 100}%`,
            backgroundColor: progressColor,
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
}); 