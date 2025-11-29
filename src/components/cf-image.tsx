import Image, { ImageProps } from 'next/image'

type Props = ImageProps & { transformed?: boolean }

export default function CFImage({ transformed = true, ...props }: Props) {
  if (transformed) {
    return <Image {...props} unoptimized />
  }
  return <Image {...props} />
}
