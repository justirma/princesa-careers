'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, trackerRes] = await Promise.all([
        fetch('/api/profile/preferences'),
        fetch('/api/tracker/list'),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
      }

      if (trackerRes.ok) {
        const trackerData = await trackerRes.json();
        setStats(trackerData.stats);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Profile Found</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Please complete onboarding first
          </p>
          <Link
            href="/onboarding"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Start Onboarding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Here's your job search overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saved</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.saved || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applied</div>
            <div className="text-3xl font-bold text-green-600">{stats?.applied || 0}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Interviewing
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.interviewing || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Offers</div>
            <div className="text-3xl font-bold text-yellow-600">{stats?.offer || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/recommendations"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Job Recommendations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Find your perfect match
            </p>
          </Link>

          <Link
            href="/tracker"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold mb-1">Application Tracker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your applications
            </p>
          </Link>

          <Link
            href="/chat"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-semibold mb-1">Career Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chat with your AI assistant
            </p>
          </Link>

          <Link
            href="/preferences"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">⚙️</div>
            <h3 className="font-semibold mb-1">Preferences</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your settings
            </p>
          </Link>
        </div>

        {/* Profile Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Desired Titles: </span>
              <span className="text-gray-700 dark:text-gray-300">
                {profile.desired_titles?.join(', ') || 'Not set'}
              </span>
            </div>
            <div>
              <span className="font-semibold">Location: </span>
              <span className="text-gray-700 dark:text-gray-300">
                {profile.location || 'Not set'}
              </span>
            </div>
            <div>
              <span className="font-semibold">Remote Only: </span>
              <span className="text-gray-700 dark:text-gray-300">
                {profile.remote_only ? 'Yes' : 'No'}
              </span>
            </div>
            {profile.skills && (
              <div>
                <span className="font-semibold">Skills: </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.slice(0, 10).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 10 && (
                    <span className="px-3 py-1 text-gray-600 text-sm">
                      +{profile.skills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
