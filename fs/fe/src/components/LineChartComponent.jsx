import {
  Legend, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { formatRupiah } from '../utils/format-rupiah';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded bg-white px-3 py-2 text-xs shadow ring-1 ring-gray-200">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: Rp {formatRupiah(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function LineChartComponent({ data }) {

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 15, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
          tick={{ fontSize: 10 }}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs capitalize">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#4ade80"
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={{ r: 4, fill: '#4ade80', stroke: 'white', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expense"
          strokeDasharray="5 5"
          stroke="#f87171"
          strokeWidth={2}
          dot={{ r: 4, fill: '#f87171', stroke: 'white', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}