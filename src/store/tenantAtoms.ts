// src/store/tenantAtoms.ts
import { atom } from 'jotai'
import { Tenant, SubstitutionPreference } from '../types/tenant'

export const tenantsAtom = atom<Tenant[]>([])
export const substitutionPreferencesAtom = atom<SubstitutionPreference[]>([])
