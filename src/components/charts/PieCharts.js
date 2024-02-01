// import React, { PureComponent } from "react";
// import {
//   PieChart,
//   Pie,
//   Sector,
//   Cell,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export default class PieCharts extends PureComponent {
//   //   static demoUrl =
//   //     "https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o";

//   render() {
//     return (
//       <div>
//         <div className="font-semibold">Revenue / Expenses Chart</div>
//         <PieChart width={250} height={250} onMouseEnter={this.onPieEnter}>
//           <Pie
//             data={data}
//             cx={140}
//             cy={140}
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             paddingAngle={5}
//             dataKey="value"
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           {/* <Pie
//           data={data}
//           cx={420}
//           cy={200}
//           startAngle={180}
//           endAngle={0}
//           innerRadius={60}
//           outerRadius={80}
//           fill="#8884d8"
//           paddingAngle={5}
//           dataKey="value"
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie> */}
//         </PieChart>
//       </div>
//     );
//   }
// }
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function PieCharts() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div className="font-semibold">Revenue / Expenses Chart</div>
      {isClient && (
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            cx={140}
            cy={140}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )}
    </div>
  );
}

export default PieCharts;
