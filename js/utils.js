// js/utils.js - Utility Functions
// ===============================

// ==================== TIME FORMATTING ====================

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ==================== PERCENTAGE CALCULATION ====================

export function calculatePercentage(correct, total) {
  if (total === 0) return 0
  
  return Math.round((correct / total) * 100)
}

// ==================== VALIDATION ====================

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  return emailRegex.test(email)
}

export function validatePassword(password) {
  return password && password.length >= 6
}

export function validateQuizData(questions, answers, totalQuestions) {
  return (
    Array.isArray(questions) &&
    Array.isArray(answers) &&
    questions.length === totalQuestions &&
    answers.length === totalQuestions
  )
}

// ==================== STORAGE FUNCTIONS ====================

export function saveToLocalStorage(key, value) {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    
    console.log(`💾 Saved to localStorage: ${key}`)
    
    return true
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error.message)
    
    return false
  }
}

export function getFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key)
    
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('❌ Error reading from localStorage:', error.message)
    
    return null
  }
}

export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key)
    
    console.log(`🗑️ Removed from localStorage: ${key}`)
    
    return true
  } catch (error) {
    console.error('❌ Error removing from localStorage:', error.message)
    
    return false
  }
}

export function clearLocalStorage() {
  try {
    localStorage.clear()
    
    console.log('🗑️ Cleared all localStorage data')
    
    return true
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error.message)
    
    return false
  }
}

// ==================== DEBUG LOGGING ====================

export function logDebug(message, data = null) {
  const timestamp = new Date().toLocaleTimeString()
  
  if (data) {
    console.log(`[${timestamp}] 🔍 DEBUG: ${message}`, data)
  } else {
    console.log(`[${timestamp}] 🔍 DEBUG: ${message}`)
  }
}

export function logError(message, error = null) {
  const timestamp = new Date().toLocaleTimeString()
  
  if (error) {
    console.error(`[${timestamp}] ❌ ERROR: ${message}`, error)
  } else {
    console.error(`[${timestamp}] ❌ ERROR: ${message}`)
  }
}

export function logSuccess(message, data = null) {
  const timestamp = new Date().toLocaleTimeString()
  
  if (data) {
    console.log(`[${timestamp}] ✅ SUCCESS: ${message}`, data)
  } else {
    console.log(`[${timestamp}] ✅ SUCCESS: ${message}`)
  }
}

// ==================== ARRAY HELPERS ====================

export function shuffleArray(array) {
  const shuffled = [...array]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

export function getRandomItems(array, count) {
  const shuffled = shuffleArray(array)
  
  return shuffled.slice(0, Math.min(count, array.length))
}

// ==================== OBJECT HELPERS ====================

export function groupByKey(array, key) {
  return array.reduce((groups, item) => {
    const groupKey = item[key]
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    
    groups[groupKey].push(item)
    
    return groups
  }, {})
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// ==================== DELAY HELPER ====================

export function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// ==================== ERROR HANDLER ====================

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message)
    
    this.code = code
    this.timestamp = new Date().toISOString()
  }
}

export function handleError(error) {
  if (error instanceof AppError) {
    logError(`[${error.code}] ${error.message}`)
  } else if (error instanceof Error) {
    logError(error.message, error)
  } else {
    logError('An unknown error occurred', error)
  }
}

// ==================== NOTIFICATION SYSTEM ====================

export function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div')
  
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `
  
  const colors = {
    success: '#4ade80',
    error: '#f87171',
    warning: '#facc15',
    info: '#60a5fa'
  }
  
  notification.style.backgroundColor = colors[type] || colors.info
  notification.style.color = type === 'warning' ? '#000' : '#fff'
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    
    setTimeout(() => notification.remove(), 300)
  }, duration)
}

// ==================== DEBOUNCE HELPER ====================

export function debounce(func, wait) {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// ==================== THROTTLE HELPER ====================

export function throttle(func, limit) {
  let inThrottle

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      
      inThrottle = true
      
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
