'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-black text-neutral-400 min-h-screen flex items-center justify-center relative font-sans">
      <div className="absolute bottom-4 left-4">
        <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center border border-neutral-700 rounded-md text-neutral-500 hover:text-white hover:border-white transition-colors">
            N
        </Link>
      </div>

      <div className="border border-neutral-800 rounded-2xl p-24">
        <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-medium text-white">404</h1>
            <div className="w-px h-8 bg-neutral-700"></div>
            <p>This page could not be found.</p>
        </div>
      </div>
    </div>
  );
}
