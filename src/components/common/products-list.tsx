"use client";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferInsert & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductsList = ({ title, products }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold px-5">{title}</h3>
      <div className="flex gap-4 w-full overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
