import { graphOverview } from "@/lib/graph";

export async function GET() {
  return Response.json(graphOverview());
}
