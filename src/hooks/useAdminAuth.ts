import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { isAdminLoggedInAtom, tenantLogoAtom } from '../store/authAtoms'
import { getAdminAuth, getTenantData, clearAllSecureData } from '../services/secureStorage'

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)
  const [, setTenantLogo] = useAtom(tenantLogoAtom)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)

      // Verificar datos de autenticación
      const authData = await getAdminAuth()
      if (!authData || authData.expiresAt <= Date.now()) {
        await handleLogout()
        return
      }

      // Cargar datos del tenant
      const tenantData = await getTenantData()
      if (tenantData?.logo) {
        setTenantLogo(tenantData.logo)
      }

      setIsAdminLoggedIn(true)
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error)
      await handleLogout()
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await clearAllSecureData()
      setIsAdminLoggedIn(false)
      setTenantLogo(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return {
    isLoading,
    isAdminLoggedIn,
    checkAuthStatus,
    handleLogout
  }
}
