import Image from "next/image";

import brandsListData from "@/db/brands-list-data";

const BrandsList = () => {
  return (
    <div className="flex gap-4 px-5 [&::-webkit-scrollbar]:hidden overflow-x-auto">
      {brandsListData.map((brand) => {
        return (
          <div key={brand.title} className="flex flex-col items-center">
            <div className="w-20 h-20 border-2 border-gray-200 rounded-3xl flex justify-center items-center">
              <Image
                src={brand.imageBrand}
                alt={brand.title}
                width={32}
                height={32}
              />
            </div>
            <h3 className="mt-2 font-medium text-sm text-center">
              {brand.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default BrandsList;
