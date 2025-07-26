import { format, parseISO } from 'date-fns'

/**
 * Format date to MM/DD/YYYY format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date string (MM/DD/YYYY)
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MM/dd/yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format date and time to MM/DD/YYYY HH:MM AM/PM format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MM/dd/yyyy h:mm a')
  } catch (error) {
    console.error('Error formatting date time:', error)
    return ''
  }
} 