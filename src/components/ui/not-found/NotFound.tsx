import { titleFont } from "@/config/fonts"
import Image from "next/image"
import Link from "next/link"


export const NotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle">
      <div className="text-center px-5 mx-5">
        <h2 className={ `${ titleFont } antialiased text-9xl` }>404</h2>
        <p className="font-semibold text-xl">Whoops! We are very sorry for the inconvenience.</p>
        <p className="font-light">
          <span>Go back to the </span>
          <Link 
           href="/"
           className="font-normal hover:underline transition-all"
          >
            home page
          </Link>
        </p>
      </div>

      <div className="px-5 mx-5">
        <Image
          src="/imgs/starman_750x750.png"
          alt="Starman"  
          width={ 550 }
          height={ 550 }
        />
      </div>
    </div>
  )
}
