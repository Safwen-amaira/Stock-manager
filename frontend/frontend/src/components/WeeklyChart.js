import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Sample data for weekly sales
const data = [
  { day: 'Mon', sales: 400 },
  { day: 'Tue', sales: 300 },
  { day: 'Wed', sales: 500 },
  { day: 'Thu', sales: 450 },
  { day: 'Fri', sales: 600 },
  { day: 'Sat', sales: 700 },
  { day: 'Sun', sales: 800 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px 10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const WeeklySalesChart = () => (
  <div style={{
    backgroundColor: '#ffffff', 
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
      <h5 style={{ margin: 0, color: '#6c757d' }}>Weekly Sales</h5>
      <h2 style={{ margin: '10px 0', color: '#333' }}>$47K</h2>
      <p style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>+3.5%</p>
    </div>
    <BarChart
      width={150}
      height={100}
      data={data}
      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} tickLine={false} />
      <YAxis hide />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} />
      <Bar dataKey="sales" fill="#007bff" radius={[10, 10, 0, 0]} barSize={8} />
    </BarChart>
  </div>
);

export default WeeklySalesChart;
