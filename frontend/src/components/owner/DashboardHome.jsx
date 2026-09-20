import React from 'react';
import { 
  MdStorefront, 
  MdRestaurantMenu, 
  MdOutlinePendingActions, 
  MdCheckCircleOutline 
} from 'react-icons/md';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useGetDashboardStatsQuery } from '../../features/owner/queries';

const MetricCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
    <div>
      <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-800">{value}</h3>
    </div>
    <div className={`h-14 w-14 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
  </div>
);

const DashboardHome = () => {
  const { data: statsRes, isLoading, isError } = useGetDashboardStatsQuery();
  
  if (isLoading) {
    return <div className="text-gray-500 font-medium">Loading dashboard stats...</div>;
  }
  
  if (isError) {
    return <div className="text-red-500 font-medium">Failed to load dashboard stats.</div>;
  }

  const stats = statsRes?.data || {
    totalShops: 0,
    totalItems: 0,
    pendingOrders: 0,
    completedOrders: 0,
    chartData: []
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here is a summary of your business.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Shops" 
          value={stats.totalShops} 
          icon={<MdStorefront className="text-2xl text-blue-600" />}
          color="bg-blue-50"
        />
        <MetricCard 
          title="Total Food Items" 
          value={stats.totalItems} 
          icon={<MdRestaurantMenu className="text-2xl text-orange-600" />}
          color="bg-orange-50"
        />
        <MetricCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon={<MdOutlinePendingActions className="text-2xl text-yellow-600" />}
          color="bg-yellow-50"
        />
        <MetricCard 
          title="Completed Orders" 
          value={stats.completedOrders} 
          icon={<MdCheckCircleOutline className="text-2xl text-green-600" />}
          color="bg-green-50"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Orders Overview</h3>
          <p className="text-gray-500 text-sm">Number of orders received this week.</p>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d3d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff4d3d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#ff4d3d" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorOrders)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
