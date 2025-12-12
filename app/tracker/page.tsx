'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  notes: string;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    apply_url: string;
  };
}

interface GroupedApplications {
  saved: Application[];
  applied: Application[];
  interviewing: Application[];
  offer: Application[];
  rejected: Application[];
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [grouped, setGrouped] = useState<GroupedApplications>({
    saved: [],
    applied: [],
    interviewing: [],
    offer: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/tracker/list');
      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications || []);
        setGrouped(data.grouped || {});
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    applicationId: string,
    newStatus: string,
    currentNotes?: string
  ) => {
    try {
      const response = await fetch('/api/tracker/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: applicationId,
          status: newStatus,
          notes: currentNotes,
        }),
      });

      if (response.ok) {
        loadApplications();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
    }
  };

  const Column = ({
    title,
    status,
    apps,
    color,
  }: {
    title: string;
    status: string;
    apps: Application[];
    color: string;
  }) => (
    <div className="flex-1 min-w-[300px]">
      <div className={`${color} text-white px-4 py-3 rounded-t-lg font-semibold`}>
        {title} ({apps.length})
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow min-h-[400px] p-4 space-y-3">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <h3 className="font-semibold mb-1">{app.jobs.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {app.jobs.company}
            </p>
            <p className="text-xs text-gray-500 mb-3">📍 {app.jobs.location}</p>

            {app.notes && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 italic">
                {app.notes}
              </p>
            )}

            <div className="flex gap-1 flex-wrap">
              {status !== 'saved' && (
                <button
                  onClick={() => handleUpdateStatus(app.id, 'saved', app.notes)}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Saved
                </button>
              )}
              {status !== 'applied' && (
                <button
                  onClick={() => handleUpdateStatus(app.id, 'applied', app.notes)}
                  className="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded"
                >
                  Applied
                </button>
              )}
              {status !== 'interviewing' && (
                <button
                  onClick={() => handleUpdateStatus(app.id, 'interviewing', app.notes)}
                  className="text-xs px-2 py-1 bg-purple-200 hover:bg-purple-300 rounded"
                >
                  Interview
                </button>
              )}
              {status !== 'offer' && (
                <button
                  onClick={() => handleUpdateStatus(app.id, 'offer', app.notes)}
                  className="text-xs px-2 py-1 bg-green-200 hover:bg-green-300 rounded"
                >
                  Offer
                </button>
              )}
              {status !== 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(app.id, 'rejected', app.notes)}
                  className="text-xs px-2 py-1 bg-red-200 hover:bg-red-300 rounded"
                >
                  Reject
                </button>
              )}
            </div>

            <a
              href={app.jobs.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-xs text-blue-600 hover:underline"
            >
              View Job →
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading tracker...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-full px-4 py-8">
        <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold mb-2">Application Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your job applications
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No applications yet
            </p>
            <Link
              href="/recommendations"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Column
              title="Saved"
              status="saved"
              apps={grouped.saved}
              color="bg-gray-600"
            />
            <Column
              title="Applied"
              status="applied"
              apps={grouped.applied}
              color="bg-blue-600"
            />
            <Column
              title="Interviewing"
              status="interviewing"
              apps={grouped.interviewing}
              color="bg-purple-600"
            />
            <Column
              title="Offer"
              status="offer"
              apps={grouped.offer}
              color="bg-green-600"
            />
            <Column
              title="Rejected"
              status="rejected"
              apps={grouped.rejected}
              color="bg-red-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}
