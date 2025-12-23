import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const SkillRadarChart = ({ data }) => {
    // Expecting data in format: [{ subject: 'Technical', A: 120, fullMark: 150 }, ...]

    // Default data for preview
    const defaultData = [
        { subject: 'Technical', A: 80, fullMark: 100 },
        { subject: 'Communication', A: 90, fullMark: 100 },
        { subject: 'Problem Solving', A: 70, fullMark: 100 },
        { subject: 'Confidence', A: 85, fullMark: 100 },
        { subject: 'Culture Fit', A: 65, fullMark: 100 },
    ];

    const chartData = data || defaultData;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillRadarChart;
