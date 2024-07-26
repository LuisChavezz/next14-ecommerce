// import { notFound } from "next/navigation";

import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Product, Category } from "@/interfaces"



const seedProducts = initialData.products

interface Props {
  params: {
    id: Category;
  }
}

export default function CategoryPage({ params }: Props) {

  const { id } = params;
  const products = seedProducts.filter(( product: Product ) => product.gender === id );

  // if ( id === 'kids' ) {
  //   notFound();
  // }

  return (
    <>
      <Title 
        title={ `${ id } Category` }
        subtitle= { `All ${ id } products in one place` }
        className="mb-2 capitalize"
      />

      <ProductGrid products={ products } />
    </>
  );
}