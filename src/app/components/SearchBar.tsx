import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  return (
    <form className="flex justify-center mb-8">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search for articles"
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
} 