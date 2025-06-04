import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar() {
  const router = useRouter();

  const linkStyle = (path) =>
    `px-4 py-2 rounded-md font-medium transition ${
      router.pathname === path
        ? 'bg-blue-900 text-white'
        : 'text-gray-700 hover:bg-blue-100'
    }`;

  return (
    <nav className="bg-blue-200 border-b border-blue-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">My Daily App</h1>
        <div className="space-x-4">
          <Link href="/" className={linkStyle('/')}>
            Home
          </Link>
          <Link href="/todo" className={linkStyle('/todo')}>
            To-Do
          </Link>
        </div>
      </div>
    </nav>
  );
}
