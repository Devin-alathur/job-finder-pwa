import { useState } from 'react';
import jobs from '../data/jobs';

//link todo page to home...
import Link from 'next/link';
import NavBar from '../components/NavBar';


export default function Home() {
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <><NavBar />
    <main className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Finder App - Devin</h1>
        <p className="text-gray-500">Find your dream job instantly.</p>
      </header>

      {/* <div className="my-6">
        <Link href="/todo" className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          Go to To-Do List 📝
        </Link>
      </div> */}


      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <section className="grid gap-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-gray-500">{job.company} • {job.location}</p>
            <p className="text-sm text-gray-400">{job.type} • {job.salary}</p>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-400">No jobs found.</p>
        )}
      </section>
    </main></>
  );
}
