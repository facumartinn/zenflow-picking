import { NavigationContainerRef, CommonActions } from '@react-navigation/native'
import { createRef } from 'react'
import { RootStackParamList } from './types'

export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>()

export function navigate<T extends keyof RootStackParamList>(name: T, params?: RootStackParamList[T]) {
  navigationRef.current?.dispatch(CommonActions.navigate({ name, params }))
}
