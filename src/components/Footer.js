import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-red-900 bg-opacity-90 border-b border-red-700 text-white py-4 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center gap-8">
        <Link href="/register" className="text-lg text-slate-300 hover:text-white transition-colors">Register</Link>
        <Link href="/kitchen" className="text-lg text-slate-300 hover:text-white transition-colors">Kitchen</Link>
        <Link href="/oven" className="text-lg text-slate-300 hover:text-white transition-colors">Oven</Link>
        <Link href="/monitor" className="text-lg text-slate-300 hover:text-white transition-colors">Monitor</Link>
      </div>
    </footer>
  );
}
