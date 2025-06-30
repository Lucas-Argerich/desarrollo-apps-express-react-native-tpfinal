import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface TabsProps {
  tabs: string[];
  activeTab: number;
  onTabPress: (tab: string, idx: number) => void;
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
}

export default function Tabs({ tabs, activeTab, onTabPress, style, tabStyle, tabTextStyle }: TabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.tabsRow, style]}
      contentContainerStyle={styles.tabsRowContent}
    >
      {tabs.map((tab, idx) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            tabStyle,
            activeTab === idx && styles.tabButtonActive
          ]}
          onPress={() => onTabPress(tab, idx)}
        >
          <Text style={[
            styles.tabText,
            tabTextStyle,
            activeTab === idx && styles.tabTextActive
          ]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    marginVertical: 8,
    flexGrow: 0
  },
  tabsRowContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  tabButtonActive: {
    backgroundColor: '#EE964B',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
}); 