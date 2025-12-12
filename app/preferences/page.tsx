'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    desired_titles: '',
    location: '',
    remote_only: false,
    salary_range_min: '',
    salary_range_max: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desired_titles: formData.desired_titles.split(',').map((t) => t.trim()),
          location: formData.location,
          remote_only: formData.remote_only,
          salary_range_min: formData.salary_range_min
            ? parseInt(formData.salary_range_min)
            : undefined,
          salary_range_max: formData.salary_range_max
            ? parseInt(formData.salary_range_max)
            : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Set Your Preferences</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Help us find the perfect jobs for you
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Desired Job Titles (comma-separated)
              </label>
              <input
                type="text"
                value={formData.desired_titles}
                onChange={(e) =>
                  setFormData({ ...formData, desired_titles: e.target.value })
                }
                placeholder="Software Engineer, Product Manager"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA or Remote"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.remote_only}
                  onChange={(e) =>
                    setFormData({ ...formData, remote_only: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Remote Only</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Salary (optional)
                </label>
                <input
                  type="number"
                  value={formData.salary_range_min}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_range_min: e.target.value })
                  }
                  placeholder="80000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Salary (optional)
                </label>
                <input
                  type="number"
                  value={formData.salary_range_max}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_range_max: e.target.value })
                  }
                  placeholder="150000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Saving...' : 'Save & Continue to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
