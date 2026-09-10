
import { useToast } from 'vue-toastification'

class ToastService {
  constructor() {
    this.toast = useToast()
  }

  getToastConfig(type) {
    const isDark = document.documentElement.classList.contains('dark')

    const configs = {
      success: {
        timeout: 3000,
        icon: '✅',
        toastClassName: isDark
          ? '!bg-green-700 !text-white !border !border-green-600'
          : '!bg-green-500 !text-white !border !border-green-400',
        bodyClassName: 'font-medium'
      },
      error: {
        timeout: 4000,
        icon: '❌',
        toastClassName: isDark
          ? '!bg-red-700 !text-white !border !border-red-600'
          : '!bg-red-500 !text-white !border !border-red-400',
        bodyClassName: 'font-medium'
      },
      warning: {
        timeout: 3500,
        icon: '⚠️',
        toastClassName: isDark
          ? '!bg-yellow-700 !text-white !border !border-yellow-600'
          : '!bg-yellow-500 !text-white !border !border-yellow-400',
        bodyClassName: 'font-medium'
      },
      info: {
        timeout: 3000,
        icon: 'ℹ️',
        toastClassName: isDark
          ? '!bg-blue-700 !text-white !border !border-blue-600'
          : '!bg-blue-500 !text-white !border !border-blue-400',
        bodyClassName: 'font-medium'
      }
    }

    return configs[type] || configs.info
  }

  success(message, title = '') {
    const config = this.getToastConfig('success')
    this.toast.success(message, { ...config, title })
  }

  error(message, title = '') {
    const config = this.getToastConfig('error')
    this.toast.error(message, { ...config, title })
  }

  warning(message, title = '') {
    const config = this.getToastConfig('warning')
    this.toast.warning(message, { ...config, title })
  }

  info(message, title = '') {
    const config = this.getToastConfig('info')
    this.toast.info(message, { ...config, title })
  }
}

export const toastService = new ToastService()
