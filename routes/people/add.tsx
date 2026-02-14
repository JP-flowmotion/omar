import { Handlers } from "$fresh/server.ts"; 
import { supabase } from "../../db.ts";

export const handler: Handlers = {
  
  // This should only runs when the user clicks "Submit"
    
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const department = formData.get("department") as string;

    const { error } = await supabase
      .from("people")
      .insert(
        { 
          name: name, 
          role: role, 
          department: department 
        });

    if (error) {
      console.error("Supabase Error:", error.message);
      return new Response("Error saving record", { status: 500 });
    }
    
    //return to people page
    return new Response("", {
      status: 303,
      headers: { Location: "/people" },
    });
  },
};

export default function AddPersonPage() {
  return (
    <div class="min-h-screen bg-gray-50 p-8 font-sans">
      <div class="max-w-xl mx-auto">
        <nav class="mb-8">
          <a href="/people" class="text-emerald-600 hover:underline font-medium">
            ← Back to Team List
          </a>
        </nav>

        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-emerald-600 p-6">
            <h1 class="text-2xl font-bold text-white">Add New Team Member</h1>
            <p class="text-emerald-100 text-sm">Create a new person record in the database.</p>
          </div>

          <form method="POST" class="p-8 space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Alex Rivera"
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Professional Role</label>
              <input
                type="text"
                name="role"
                required
                placeholder="e.g. Project Lead"
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Department</label>
              <select
                name="department"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white outline-none transition-all"
              >
                <option value="">Select Department...</option>
                <option value="Development">Development</option>
                <option value="Business Analysis">Business Analysis</option>
                <option value="Sales">Sales</option>
                <option value="PMO">PMO</option>
              </select>
            </div>

            <div class="pt-4">
              <button
                type="submit"
                class="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
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