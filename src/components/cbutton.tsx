;
/*  async function getImage(val: number) {
    setImgSrc(<img src={`data-base64:~assets/button-type/3.png`} alt="icon" />)
    /!*import(`data-base64:~assets/button-type/${val}.png`)
      .then((image) => {
        setImgSrc(<img src={`${image}`} alt="icon" />)
      })
      .catch((error) => {
        console.error("Error loading image:", error)
      })*!/
  }*/
import type { ImgHTMLAttributes } from 'react';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';



import { Loading } from '~components/loading';





type ButtonProps = {
  ctype?: number | 0 | 1 | 2
  className?: string
  children?: ReactNode
  loading?: boolean
  disabled?: boolean
  big?: boolean
  animation?: boolean
}

export function Button({
  ctype,
  className = "",
  children,
  loading = false,
  disabled = false,
  big = false,
  animation = false,
  ...attributes
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const getDefaultClass = (): string => {
    let val: string[] = [
      "flex flex-row flex-nowrap items-center justify-center rounded-md transition"
    ]
    val.push(big ? "py-2.5" : "py-2")

    if (disabled) val.push("bg-dark cursor-not-allowed")
    else if (ctype === 0)
      val.push(
        "bg-green-500 hover:bg-green-700 focus:bg-green-800 active:bg-green-900"
      )
    else if (ctype === 1)
      val.push(
        "bg-yellow-500 hover:bg-yellow-700 focus:bg-yellow-800 active:bg-yellow-900"
      )
    else if (ctype === 2)
      val.push("bg-red-500 hover:bg-red-700 focus:bg-red-800 active:bg-red-900")
    else {
      val.push(
        "bg-blue-500 hover:bg-blue-700 focus:bg-blue-800 active:bg-blue-900"
      )
    }
    val.push(
      loading && !disabled
        ? "disabled:opacity-75 cursor-wait"
        : "cursor-pointer"
    )
    if (className) val.push(className)
    return val.join(" ")
  }

  if (loading) {
    const loadingIconClass = big ? "h-7 py-1" : "h-6 py-1"

    return (
      <button className={getDefaultClass()} {...attributes} disabled>
        <Loading imgClass={loadingIconClass} animation={animation} />
      </button>
    )
  }

  if (disabled) {
    return (
      <button className={getDefaultClass()} {...attributes} disabled>
        {children}
      </button>
    )
  }

  return (
    <button className={getDefaultClass()} {...attributes}>
      {children}
    </button>
  )
}

export function ButtonIcon({
  src,
  ...attributes
}: { src: string } & ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={src} alt="icon" className="w-5" {...attributes} />
}

export function ButtonText({
  text,
  big = false,
  className
}: {
  text: string
  big?: boolean
  className?: string
}) {
  let Class = "text-white"
  Class += big ? " font-semibold text-lg" : " font-medium text-base"
  if (className) Class += ` ${className}`
  return <span className={Class}>{text}</span>
}
