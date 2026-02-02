/**
 * Checks for active warnings based on provided customer identifiers.
 *
 * @param {Array<Warning>} warningsRepository - The full list of warnings to search against.
 * @param {Object} identifiers - The customer identifiers to match.
 * @param {string} [identifiers.phone] - Customer phone number.
 * @param {string} [identifiers.name] - Customer name.
 * @param {string} [identifiers.paymentId] - Payment method identifier.
 * @returns {Array<Warning>} - A list of matching active warnings.
 */
export function findActiveWarnings(warningsRepository, identifiers) {
  const { phone, name, paymentId } = identifiers

  if (
    (!phone && !name && !paymentId) ||
    !warningsRepository ||
    warningsRepository.length === 0
  ) {
    return []
  }

  return warningsRepository.filter((warning) => {
    if (!warning.isActive) {
      return false
    }

    if (
      phone &&
      warning.customerIdentifier.phone &&
      warning.customerIdentifier.phone === phone
    ) {
      return true
    }

    if (
      name &&
      warning.customerIdentifier.name &&
      warning.customerIdentifier.name.toLowerCase() === name.toLowerCase()
    ) {
      return true
    }

    if (
      paymentId &&
      warning.customerIdentifier.paymentId &&
      warning.customerIdentifier.paymentId === paymentId
    ) {
      return true
    }

    return false
  })
}
