import type { ForwardedRef, InputHTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"

export function InputLayout({
  header,
  children
}: {
  header?: string
  children: ReactNode
}) {
  return (
    <div className="my-3 flex flex-col bg-charcoal border-2 border-blue-500 rounded-md px-2 py-1">
      <label className="font-medium text-xs text-blue-500">{header}</label>
      {children}
    </div>
  )
}

export const Input = forwardRef(
  (
    {
      className,
      ...props
    }: {
      className?: string
    } & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<any>
  ) => {
    let Class =
      "w-full font-light text-sm text-white bg-transparent focus:outline-none"
    if (className) Class += ` ${className}`
    return <input ref={ref} className={Class} {...props} />
  }
)
