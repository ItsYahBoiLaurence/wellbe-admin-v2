import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const DemoChart = () => {
    const data = [
        { category: 'Character', Norm: 80, Result: 100 },
        { category: 'Career', Norm: 70, Result: 85 },
        { category: 'Contentment', Norm: 90, Result: 60 },
        { category: 'Connectedness', Norm: 75, Result: 80 },
    ];

    return (
        <BarChart width={500} height={300} data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Norm" fill="gray" />
            <Bar dataKey="Result" fill='green' />
        </BarChart>
    );
};

export default DemoChart;