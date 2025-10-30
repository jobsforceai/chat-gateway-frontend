import Image from "next/image";

export default function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex items-center">
        <Image src="/logo-3d.png" alt="Jobsforce Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold text-white ml-3">Jobsforce</h1>
      </div>
    </header>
  );
}
