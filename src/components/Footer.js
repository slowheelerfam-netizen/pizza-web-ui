
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center">
        <Link href="/register" className="text-sm text-slate-400 hover:text-white transition-colors">
          Register
        </Link>
      </div>
    </footer>
  );
}
