import { Handlers } from "@fresh/core";
import { supabase } from "../db.ts";

interface UtilisationData {
  labels: string[];
  values: number[];
}

export const handler: Handlers = {
  async GET(ctx) {
    // 1. Fetch assignments with the linked person's name and their utilisation percentage
    // IMPORTANT: Ensure the column name in your database matches 'utilisation' exactly.
    const { data, error } = await supabase
      .from("assignments")
      .select(`
        utilisation,
        people ( name )
      `);

    if (error) {
      console.error("Supabase Error:", error);
      // Fallback: Render the dashboard with empty data if the database fetch fails
      return ctx.render(<Dashboard data={{ labels: [], values: [] }} />);
    }

    // 2. Aggregate the data: Sum the utilisation percentage per person
    const totals: Record<string, number> = {};
    
    data?.forEach((ass) => {
      const name = ass.people?.name || "Unknown Person";
      const amount = Number(ass.utilisation) || 0;
      totals[name] = (totals[name] || 0) + amount;
    });

    const utilisationData = {
      labels: Object.keys(totals),
      values: Object.values(totals),
    };

    // 3. In Fresh 2.2, we render by passing the JSX element directly
    return ctx.render(<Dashboard data={utilisationData} />);
  },
};

export default function Dashboard({ data }: { data: UtilisationData }) {
  // 4. Configure the Chart using QuickChart URL generation
  const chartConfig = {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Total Utilisation %',
        data: data.values,
        // Bar colours: Red for over-utilised (>100), Orange for high load (>80), Green for safe
        backgroundColor: data.values.map(v => 
          v > 100 ? 'rgba(239, 68, 68, 0.8)' : 
          v > 80 ? 'rgba(245, 158, 11, 0.8)' : 
          'rgba(16, 185, 129, 0.8)'
        ),
        borderColor: data.values.map(v => 
          v > 100 ? 'rgb(185, 28, 28)' : 
          v > 80 ? 'rgb(180, 83, 9)' : 
          'rgb(5, 150, 105)'
        ),
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      scales: {
        yAxes: [{ 
          ticks: { beginAtZero: true, max: 120 },
          scaleLabel: { display: true, labelString: 'Utilisation (%)' }
        }]
      },
      legend: { display: false }
    }
  };

  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

  return (
    <div class="min-h-screen bg-gray-50 p-8 font-sans">
      <div class="max-w-5xl mx-auto">
        
        {/* Header Section with Navigation */}
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Team Resource Dashboard</h1>
            <p class="text-gray-500 mt-1">Real-time overview of personnel utilisation.</p>
          </div>
          
          <div class="flex items-center gap-3">
            {/* Back to Home Button */}
            <a 
              href="/" 
              class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </a>

            {/* Add New Assignment Button */}
            <a 
              href="/assignments/add" 
              class="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-all shadow-md"
            >
              + Add Assignment
            </a>
          </div>
        </div>

        {/* Main Content Card */}
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 class="text-lg font-semibold text-gray-800">Individual Utilisation</h2>
          </div>
          
          <div class="p-8">
            {data.labels.length > 0 ? (
              <div class="flex flex-col items-center">
                <img 
                  src={chartUrl} 
                  alt="Utilisation Bar Chart" 
                  class="w-full max-w-3xl h-auto rounded-lg" 
                />
                <div class="mt-8 grid grid-cols-3 gap-4 w-full max-w-md text-xs font-medium text-center">
                  <div class="flex items-center justify-center gap-2">
                    <span class="w-3 h-3 bg-emerald-500 rounded-full"></span> Under 80%
                  </div>
                  <div class="flex items-center justify-center gap-2">
                    <span class="w-3 h-3 bg-amber-500 rounded-full"></span> 80% - 100%
                  </div>
                  <div class="flex items-center justify-center gap-2">
                    <span class="w-3 h-3 bg-red-500 rounded-full"></span> Over 100%
                  </div>
                </div>
              </div>
            ) : (
              <div class="py-24 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p class="text-gray-500 font-medium">No assignment data found.</p>
                <p class="text-sm text-gray-400 mt-1">Add some assignments to generate the chart.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}