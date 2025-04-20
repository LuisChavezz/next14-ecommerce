import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";


interface Props {
  params: {
    slug: string;
  }
}

export default async function ProductPage({ params }: Props) {

  // Fetch product data based on the slug, and categories
  const { slug } = params;
  const [ product, { categories } ] = await Promise.all([
    getProductBySlug(slug),
    getCategories()
  ]);

  // Check if product is not found
  if ( !product && slug !== 'new' ) {
    redirect('/admin/products');
  }
  
  const title = (slug === 'new') ? 'New Product' : 'Edit Product';

  return (
    <>
      <Title title={ title } />
      <ProductForm 
        product={ product ?? {} } 
        categories={ categories }
      />
    </>
  );
}