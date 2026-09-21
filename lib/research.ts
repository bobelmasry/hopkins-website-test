export type ResearchAnswer = {
  question: string;
  answer: string;
};

export type CompanyResult = {
  name: string;
  domain: string;
  company_mentioned: boolean;
  order_mentioned: number;
  answers: ResearchAnswer[];
  sources: string[];
  web_search_used: boolean;
  domain_verified: boolean | null;
};

type ResearchResponse = {
  companies: CompanyResult[];
};

type ResearchCompany = {
  name: string;
  domain: string;
  use_web_search: boolean;
  questions: string[];
};

export async function runResearch(companies: ResearchCompany[]) {
  const response = await fetch("http://localhost:8000/research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companies }),
  });

  if (!response.ok) {
    throw new Error(`Research request failed with status ${response.status}`);
  }

  const researchResponse = (await response.json()) as ResearchResponse;
  console.log("Research API response:", researchResponse);

  return researchResponse;
}