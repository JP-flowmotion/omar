import { Handlers } from "$fresh/src/server.ts";
import { supabase } from "../../db.ts";

export const handler: Handlers = {
    // In Fresh 2.0, 'ctx' is the first argument
    async POST(ctx) {
    // We access the request via ctx.req
    const formData = await ctx.req.formData();
    const opportunity_name = formData.get("opportunity_name") as string;
    const client = formData.get("client") as string;    

    const { error } = await supabase
    .from("opportunities")
    .insert([{
    opportunity_name: opportunity_name,
    client: client
    }]);

    if (error) {
        console.error("Supabase Error:", error.message);
        return new Response("Error saving record", { status: 500 });
        }

    // Redirect back to the opportunities list
    return new Response("", {
        status: 303,
        headers: { Location: "/opportunities" },
        });
    },
};

export default function AddOpportunityPage() {
    return (
        <div class="min-h-screen bg-gray-50 p-8 font-sans">
            <div class="max-w-xl mx-auto">
                <nav class="mb-8">
                    <a href="/opportunities" class="text-purple-600 hover:underline font-medium">← Back</a>
            </nav>

    <div class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
    <div class="bg-purple-600 p-6 text-white">
        <h1 class="text-2xl font-bold">New Opportunity</h1>
    </div>

    <form method="POST" class="p-8 space-y-6">
    <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Opportunity Name</label>
    <input type="text" name="opportunity_name" required class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
    </div>
    <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Client Name</label>
        <input type="text" name="client" required class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
    </div>
    <button type="submit" class="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all">
    Save Opportunity
    </button>
    </form>
    </div>
    </div>
    </div>
    );
}
