import { useSignal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Counter from "../islands/Counter.tsx";

// export default define.page(function Home(ctx) {
//   const count = useSignal(3);

//   console.log("Shared value " + ctx.state.shared);

//   return (
//     <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
//       <Head>
//         <title>Fresh counter</title>
//       </Head>
//       <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
//         <img
//           class="my-6"
//           src="/logo.svg"
//           width="128"
//           height="128"
//           alt="the Fresh logo: a sliced lemon dripping with juice"
//         />
//         <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
//         <p class="my-4">
//           Try updating this message in the
//           <code class="mx-2">./routes/index.tsx</code> file, and refresh.
//         </p>
//         <Counter count={count} />
//       </div>
//     </div>
//   );
// });

export default function Home() {
  
  return (
    <div class="p-8 max-w-screen-lg mx-auto font-sans">
      {/* NEW HEADER BAR */}
      <nav class="flex justify-end mb-6">
        <a 
          href="/profile" 
          class="flex items-center gap-2 group p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
            UP
          </div>
          <span class="text-gray-700 font-medium group-hover:text-emerald-700">User Profile</span>
        </a>
      </nav>

      <header class="mb-10">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
        <p class="text-lg text-gray-600">Track team capacity and project status.</p>
      </header>

      {/* Navigation grid - projects*/}
      <nav class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/projects" class="group p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
          <h3 class="text-xl font-bold text-blue-600 group-hover:text-blue-700">Projects →</h3>
          <p class="text-gray-500 mt-2">Manage timelines and client deliverables.</p>
        </a>
        {/*People button*/}
        <a href="/people" class="group p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all">
          <h3 class="text-xl font-bold text-green-600 group-hover:text-green-700">People →</h3>
          <p class="text-gray-500 mt-2">View team capacity and contact info.</p>
        </a>
        {/* Opportunities Button */}
        <a href="/opportunities" class="group p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all">
          <h3 class="text-xl font-bold text-purple-600">Opportunities →</h3>
          <p class="text-gray-500 mt-2">Track the sales pipeline and upcoming potential work.</p>
        </a>

        {/* Assignments Button */}
        <a href="/assignments" class="group p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all">
          <h3 class="text-xl font-bold text-orange-600">Assignments →</h3>
          <p class="text-gray-500 mt-2">See who is assigned to which project.</p>
        </a>
      </nav>
    </div>
  );
}