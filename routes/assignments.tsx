import { supabase } from "../db.ts";

export default async function AssignmentsPage() {
  // 1. UPDATED SELECT: We specify the foreign table relationships here
  // Note: Ensure 'people' and 'projects' match your actual table names
  const { data: assignments, error } = await supabase
    .from("assignments")
    .select(`
      id,
      role,
      people ( name ), 
      projects ( name ),
      utilisation,
      start,
      end
    `)
    // not sure what's best to order by?
    .order("id", { ascending: true });

  if (error) return <div class="p-8 text-red-500 font-bold">Error: {error.message}</div>;

  return (
    <div class="p-8 max-w-screen-xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          {/*Header information - heading and subheading*/}
          <h1 class="text-3xl font-bold text-orange-700">Work Assignments</h1>
          <p class="text-gray-500">Track who is working on which project.</p>
        </div>
        <div class="space-x-4">
          {/*Buttons - back to home and add an assignment*/}
          <a href="/" class="text-blue-600 hover:underline">← Dashboard</a>
          <a href="/assignments/add" class="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-700 transition-all shadow-md"> + Add Assignment</a>
        </div>
      </div>

      <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-purple-50 border-b text-orange-900">
            <tr>
              {/*Table column headers */}
              <th class="p-4 font-semibold">Name</th>
              <th class="p-4 font-semibold">Project</th>
              <th class="p-4 font-semibold">Role</th>
              <th class="p-4 font-semibold">Utilisation</th>
              <th class="p-4 font-semibold">Start Date</th>
              <th class="p-4 font-semibold">End Date</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {assignments?.map((ass) => (
              <tr key={ass.id} class="hover:bg-gray-50 transition">
                {/* Data to be pulled from the table + errors for joined data */}
                <td class="p-4 font-bold text-gray-800">
                  {ass.people?.name || "Unknown Person"}
                </td>
                <td class="p-4 text-gray-600">
                  {ass.projects?.name || "Unknown Project"}
                </td>
                <td class="p-4 text-gray-600">{ass.role}</td>
                <td class="p-4 text-gray-600">{ass.utilisation}</td>
                <td class="p-4 text-gray-600">{ass.start}</td>
                <td class="p-4 text-gray-600">{ass.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}