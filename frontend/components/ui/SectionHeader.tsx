import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewProps } from 'react-native';

interface SectionHeaderProps extends ViewProps {
  title: string;
  showSeeMore?: boolean;
  onSeeMorePress?: () => void;
  seeMoreText?: string;
}

export default function SectionHeader({
  title,
  showSeeMore = true,
  onSeeMorePress,
  seeMoreText = "Ver mas",
  style,
  ...props
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.title}>{title}</Text>
      {showSeeMore && (
        <TouchableOpacity onPress={onSeeMorePress}>
          <Text style={styles.seeMore}>{seeMoreText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 8
  },
  seeMore: {
    color: '#888',
    fontSize: 16,
  },
}); 