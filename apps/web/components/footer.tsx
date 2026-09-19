import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#081c0d] py-10 text-sm text-green-100/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <strong className="text-white">ASF Agro Industry</strong>
          <span className="ml-2">· Animal Feed Processing P/S</span>
        </div>
        <div className="flex gap-5">
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>© {new Date().getFullYear()} ASF Agro Industry</div>
      </div>
    </footer>
  );
}
