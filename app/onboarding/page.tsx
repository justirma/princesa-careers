'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/profile/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      setExtractedProfile(data.profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/preferences');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Job Search Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's get started by uploading your resume
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {!extractedProfile ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Upload Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Processing...' : 'Upload & Extract Profile'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-green-600">
                  ✓ Profile Extracted Successfully
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {extractedProfile.skills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Experience Summary</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {extractedProfile.experience_summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Job Titles</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {extractedProfile.titles.join(', ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Industries</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {extractedProfile.industries.join(', ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {extractedProfile.location}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Remote Preference</h3>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      {extractedProfile.remote_preference}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
