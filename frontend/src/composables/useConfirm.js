import { ref } from 'vue'

export const useConfirm = () => {
  const showDialog = ref(false)
  const dialogConfig = ref({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  })

  const confirm = (config = {}) => {
    return new Promise((resolve) => {
      dialogConfig.value = {
        ...dialogConfig.value,
        ...config
      }
      showDialog.value = true

      // Store resolve function
      dialogConfig.value._resolve = resolve
    })
  }

  const handleConfirm = () => {
    if (dialogConfig.value._resolve) {
      dialogConfig.value._resolve(true)
      dialogConfig.value._resolve = null
    }
    showDialog.value = false
  }

  const handleCancel = () => {
    if (dialogConfig.value._resolve) {
      dialogConfig.value._resolve(false)
      dialogConfig.value._resolve = null
    }
    showDialog.value = false
  }

  return {
    showDialog,
    dialogConfig,
    confirm,
    handleConfirm,
    handleCancel
  }
}

