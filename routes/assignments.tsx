import { supabase } from "../db.ts";

export default async function OpportunitiesPage() {
  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("opportunity_name", { ascending: true });

  if (error) return <div class="p-8 text-red-500 font-bold">Error: {error.message}</div>;

  return (
    <div class="p-8 max-w-screen-xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-purple-700">Sales Pipeline</h1>
          <p class="text-gray-500">Track upcoming opportunities and bids.</p>
        </div>
        <a href="/" class="text-blue-600 hover:underline">← Dashboard</a>
      </div>

      <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-purple-50 border-b text-purple-900">
            <tr>
              <th class="p-4 font-semibold">Opportunity Name</th>
              <th class="p-4 font-semibold">Client</th>
              <th class="p-4 font-semibold">Status</th>
              <th class="p-4 font-semibold">Partner</th>
              <th class="p-4 font-semibold text-center">POC Required</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {opportunities?.map((opp) => (
              <tr key={opp.id} class="hover:bg-gray-50 transition">
                <td class="p-4 font-bold text-gray-800">{opp.opportunity_name}</td>
                <td class="p-4 text-gray-600">{opp.client}</td>
                <td class="p-4">
                  <span class={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    opp.status === 'Won' ? 'bg-green-100 text-green-700' :
                    opp.status === 'Lost' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {opp.status || 'Draft'}
                  </span>
                </td>
                <td class="p-4 text-gray-600 italic">{opp.partner || "N/A"}</td>
                <td class="p-4 text-center">
                  {opp.poc_required ? 
                    <span class="text-orange-500 font-bold">Yes</span> : 
                    <span class="text-gray-300">No</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}