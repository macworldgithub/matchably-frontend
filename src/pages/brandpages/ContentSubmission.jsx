import React from 'react';
import { FaInstagram, FaTiktok, FaExternalLinkAlt } from 'react-icons/fa';

export default function ContentSubmission({ creators, handleViewContent, getContentStatusColor }) {
  const submittedCreators = creators.filter(
    c => c.contentUrls?.instagram || c.contentUrls?.tiktok
  );


  return (
    <>
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold FontNoto text-white">Content Submissions</h2>
        <p className="text-gray-400 text-sm mt-1">Review and manage content submissions from creators</p>
      </div>

      {submittedCreators.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-400 FontNoto">No content submissions yet.</p>
          <p className="text-gray-500 text-sm mt-2">Content will appear here once creators submit their posts.</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submittedCreators.map((creator) => (
              <div key={creator.id} className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold FontNoto">{creator.name}</h3>
                    <p className="text-gray-400 text-sm">{creator.socialId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getContentStatusColor(creator.contentStatus)}`}>
                    {creator.contentStatus}
                  </span>
                </div>

                <div className="space-y-3">
                  {creator.contentUrls?.instagram && creator.contentUrls?.instagram.map((instagram) => (
                    <div className="flex items-center space-x-2">
                      <FaInstagram className="text-pink-400" />
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-400 hover:text-lime-300 transition-colors text-sm"
                      >
                        Instagram Post <FaExternalLinkAlt className="inline w-3 h-3 ml-1" />
                      </a>
                    </div>
                 ) )}
                  {creator.contentUrls?.tiktok && creator.contentUrls?.tiktok.map((tiktok) => (
                 
                    <div className="flex items-center space-x-2">
                      <FaTiktok className="text-white" />
                      <a
                        href={tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-400 hover:text-lime-300 transition-colors text-sm"
                      >
                        TikTok Video <FaExternalLinkAlt className="inline w-3 h-3 ml-1" />
                      </a>
                    </div>
                 ) )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => handleViewContent(creator)}
                    className="w-full bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg FontNoto font-medium transition-colors"
                  >
                    Review Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
