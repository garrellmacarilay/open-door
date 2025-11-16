import React from 'react'
// import AnalyticsBar from './AnalyticsBar.jsx'
import ChartBarLabel from './ChartBarLabel.jsx'
import AnalyticsExport from './AnalyticsExport.jsx'
import AnalyticDynamicStats from './AnalyticDynamicStats.jsx'
import ChartPieLegend from './ChartPieLegend.jsx' 

function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <AnalyticsExport />
      <AnalyticDynamicStats />
      <div className="flex flex-row gap-2">
        <ChartBarLabel />
        <ChartPieLegend />
      </div>
    </div>
  )
}

export default AdminAnalytics