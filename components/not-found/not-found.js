import Link from "next/link";
import NotFoundSVG from "@/svgs/social-svgs/notFound";

export default function NotFound() {
  return (
    <div className="h-full">
      <div className="flex justify-center text-tock-green hover:text-tock-blue mt-12">
        <Link href="/">Return Home</Link>
      </div>
      <NotFoundSVG />
      <svg></svg>
    </div>
  );
}
