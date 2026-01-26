import { supabase } from "../db.ts";

export default async function PeoplePage() {
  // pull the data from the people tables in Supabase
  const { data: people, error } = await supabase
    .from("people") // this needs to match the table name in Supabase (in case you rename later)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return <div class="p-8 text-red-500 font-bold">Database Error: {error.message}</div>;
  }

  return (
    <div class="p-8 max-w-screen-lg mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold text-green-600">Employees</h1>
            <p class="text-gray-500">View employee information</p>
        </div>
        <a href="/" class="text-blue-600 hover:underline">← Dashboard</a>
        <a href="/people/add" class="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md"> + Add Person</a>
      </div>

      <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-green-50 border-b text-green-800">
            <tr>
              <th class="p-4 font-semibold text-gray-700">Name</th>
              <th class="p-4 font-semibold text-gray-700">Role</th>
              <th class="p-4 font-semibold text-gray-700">Department</th>
              <th class="p-4 font-semibold text-gray-700 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {people?.length === 0 && (
              <tr>
                <td colSpan={3} class="p-8 text-center text-gray-500">No employees found.</td>
              </tr>
            )}
            {people?.map((person) => (
              <tr key={person.id} class="hover:bg-gray-50 transition">
                <td class="p-4 font-medium">{person.name}</td>
                <td class="p-4 text-gray-600">{person.role}</td>
                <td class="p-4 text-gray-600">{person.department}</td>
                <td class="p-4 text-right text-gray-600">{person.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}