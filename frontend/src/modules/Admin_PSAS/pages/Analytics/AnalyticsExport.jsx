import React, { useState } from 'react';

function AnalyticsExport({ onExport, isExporting = false }) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('monthly');

  const handleExport = () => {
    if (onExport) {
      onExport({
        format: exportFormat,
        dateRange: dateRange,
        reportType: 'full'
      });
    } else {
      // Default export behavior
      console.log('Exporting analytics report...', {
        format: exportFormat,
        dateRange: dateRange,
        reportType: 'full'
      });
    }
  };

  return (
    <div className="w-full -mt-2">
      {/* Export Section - Matching Figma Design */}
      <div 
        className="bg-[#142240] rounded-[10px] w-full h-20 flex items-center justify-between px-[41px] relative"
        style={{
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Left Content */}
        <div className="flex flex-col">
          {/* Main Title */}
          <h3 
            className="text-white text-[16px] font-semibold mb-2" 
            style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
          >
            Monthly Analytics Report
          </h3>
          
          {/* Description */}
          <p 
            className="text-white text-[13px] font-medium max-w-[532px]" 
            style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
          >
            Export comprehensive report with all consultation data, restrictions, and analytics
          </p>
        </div>

        {/* Right Content - Export Button */}
        <div className="flex items-center">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`bg-white rounded-[10px] w-[236px] h-[49px] flex items-center justify-center gap-2.5 px-2.5 transition-all duration-200 ${
              isExporting 
                ? 'opacity-75 cursor-not-allowed' 
                : 'hover:bg-gray-100 hover:shadow-md active:scale-95'
            }`}
          >
            {/* Download Icon */}
            {isExporting ? (
              // Loading spinner
              <div className="w-6 h-6 border-2 border-[#005CCD] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M4 15V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V15M8 11L12 15L16 11M12 3V15" 
                  stroke="#005CCD" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
            
            {/* Button Text */}
            <span 
              className="text-[#005CCD] text-[15px] font-bold" 
              style={{ fontFamily: 'Inter', lineHeight: '1.21em' }}
            >
              {isExporting ? 'Exporting...' : 'Export Full Report (PDF)'}
            </span>
          </button>
        </div>
      </div>

      {/* Additional Export Options (Optional - can be hidden by default) */}
      {/* <div className="mt-6 bg-white rounded-[10px] p-6 shadow-sm border border-gray-200"> */}
        {/* <h4 className="text-gray-800 text-lg font-semibold mb-4" style={{ fontFamily: 'Inter' }}>
          Export Options
        </h4> */}
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
          {/* Export Format */}
          {/* <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-[5px] text-sm text-gray-700 focus:outline-none focus:border-[#005CCD] focus:ring-1 focus:ring-[#005CCD]"
              style={{ fontFamily: 'Inter' }}
            >
              <option value="pdf">PDF Report</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV Data</option>
            </select>
          </div> */}

          {/* Date Range */}
          {/* <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>
              Report Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-[5px] text-sm text-gray-700 focus:outline-none focus:border-[#005CCD] focus:ring-1 focus:ring-[#005CCD]"
              style={{ fontFamily: 'Inter' }}
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div> */}
        {/* </div> */}

        {/* Export Summary */}
        {/* <div className="mt-6 p-4 bg-gray-50 rounded-[5px]">
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter' }}>
            <span className="font-semibold">Export Summary:</span> {exportFormat.toUpperCase()} format, {dateRange} data including consultation metrics, office statistics, and user analytics.
          </p>
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default AnalyticsExport;