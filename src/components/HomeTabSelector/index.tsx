import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'
// import { orderTotalsAtom } from '../../store'
// import { useAtom } from 'jotai'

interface TabSelectorProps {
  selectedTab: 'pending' | 'completed'
  setSelectedTab: (tab: 'pending' | 'completed') => void
}

const TabSelector: React.FC<TabSelectorProps> = ({ selectedTab, setSelectedTab }) => {
  // const [orderTotals] = useAtom(orderTotalsAtom)
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={[styles.tabButton, selectedTab === 'pending' && styles.activeTab]} onPress={() => setSelectedTab('pending')}>
        <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>Sin preparar</Text>
        {/* <Text style={[styles.tabTextAmount, selectedTab === 'pending' && styles.tabTextAmountActive]}>{orderTotals.pending}</Text> */}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabButton, selectedTab === 'completed' && styles.activeTab]} onPress={() => setSelectedTab('completed')}>
        <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>Listos para enviar</Text>
        {/* <Text style={[styles.tabTextAmount, selectedTab === 'completed' && styles.tabTextAmountActive]}>{orderTotals.completed}</Text> */}
      </TouchableOpacity>
    </View>
  )
}

export default TabSelector
