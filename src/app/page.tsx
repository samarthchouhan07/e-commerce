import { Categories } from "@/components/categories";
import { SearchProduct } from "@/components/search-prodiuct";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* <div className="flex items-center justify-center mt-5">
        <SearchProduct />
      </div>
      <Categories />
      <Link href={"/admin/tasks/create"}>
         Create Task
      </Link>
      <Link href={"explore"}>
        Explore
      </Link> */}
      <Link href={"/create-problem"}>Create real world problem</Link><br/>
      <Link href={"/problems"}>
        See all real world Problems
      </Link><br/>
      <Link href={"/leaderboard"}>
      Leaderboard
      </Link> <br/>
      <Link href={"/user-dashboard"}>
      User Dashboard
      </Link>
    </>
  );
}
