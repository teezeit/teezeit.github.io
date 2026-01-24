/**
 * Gyroscope Permission Handler for iOS 13+ and modern browsers
 * Fixes motion sensor access issues caused by browser security changes
 */
(function () {
  "use strict";

  let permissionButton = null;

  // Detect if device is mobile
  function isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
    );
  }

  // Create permission button
  function createPermissionButton() {
    const button = document.createElement("button");
    button.id = "gyro-permission-btn";
    button.innerHTML = "move around";
    button.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9em;
            background: transparent;
            color: #4d4d4d;
            border: 1px solid #4d4d4d;
            border-radius: 0;
            z-index: 10000;
            transition: opacity 0.3s;
            -webkit-tap-highlight-color: transparent;
            -webkit-font-smoothing: antialiased;
            cursor: pointer;
        `;

    button.addEventListener("click", requestPermission);
    document.body.appendChild(button);

    return button;
  }

  // Request device orientation permission
  async function requestPermission() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          removeButton();
          notifyPermissionGranted();
        } else {
          alert(
            "Motion sensor permission denied. Please enable it in your browser settings.",
          );
        }
      } catch (error) {
        alert("Failed to request permission: " + error.message);
      }
    } else {
      // Shouldn't happen, but handle gracefully
      removeButton();
      notifyPermissionGranted();
    }
  }

  // Remove button with animation
  function removeButton() {
    if (permissionButton) {
      permissionButton.style.opacity = "0";
      permissionButton.style.transform = "translate(-50%, -50%) scale(0.8)";
      setTimeout(() => {
        if (permissionButton && permissionButton.parentNode) {
          permissionButton.parentNode.removeChild(permissionButton);
        }
      }, 300);
    }
  }

  // Notify that permission was granted
  function notifyPermissionGranted() {
    if (window.onGyroPermissionGranted) {
      window.onGyroPermissionGranted();
    }
  }

  // Initialize on page load
  function init() {
    console.log('Gyroscope permission init');
    console.log('Is mobile:', isMobileDevice());
    console.log('DeviceOrientationEvent available:', typeof DeviceOrientationEvent !== 'undefined');
    console.log('requestPermission available:', typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function');
    
    // Only proceed if this is a mobile device
    if (!isMobileDevice()) {
      console.log('Desktop detected - skipping permission button');
      notifyPermissionGranted();
      return;
    }

    // Check if permission is needed
    if (typeof DeviceOrientationEvent !== "undefined") {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // iOS 13+ or browsers requiring permission
        console.log('Creating permission button');
        permissionButton = createPermissionButton();
      } else {
        // Older browsers or Android - no permission needed
        console.log('No permission needed - proceeding directly');
        notifyPermissionGranted();
      }
    }
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
