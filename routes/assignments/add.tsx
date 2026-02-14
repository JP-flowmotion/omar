// import { Handlers } from "@fresh/server.ts";
// import { supabase } from "../../db.ts";

// // Define an interface for the data to keep TypeScript happy lol
// interface PageData {
//   projects: any[];
// }

// export const handler: Handlers = {
//   async GET(ctx) {
//     //Fetch active projects from Supabase
//     const { data: projects, error } = await supabase
//       .from("projects")
//       .select("id, name")
//       .eq("status", "Active")
//       .order("name", { ascending: true });

//     if (error) {
//       console.error("Supabase Fetch Error:", error.message);
//     }

//     // In Fresh 2.2, you have to pass the JSX component directly to ctx.render
//     // We pass the projects as a prop called 'projects'
//     return ctx.render(<AddAssignmentsPage projects={projects || []} />);
//   },

//   async POST(ctx) {
//     const formData = await ctx.req.formData();
//     const name = formData.get("name") as string;
//     const project = formData.get("project") as string;
//     const role = formData.get("role") as string;

//     // Insert the new record into 'assignments'
//     const { error } = await supabase
//       .from("assignments")
//       .insert({ name, project, role });

//     if (error) {
//       console.error("Supabase Insert Error:", error.message);
//       return new Response("Error saving record", { status: 500 });
//     }
    
//     // Redirect after successful post
//     return new Response("", {
//       status: 303,
//       headers: { Location: "/assignments" },
//     });
//   },
// };

// // The Component now receives 'projects list' directly as a prop
// export default function AddAssignmentsPage({ projects }: PageData) {
//   return (
//     <div class="min-h-screen bg-gray-50 p-8 font-sans">
//       <div class="max-w-xl mx-auto">
//         <nav class="mb-8">
//           <a href="/assignments" class="text-orange-600 hover:underline font-medium">
//             ← Back to Assignments List
//           </a>
//         </nav>

//         <div class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
//           <div class="bg-orange-600 p-6">
//             <h1 class="text-2xl font-bold text-white">Add New Assignment</h1>
//             <p class="text-emerald-100 text-sm">Create a new assignment in the database.</p>
//           </div>

//           <form method="POST" class="p-8 space-y-6">
//             {/* Person Input */}
//             <div>
//               <label class="block text-sm font-bold text-gray-700 mb-2">Person</label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 placeholder="e.g. Tom, Chris, Holly..."
//                 class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
//               />
//             </div>

//             {/* Project Dropdown (Dynamic) */}
//             <div>
//               <label class="block text-sm font-bold text-gray-700 mb-2">Project</label>
//               <select
//                 name="project"
//                 required
//                 class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white outline-none transition-all"
//               >
//                 <option value="">Select a Project...</option>
//                 {projects.map((p) => (
//                   <option key={p.id} value={p.name}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Role Dropdown (Static) */}
//             <div>
//               <label class="block text-sm font-bold text-gray-700 mb-2">Role/Status</label>
//               <select
//                 name="role"
//                 required
//                 class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white outline-none transition-all"
//               >
//                 <option value="">Select Status...</option>
//                 <option value="Not Started">Not Started</option>
//                 <option value="Live">Live</option>
//                 <option value="On Hold">On Hold</option>
//               </select>
//             </div>

//             <div class="pt-4">
//               <button
//                 type="submit"
//                 class="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
//               >
//                 Save to Database
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Handlers } from "@fresh/core";
import { supabase } from "../../db.ts";

interface PageProps {
  projects: any[];
  people: any[];
}

export const handler: Handlers = {
  async GET(ctx) {
    // 1. Fetch both tables concurrently
    const [projectRes, peopleRes] = await Promise.all([
      supabase.from("projects").select("id, name").eq("status", "Active").order("name"),
      supabase.from("people").select("id, name").eq("status", "Active").order("name"),
    ]);

    // 2. FIXED: Pass the JSX element directly to ctx.render
    return ctx.render(
      <AddAssignmentsPage 
        projects={projectRes.data || []} 
        people={peopleRes.data || []} 
      />
    );
  },

  async POST(ctx) {
    const formData = await ctx.req.formData();
    const name = formData.get("name") as string;
    const project = formData.get("project") as string;
    const role = formData.get("role") as string;
    const utilisation = formData.get("utilisation") as string;
    const start = formData.get("start") as string;
    const end = formData.get("end") as string;

    const { error } = await supabase
      .from("assignments")
      .insert({ name, project, role, utilisation, start, end });

    if (error) {
      console.error("Insert Error:", error.message);
      return new Response("Error saving record", { status: 500 });
    }
    
    return new Response("", {
      status: 303,
      headers: { Location: "/assignments" },
    });
  },
};

// 3. The component receives the props we passed in ctx.render
export default function AddAssignmentsPage({ projects, people }: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 p-8 font-sans">
      <div class="max-w-xl mx-auto">
        <nav class="mb-8">
          <a href="/assignments" class="text-orange-600 hover:underline font-medium">
            ← Back to Assignments List
          </a>
        </nav>

        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-orange-600 p-6">
            <h1 class="text-2xl font-bold text-white">Add New Assignment</h1>
            <p class="text-emerald-100 text-sm">Assign a person to a project.</p>
          </div>

          <form method="POST" class="p-8 space-y-6">
            {/* People Dropdown */}
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Person</label>
              <select
                name="name"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white outline-none transition-all"
              >
                <option value="">Select a Person...</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Dropdown */}
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Project</label>
              <select
                name="project"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white outline-none transition-all"
              >
                <option value="">Select a Project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role/Status Dropdown */}
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Project Role</label>
              <select
                name="role"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white outline-none transition-all"
              >
                <option value="">Select Role...</option>
                <option value="Developer">Developer</option>
                <option value="Technical Lead">Technical Lead</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Project Manager">Project Manager</option>
                <option value="BA/PM">BA/PM</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Utilisation (%)</label>
              <input
                type="number"
                name="utilisation"
                required
                placeholder="e.g. 20%, 50%, 100%..."
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="start"
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="end"
                class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div class="pt-4">
              <button
                type="submit"
                class="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}