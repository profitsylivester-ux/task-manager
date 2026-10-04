import { useState, useEffect } from 'react'

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    function handleBeforeInstall(event) {
      event.preventDefault()
      setDeferredPrompt(event)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice

    if (result.outcome === 'accepted') {
      setShow(false)
    }

    setDeferredPrompt(null)
  }

  if (!show) return null

  return (
    <div className="install-prompt">
      <span>Install Task Manager on your phone?</span>
      <button onClick={handleInstall}>Install</button>
      <button className="install-close" onClick={() => setShow(false)}>
        ✕
      </button>
    </div>
  )
}

export default InstallPrompt