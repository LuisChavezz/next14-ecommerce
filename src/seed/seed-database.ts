import { initialData } from "./seed"
import { countries } from "./seed-countries";
import prisma from '../lib/prisma';


async function main(){

  // 1. Delete all data from the database
  await Promise.all([
    await prisma.orderAddress.deleteMany(), // delete all order addresses
    await prisma.orderItem.deleteMany(), // delete all order items
    await prisma.order.deleteMany(), // delete all orders

    await prisma.userAddress.deleteMany(), // delete all user addresses
    await prisma.user.deleteMany(), // delete all users
    await prisma.country.deleteMany(), // delete all countries

    await prisma.productImage.deleteMany(), // delete all product images
    await prisma.product.deleteMany(), // delete all products
    await prisma.category.deleteMany(), // delete all categories
  ]);

  // 2. Insert initial categories data
  const { categories, products, users } = initialData;

  await prisma.user.createMany({
    data: users,
  });

  await prisma.country.createMany({
    data: countries,
  });

  const categoriesDate = categories.map(( name ) => ({ name }));

  await prisma.category.createMany({
    data: categoriesDate,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLocaleLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  // 3. Insert initial products data
  products.forEach(async (product) => {
    const { type, images, ...rest } = product; // extract type and images from product

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type.toLocaleLowerCase()],
      },
    });
  
    // Insert images for the product
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });


  console.log('Seed was executed successfully');
}


(() => {
  if ( process.env.NODE_ENV !== 'development' ) {
    console.error('Seed script should be run only in development environment');
    return;    
  }
  
  main();
})();