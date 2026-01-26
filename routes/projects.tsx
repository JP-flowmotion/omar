import { supabase } from "../db.ts";

export default async function ProjectsPage() {
  // pull the data from the projects table
  //note for later - this should be updated to match the people and opportunities tables
  const { data: projects, error } = await supabase.from("projects").select("*");

  if (error) {
    return <div class="p-8 text-red-500 font-bold">Database Error: {error.message}</div>;
  }

  return (
    <div class="p-8 max-w-screen-md mx-auto">
      <h1 class="text-3xl font-bold mb-6">Current Projects</h1>
      <ul class="space-y-4">
        {projects?.map((p) => (
          <li key={p.id} class="p-4 border rounded shadow-sm bg-white">
            <h2 class="font-bold text-xl">{p.name}</h2>
            <p class="text-gray-600">Project: {p.project_name} | Client: {p.client_name} | Status: {p.status}</p>
          </li>
        ))}
      </ul>
      <a href="/" class="mt-8 inline-block text-blue-600 hover:underline">← Home</a>
    </div>
  );
}