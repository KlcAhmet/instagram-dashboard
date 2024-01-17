import { type ButtonHTMLAttributes, type ReactNode } from "react"





type ButtonProps = {
  ctype?: number | 0 | 1 | 2 | 3
  className?: string
  /*icon?: boolean*/
  children?: ReactNode
  loading?: boolean
  disabled?: boolean
}

export function Button({
  ctype,
  className = "",
  /*icon = false,*/
  children,
  loading = false,
  disabled = false,
  ...attributes
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  /*  const [imgSrc, setImgSrc] = useState(null)*/
  const getType = (): string => {
    switch (ctype) {
      case 0:
        return "bg-blue-purple"
      case 1:
        return "bg-emerald"
      case 2:
        return "bg-orange"
      case 3:
        return "bg-red"
      default:
        return "bg-indigo"
    }
  }

  let Class = `flex flex-row flex-nowrap items-center justify-center rounded-md ${getType()}`
  if (className) {
    Class += ` ${className}`
  }
  return (
    <button className={Class} disabled={disabled || loading} {...attributes}>
      {children}
    </button>
  )
}

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