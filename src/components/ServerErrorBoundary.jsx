'use client'

import { useState } from 'react'

export default function ServerErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return fallback || <div>Something went wrong. Please try again later.</div>
  }

  try {
    return children
  } catch (err) {
    console.error('Server Component Error:', err)
    setHasError(true)
    return fallback || <div>Something went wrong. Please try again later.</div>
  }
}
