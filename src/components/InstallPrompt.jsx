import { useState, useEffect } from 'react'

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Detect if already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true

    if (isStandalone) {
      setShow(false)
      return
    }

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)

    // Show the button for everyone (except installed)
    setShow(true)

    // Capture Android install prompt if available
    function handleBeforeInstall(event) {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  async function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        setShow(false)
      }
      setDeferredPrompt(null)
      return
    }

    // No native prompt available — show instructions
    setShowInstructions(true)
  }

  if (!show) return null

  return (
    <div className="install-prompt">
      <span>📲 Install Task Manager on your phone</span>
      <button onClick={handleInstallClick}>Install</button>
      <button className="install-close" onClick={() => setShow(false)}>
        ✕
      </button>

      {showInstructions && (
        <div className="install-instructions">
          {isIOS ? (
            <>
              <p><strong>On iPhone / iPad:</strong></p>
              <p>1. Tap the <strong>Share</strong> button in Safari (square with arrow).</p>
              <p>2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
              <p>3. Tap <strong>Add</strong>.</p>
            </>
          ) : (
            <>
              <p><strong>On Android:</strong></p>
              <p>1. Tap the <strong>three dots</strong> in Chrome (top-right).</p>
              <p>2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
              <p>3. Confirm.</p>
            </>
          )}
          <button className="install-close-instructions" onClick={() => setShowInstructions(false)}>
            Got it
          </button>
        </div>
      )}
    </div>
  )
}

export default InstallPrompt