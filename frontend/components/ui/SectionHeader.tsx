import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
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
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  seeMore: {
    color: '#888',
    fontSize: 14,
  },
}); 