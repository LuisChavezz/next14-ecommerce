import Image from "next/image"


interface Props {
  src?: string
  alt: string
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"]
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"]
  width: number
  height: number
}

export const ProductImage = ({
  src,
  alt,
  className,
  style,
  width,
  height,
}: Props) => {

  // If the src is not a URL, we assume it's a local path
  const localSrc = ( src ) 
    ? ( src.startsWith('http') )
      ? src
      : `/products/${ src }`
    : '/imgs/placeholder.jpg'

  return (
    <Image
      src={ localSrc }
      alt={ alt }
      width={ width }
      height={ height }
      className={ className }
      style={ style }
    />
  )
}
