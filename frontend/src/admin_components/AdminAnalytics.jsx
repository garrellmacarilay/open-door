import { useState } from 'react'

import ConsultationStats from "../components/ConsultationStats";
import ConsultationTrends from "../components/ConsultationTrends";
import ServiceDistribution from "../components/ServiceDistribution";
import api from '../utils/api'
export default function AdminAnalytics() {
    const [downloading, setDownloading] = useState(false)

    const downloadReport = async () => {
        setDownloading(true)
        try {
            const res = await api.get('/admin/analytics/generate-report', {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a')
            link.href = url

            link.setAttribute(
                "download",
                `consultation_report_${new Date().toISOString().slice(0,7 )}.pdf`
            )

            document.body.appendChild(link);
            link.click()
            link.remove()

        } catch (err) {
            console.error('Failed to download report:', err)
        }
    }
    return (
        <div className="p-6 space-y-6">
            <button
                onClick={downloadReport}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={downloading}
            >
                {downloading ? "Downloading..." : "Export Full Report (PDF)"}
            </button>
            <ConsultationStats />
            <ConsultationTrends />
            <ServiceDistribution />
        </div>
    )
}