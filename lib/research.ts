export type ResearchResponse = {
  completed_at: string;
  model?: string;
  web_search_enabled?: boolean;
  companies: { name: string; domain: string; aliases: string[] }[];
  answers: {
    question: string;
    answer: string;
    sources: string[];
    web_search_used: boolean;
    mentions: { domain: string; matched_text: string }[];
  }[];
};

type ResearchCompany = {
  name: string;
  aliases?: string[];
  domain: string;
  use_web_search: boolean;
  questions: string[];
};

export function summarizeResearch(result: ResearchResponse) {
  const companies = result.companies.map((company) => ({
    ...company,
    mentions: result.answers.filter((answer) => answer.mentions.some((mention) => mention.domain === company.domain)).length,
  }));
  const totalMentions = companies.reduce((total, company) => total + company.mentions, 0);
  return companies.map((company) => ({
    ...company,
    visibility: result.answers.length ? company.mentions / result.answers.length * 100 : 0,
    shareOfVoice: totalMentions ? company.mentions / totalMentions * 100 : null,
  }));
}

export async function runResearch(companies: ResearchCompany[]): Promise<ResearchResponse> {
  let response: Response;
  try {
    response = await fetch("http://localhost:8000/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companies }),
    });
  } catch {
    throw new Error("Cannot reach the research server. Start the backend on port 8000 and try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.detail === "string" ? body.detail : "Check your domains and questions, then try again.");
  }
  return response.json();
}
