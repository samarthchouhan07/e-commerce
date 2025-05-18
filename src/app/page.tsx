import { Categories } from "@/components/categories";
import { SearchProduct } from "@/components/search-prodiuct";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center mt-5">
        <SearchProduct />
      </div>
      <Categories />
    </>
  );
}
