import React from 'react'
// import AnalyticsBar from './AnalyticsBar.jsx'
import ChartBarLabel from './ChartBarLabel.jsx'
import AnalyticsExport from './AnalyticsExport.jsx'
import AnalyticDynamicStats from './AnalyticDynamicStats.jsx'
import ChartPieLegend from './ChartPieLegend.jsx' 
import { useConsultationStats } from '../../../../hooks/adminHooks.js'

function AdminAnalytics() {
  const { stats, loading, error } = useConsultationStats()

  if (loading) return <div className="p-8">Loading stats...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load analytics</div>;
  return (
    <div className="flex flex-col gap-3 p-8">
      <AnalyticsExport />
      <AnalyticDynamicStats 
        totalConsultations={stats?.total}
        totalConsultationsChange={stats?.percentages?.total}
        approved={stats?.completed}
        approvedChange={stats?.percentages?.completed}
        cancelled={stats?.cancelled}
        cancelledChange={stats?.percentages?.cancelled}
      />
      <div className="flex flex-row gap-3">
        <ChartBarLabel />
        <ChartPieLegend />
      </div>
    </div>
  )
}

export default AdminAnalytics