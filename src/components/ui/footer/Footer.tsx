import { titleFont } from "@/config/fonts"
import Link from "next/link"


export const Footer = () => {
  return (
    <div className="flex w-full justify-center space-x-3 text-sm mb-10">
      <Link href="/" >
        <span className={ `${ titleFont.className } antialiased font-bold` }>Teslo </span>
        <span>| shop</span>
        <span>© { new Date().getFullYear() }</span>
      </Link>

      <Link href="/" >
        Privacy & Legal
      </Link>

      <Link href="/" >
        Contact Us
      </Link>
    </div>
  )
}
