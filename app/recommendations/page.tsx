'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
  source: string;
  similarity_score?: number;
  title_match?: boolean;
}

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [topMatches, setTopMatches] = useState<Job[]>([]);
  const [hiddenGems, setHiddenGems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshingJobs, setRefreshingJobs] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/jobs/recommendations?limit=50');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load recommendations');
      }

      setJobs(data.jobs || []);
      setTopMatches(data.topMatches || []);
      setHiddenGems(data.hiddenGems || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshJobs = async () => {
    setRefreshingJobs(true);
    try {
      const response = await fetch('/api/jobs/refresh', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        alert(`Jobs refreshed! Added ${data.stats.successful} new jobs.`);
        loadRecommendations();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(`Error refreshing jobs: ${err.message}`);
    } finally {
      setRefreshingJobs(false);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const response = await fetch('/api/tracker/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, status: 'saved' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Job saved to tracker!');
      } else {
        alert(data.error || 'Failed to save job');
      }
    } catch (err) {
      alert('Error saving job');
    }
  };

  const JobCard = ({ job }: { job: Job }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>
        {job.similarity_score && (
          <div className="text-sm font-semibold text-blue-600">
            {Math.round(job.similarity_score * 100)}% match
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span>📍 {job.location}</span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
          {job.source}
        </span>
        {job.title_match && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            Title Match
          </span>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {job.description.substring(0, 200)}...
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => handleSaveJob(job.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Save to Tracker
        </button>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          View Job
        </a>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <Link href="/onboarding" className="text-blue-600 hover:underline">
            Complete onboarding first
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Recommendations</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Personalized matches based on your profile
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefreshJobs}
              disabled={refreshingJobs}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {refreshingJobs ? 'Refreshing...' : 'Refresh Jobs'}
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {topMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">🎯 Top Matches</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {topMatches.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {hiddenGems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">💎 Hidden Gems</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Great matches you might not have considered
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {hiddenGems.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {jobs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Recommendations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No jobs available yet
            </p>
            <button
              onClick={handleRefreshJobs}
              disabled={refreshingJobs}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {refreshingJobs ? 'Loading Jobs...' : 'Load Jobs'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
