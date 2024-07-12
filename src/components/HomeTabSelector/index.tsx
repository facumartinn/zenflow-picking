import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'

interface TabSelectorProps {
  selectedTab: 'pending' | 'completed'
  setSelectedTab: (tab: 'pending' | 'completed') => void
}

const TabSelector: React.FC<TabSelectorProps> = ({ selectedTab, setSelectedTab }) => (
  <View style={styles.tabContainer}>
    <View style={styles.tabInsideContainer}>
      <TouchableOpacity style={[styles.tabButton, selectedTab === 'pending' && styles.activeTab]} onPress={() => setSelectedTab('pending')}>
        <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>Pendientes</Text>
        <Text style={[styles.tabTextAmount, selectedTab === 'pending' && styles.tabTextAmountActive]}>15</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabButton, selectedTab === 'completed' && styles.activeTab]} onPress={() => setSelectedTab('completed')}>
        <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>Finalizados</Text>
        <Text style={[styles.tabTextAmount, selectedTab === 'completed' && styles.tabTextAmountActive]}>32</Text>
      </TouchableOpacity>
    </View>
  </View>
)

export default TabSelector
