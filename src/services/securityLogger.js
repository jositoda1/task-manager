const SECURITY_LOG_KEY = 'task-manager-security-logs'
const MAX_LOG_ENTRIES = 100
const MAX_DETAIL_DEPTH = 4
const SENSITIVE_KEY_PATTERN = /authorization|cookie|credential|password|secret|token|title/i

const sanitizeValue = (value, key = '', depth = 0, seen = new WeakSet()) => {
  if (SENSITIVE_KEY_PATTERN.test(key)) {
    return '[REDACTED]'
  }

  if (value === null || ['boolean', 'number'].includes(typeof value)) {
    return value
  }

  if (typeof value === 'string') {
    return value.slice(0, 200)
  }

  if (typeof value !== 'object' || depth >= MAX_DETAIL_DEPTH) {
    return String(value)
  }

  if (seen.has(value)) {
    return '[CIRCULAR]'
  }

  seen.add(value)

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) =>
      sanitizeValue(item, '', depth + 1, seen),
    )
  }

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      sanitizeValue(entryValue, entryKey, depth + 1, seen),
    ]),
  )
}

export const sanitizeLogDetails = (details = {}) => sanitizeValue(details)

export const createLogEntry = (level, event, details = {}) => ({
  timestamp: new Date().toISOString(),
  level,
  event,
  details: sanitizeLogDetails(details),
})

const persistEntry = (entry) => {
  try {
    let storedEntries = []

    try {
      storedEntries = JSON.parse(
        sessionStorage.getItem(SECURITY_LOG_KEY) ?? '[]',
      )
    } catch {
      // A malformed log buffer is discarded so it cannot prevent future
      // security events from being recorded.
    }

    const entries = Array.isArray(storedEntries) ? storedEntries : []

    sessionStorage.setItem(
      SECURITY_LOG_KEY,
      JSON.stringify([...entries, entry].slice(-MAX_LOG_ENTRIES)),
    )
  } catch {
    // Logging must never break the application when browser storage is
    // unavailable, full, or contains malformed data.
  }
}

const writeLog = (level, event, details) => {
  const entry = createLogEntry(level, event, details)

  persistEntry(entry)

  // The session buffer is the primary local destination. Console output is
  // useful during development, while production can later add a remote sink.
  if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    const method = level === 'info' ? 'info' : level
    console[method]('[security]', entry)
  }

  return entry
}

export const securityLogger = {
  info: (event, details) => writeLog('info', event, details),
  warn: (event, details) => writeLog('warn', event, details),
  error: (event, details) => writeLog('error', event, details),
}

export const getSecurityLogs = () => {
  try {
    const entries = JSON.parse(
      sessionStorage.getItem(SECURITY_LOG_KEY) ?? '[]',
    )

    return Array.isArray(entries) ? entries : []
  } catch {
    return []
  }
}
