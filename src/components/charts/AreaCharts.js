import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";

const data = [];
for (let num = 30; num >= 0; num--) {
  data.push({
    date: subDays(new Date(), num).toISOString().substr(0, 10),
    value: 1 + Math.random(),
  });
}

export default function AreaCharts({ data }) {
  // console.log({ data });
  function numberToKNotation(number) {
    if (number >= 1000) {
      const kValue = number / 1000;
      return kValue.toFixed(1) + "K";
    }
    return number.toString();
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
            <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <Area
          type="natural"
          dataKey="amount"
          stroke="#2451B7"
          fill="url(#color)"
        />

        <XAxis
          dataKey="created_at"
          axisLine={false}
          tickLine={false}
          tickCount={6}
          tickFormatter={(str) => {
            const date = parseISO(str);
            if (date.getDate() % 7 === 0) {
              return format(date, "MMM, d");
            }
            return "";
          }}
        />

        <YAxis
          datakey="amount"
          axisLine={false}
          tickLine={false}
          tickCount={6}
          tickFormatter={(number) => `\u20b5${numberToKNotation(number)}`}
        />

        <Tooltip content={<CustomTooltip />} />

        <CartesianGrid opacity={0.15} vertical={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && label && payload) {
    return (
      <div className="tooltip">
        <h4>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4>
        <p>&#8373;{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
}
