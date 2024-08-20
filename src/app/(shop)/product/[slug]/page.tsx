export const revalidate = 604800; // 7 days

import { Metadata, ResolvingMetadata } from "next";
import { getProductBySlug } from "@/actions";
import { ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

// Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  const product = await getProductBySlug(slug)
 
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? 'Product not found',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Product not found',
      description: product?.description ?? '',
      images: [`/products/${ product?.images[1] }`],
    },
  }
}

export default async function ProductPage({ params }: Props) {

  const slug = params.slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshows */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow*/}
        <ProductMobileSlideShow images={ product.images } title={ product.title } className=" md:hidden" />

        {/* Desktop Slideshow */}
        <ProductSlideShow images={ product.images } title={ product.title } className="hidden md:block" />
      </div>

      {/* Details */}
      <div className="col-span-1 px-5">

        <StockLabel slug={ product.slug } />

        <h1 className={`${ titleFont.className } antialiased font-bold text-xl `}>
          { product.title }
        </h1>
        <p className="text-lg mb-5">${ product.price }</p>

        {/* Size selector */}
        <SizeSelector availableSizes={ product.sizes } selectedSize={ "XL" } />

        {/* Quantity selector */}
        <QuantitySelector quantity={ 2 } inStock={ product.inStock } />

        {/* Add to cart button */}
        <div className="btn-primary my-5">
          Add to cart
        </div>

        {/* Description */}
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{ product.description }</p>
      </div>
    </div>
  );
}