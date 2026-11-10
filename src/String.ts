/**
 * Replaces placeholders in a string with corresponding values from an object.
 * @param template - The string containing placeholders to replace.
 * @param data - An object containing key-value pairs to replace placeholders in the template string.
 * @returns The formatted string with placeholders replaced by corresponding values from the data object.
 */
export function formatString(template: string, data: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(data, key) ? String(data[key]) : match
  )
}
