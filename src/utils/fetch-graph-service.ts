import type { GraphListItem } from "@/types/graph";
import getGraphJson from "@/utils/graph-json";

export async function fetchGraphService({
  graph,
  url,
}: {
  graph: GraphListItem;
  url: string;
}) {
  const URL = url;
  const fullJson = getGraphJson(graph);

  console.log("Full JSON:", fullJson);

  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: fullJson,
  };

  const response = await fetch(URL, req);

  return response;
}
