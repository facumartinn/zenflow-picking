// src/store/authAtoms.ts
import { atom } from 'jotai'
import { User } from '../types/auth'

export const authTokenAtom = atom<string | null>(null)
export const adminTokenAtom = atom<string | null>(null)
export const pickerTokenAtom = atom<string | null>(null)
export const userAtom = atom<User | null>(null)
export const isAdminLoggedInAtom = atom(false)
export const isPickerLoggedInAtom = atom(false)
