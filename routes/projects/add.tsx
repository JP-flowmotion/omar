import { Handlers } from "$fresh/server.ts"; 
import { supabase } from "../../db.ts";

export const handler: Handlers = {
  
  // This should only runs when the user clicks "Submit"
    
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const status = formData.get("status") as string;

    const { error } = await supabase
      .from("projects")
      .insert(
        { 
          name: name, 
          type: type, 
          status: status 
        });

    if (error) {
      console.error("Supabase Error:", error.message);
      return new Response("Error saving record", { status: 500 });
    }
    
    //return to people page
    return new Response("", {
      status: 303,
      headers: { Location: "/projects" },
    });
  },
};

export default function AddProjectsPage() {
  return (
    <div class="min-h-screen bg-gray-50 p-8 font-sans">
      <div class="max-w-xl mx-auto">
        <nav class="mb-8">
          <a href="/projects" class="text-blue-600 hover:underline font-medium">
            ← Back to Projects List
          </a>
        </nav>

        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-blue-600 p-6">
            <h1 class="text-2xl font-bold text-white">Add New Project</h1>
            <p class="text-emerald-100 text-sm">Create a new project in the database.</p>
          </div>

          <form method="POST" class="p-8 space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Bespoke Custom App"
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Type</label>
              <select
                name="type"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all"
              >
                <option value="">Select Type...</option>
                <option value="Project">Project</option>
                <option value="Support">Support</option>
                <option value="Call-Off">Call-Off</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all"
              >
                <option value="">Select Department...</option>
                <option value="Not Started">Not Started</option>
                <option value="Live">Live</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                class="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}