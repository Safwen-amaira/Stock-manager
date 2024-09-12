import React from 'react';
import { PieChart as RechartsPieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Elctro.', value: 58, color: '#007bff' }, // blue
  { name: 'Phones', value: 21, color: '#00bff3' }, // light blue
  { name: 'Clothes', value: 22, color: '#e2e8f0' }  // light gray
];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent = () => {
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '350px',
      height: '150px'
    }}>
      <div style={{ textAlign: 'left' }}>
        <h5 style={{ margin: 0, color: '#6c757d' }}>Cathegories Sales</h5>
        {data.map((entry, index) => (
          <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color, marginRight: '5px' }}></div>
            <span style={{ color: '#333', fontSize: '14px' }}>{entry.name}</span>
            <span style={{ color: '#333', fontSize: '14px', marginLeft: 'auto' }}>{entry.value}%</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width={120} height={120}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={CustomLabel} // Use CustomLabel as the label component
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
