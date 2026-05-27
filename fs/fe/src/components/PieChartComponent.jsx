
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '../utils/konstata-variabel';
import { formatRupiah } from '../utils/format-rupiah';
function  CustomPieTooltip({ active, payload })  {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-line rounded-lg p-3 shadow-md text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-tthird">{formatRupiah(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};
export default function PieChartComponent({ data }) {


  return (
    <ResponsiveContainer  width="100%" height={220}>
      <PieChart >
        <Pie
          data={data}
          cx="50%"
          fill="#8884d8"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={CHART_COLORS[index]} />
          ))}
        </Pie>

        <Tooltip content={<CustomPieTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
