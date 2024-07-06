// src/store/userAtoms.ts
import { atom } from 'jotai'
import { User, Role } from '../types/auth'

export const usersAtom = atom<User[]>([])
export const rolesAtom = atom<Role[]>([])
