import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...rest }: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label" htmlFor={id}>{label}</label>}
      <input id={id} className={`input-field ${error ? 'input-error' : ''} ${className}`} {...rest} />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  )
}
