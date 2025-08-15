import { desc } from "drizzle-orm";
import Image from "next/image";

import BrandsList from "@/components/common/brands-list";
import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductsList from "@/components/common/products-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    // limit: 4,
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  console.log(products);

  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
        <BrandsList />
        <ProductsList products={products} title="Mais vendidos" />
        <CategorySelector categories={categories} />
        <ProductsList products={newlyCreatedProducts} title="Novos Produtos" />
        <div className="px-5">
          <Image
            src="/banner-02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
