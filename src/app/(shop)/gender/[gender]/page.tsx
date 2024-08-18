export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";


interface Props {
  params: {
    gender: Gender;
  }
  searchParams: {
    page?: string;
  }
}

export default async function GenderPage({ params, searchParams }: Props) {

  const { gender } = params;
  const page = ( searchParams.page ) ? parseInt( searchParams.page ) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page, gender });

  if ( products.length === 0 ) {
    redirect(`/gender/${ gender }`)
  }

  return (
    <>
      <Title 
        title={ `${ gender } Products` }
        subtitle= { `All ${ gender } products in one place` }
        className="mb-2 capitalize"
      />

      <ProductGrid products={ products } />

      <Pagination totalPages={ totalPages } />
    </>
  );
}