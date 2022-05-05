import { toast } from 'react-toastify'

export function showErrorNotif(msg: string) {
  toast.error(msg, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  })
}
