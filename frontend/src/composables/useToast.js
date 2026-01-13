export const useToast = () => {
  const showToast = (message, type = 'info', duration = 3000) => {
    if (typeof window !== 'undefined' && window.toast) {
      return window.toast[type](message, duration)
    }
    // Fallback to console if toast not available
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  return {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
  }
}

