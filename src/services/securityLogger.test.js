import { beforeEach, describe, expect, it } from 'vitest'
import {
  createLogEntry,
  getSecurityLogs,
  sanitizeLogDetails,
  securityLogger,
} from './securityLogger'

describe('securityLogger', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('redacts sensitive fields recursively', () => {
    expect(sanitizeLogDetails({
      taskTitle: 'Private task',
      nested: { accessToken: 'secret-value' },
      taskCount: 2,
    })).toEqual({
      taskTitle: '[REDACTED]',
      nested: { accessToken: '[REDACTED]' },
      taskCount: 2,
    })
  })

  it('creates a structured log entry', () => {
    const entry = createLogEntry('warn', 'storage.invalid_json')

    expect(entry).toMatchObject({
      level: 'warn',
      event: 'storage.invalid_json',
      details: {},
    })
    expect(Number.isNaN(Date.parse(entry.timestamp))).toBe(false)
  })

  it('keeps logs in a session-scoped buffer', () => {
    securityLogger.info('task.created', { taskCount: 1 })

    expect(getSecurityLogs()).toEqual([
      expect.objectContaining({
        level: 'info',
        event: 'task.created',
        details: { taskCount: 1 },
      }),
    ])
  })

  it('does not fail when the existing buffer is malformed', () => {
    sessionStorage.setItem('task-manager-security-logs', '{invalid')

    expect(() => securityLogger.warn('storage.invalid_json')).not.toThrow()
    expect(getSecurityLogs()).toHaveLength(1)
  })
})
