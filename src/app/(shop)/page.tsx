import { getPaginatedProductsWithImages } from "@/actions";
import { ProductGrid, Title } from "@/components";


interface Props {
  searchParams: {
    page?: string;
  }
}


export default async function Home({ searchParams }: Props) {

  const page = ( searchParams.page ) ? parseInt( searchParams.page ) : 1;

  const { products } = await getPaginatedProductsWithImages({ page });

  return (
    <>
      <Title 
        title="Shop"
        subtitle="All our products in one place"
        className="mb-2"
      />

      <ProductGrid products={ products } />
    </>
  );
}
