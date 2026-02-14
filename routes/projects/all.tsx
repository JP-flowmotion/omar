import { supabase } from "../db.ts";

export default async function ProjectsPage() {
  // pull the data from the people tables in Supabase
  const { data: projects, error } = await supabase
    .from("projects") // this needs to match the table name in Supabase (in case you rename later)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return <div class="p-8 text-red-500 font-bold">Database Error: {error.message}</div>;
  }

  return (
    <div class="p-8 max-w-screen-lg mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold text-blue-600">All Projects</h1>
            <p class="text-gray-500">View All Historic Project information</p>
        </div>
        <a href="/projects" class="text-blue-600 hover:underline">← Active Projects</a>
      </div>

      <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-blue-50 border-b text-blue-800">
            <tr>
              <th class="p-4 font-semibold text-gray-700">Name</th>
              <th class="p-4 font-semibold text-gray-700">Type</th>
              <th class="p-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {projects?.length === 0 && (
              <tr>
                <td colSpan={3} class="p-8 text-center text-gray-500">No projects found.</td>
              </tr>
            )}
            {projects?.map((project) => (
              <tr key={project.id} class="hover:bg-gray-50 transition">
                <td class="p-4 text-gray-600">{project.name}</td>
                <td class="p-4 text-gray-600">{project.type}</td>
                <td class="p-4 text-gray-600">{project.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <a href="/projects" class="bg-blue-600 text-white font-bold px-6 py-8 rounded-xl hover:bg-blue-700 transition-all shadow-md">Active Projects</a>
      </div>
    </div>
  );
}