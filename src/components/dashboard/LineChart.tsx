import React from 'react';

interface ChartData { day: string; value: number; }

export const LineChart = ({ data }: { data: ChartData[] }) => {
    const width = 300, height = 100;
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.value / maxVal) * (height - 10) - 5}`).join(' ');

    return (
        <svg viewBox={`0 -5 ${width} ${height + 10}`} className="w-full h-auto">
            <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></linearGradient>
            </defs>
            <polyline fill="url(#area-grad)" points={`0,${height} ${points} ${width},${height}`} />
            <polyline fill="none" stroke="url(#line-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
            {data.map((d, i) => (<circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (d.value / maxVal) * (height-10) - 5} r="3" fill="#0a0a0a" stroke="url(#line-grad)" strokeWidth="2" />))}
        </svg>
    );
};