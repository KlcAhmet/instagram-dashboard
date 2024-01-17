import LoadingIcon from "data-base64:~assets/app/loading.png"
import { type ReactNode } from "react"





type LoadingProps = {
  children?: ReactNode
  direction?: "row" | "column"
  imgClassName?: string
  animation?: boolean
}

export function Loading({
  children,
  direction = "row",
  imgClassName,
  animation = false
}: LoadingProps) {
  const style = {
    animation: animation && "spin 5s linear infinite"
  }
  // Base div
  const Direction = direction === "row" ? "flex-row" : "flex-col"
  const Class = `w-full h-full flex items-center justify-center ${Direction}`

  // img
  const imgClass = imgClassName ?? "w-16"

  return (
    <div className={Class}>
      <img
        src={`${LoadingIcon}`}
        alt="loading"
        style={style}
        className={imgClass}
      />
      {children}
      <style>
        {`
          @keyframes spin {
            0% { 
            transform: rotate(0deg);
            opacity: 0;
             }
            100% { 
            transform: rotate(360deg);
            opacity: 1;
             }
          }
        `}
      </style>
    </div>
  )
}

export function LoadingInfoText({
  text,
  className = "",
  animation = false
}: {
  text: string
  className?: string
  animation?: boolean
}) {
  const style = {
    animation: animation && "fadein 5s linear"
  }
  const Class = "text-center text-white font-bold " + className

  return (
    <div>
      <p style={style} className={Class}>
        {text}
      </p>
      <style>
        {`
          @keyframes fadein {
            0% { 
            opacity: 0;
             }
            100% { 
            opacity: 1;
             }
          }
        `}
      </style>
    </div>
  )
}
