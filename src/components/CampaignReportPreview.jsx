import React from 'react';

const CampaignReportPreview = () => {
  const metrics = [
    { icon: "✅", label: "Views" },
    { icon: "✅", label: "Likes" },
    { icon: "✅", label: "Comments" },
    { icon: "✅", label: "Engagement Rate" },
    { icon: "✅", label: "Submission Date" },
    { icon: "✅", label: "EMV Comparison vs. Meta & Google Ads" }
  ];

  return (
    <section className="w-full bg-[var(--background)] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Desktop: Left-Right Layout, Mobile: Stacked */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Side: Blurred PDF Report Sample */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              {/* Mock PDF Report */}
              <div className="bg-white rounded-lg shadow-2xl p-8 transform rotate-0 hover:rotate-0 transition-transform duration-300">
                {/* PDF Header */}
                <div className="border-b-2 border-gray-200 pb-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-24 h-6 bg-lime-400 rounded"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-48 h-8 bg-gray-800 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-400 rounded"></div>
                </div>

                {/* Mock Charts and Data */}
                <div className="space-y-6">
                  {/* Chart Area */}
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end justify-around p-4">
                    <div className="w-8 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-8 bg-purple-400 rounded-t" style={{height: '80%'}}></div>
                    <div className="w-8 bg-green-400 rounded-t" style={{height: '45%'}}></div>
                    <div className="w-8 bg-yellow-400 rounded-t" style={{height: '90%'}}></div>
                    <div className="w-8 bg-red-400 rounded-t" style={{height: '70%'}}></div>
                  </div>

                  {/* Mock Data Rows */}
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex justify-between items-center">
                        <div className="w-24 h-4 bg-gray-300 rounded"></div>
                        <div className="w-16 h-4 bg-gray-400 rounded"></div>
                        <div className="w-12 h-4 bg-green-300 rounded"></div>
                      </div>
                    ))}
                  </div>

                  {/* Mock Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="w-32 h-5 bg-gray-600 rounded mb-3"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-20 h-4 bg-lime-300 rounded"></div>
                      <div className="w-24 h-4 bg-blue-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blur Overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-black/10 rounded-lg flex items-center justify-center">
                <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Sample Report Preview
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Text Content and Metrics */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Title */}
            <h2 className="text-[25px] md:text-[30px] text-lime-100 FontNoto mb-4 leading-tight">
              Tracking performance with spreadsheets
            </h2>
            
            {/* Subheadline */}
            <p className="text-gray-200 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto lg:mx-0 FontNoto mb-8">
              Matchably shows real-time campaign results — without any manual work.
            </p>
            
            {/* Metrics Tracked */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold FontNoto mb-6">
                Metrics Tracked:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-300 text-base FontNoto"
                  >
                    <span className="text-lime-400 text-lg">{metric.icon}</span>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignReportPreview;
