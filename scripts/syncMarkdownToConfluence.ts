import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";
import "dotenv/config";

type ConfluencePage = {
  id: string;
  title: string;
  version: {
    number: number;
  };
};

type ConfluenceSearchResponse = {
  results?: ConfluencePage[];
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: string;
  headers?: Record<string, string>;
};

const {
  CONFLUENCE_EMAIL,
  API_TOKEN,
  CONFLUENCE_BASE_URL,
  CONFLUENCE_SPACE_KEY,
  CONFLUENCE_PARENT_PAGE_ID
} = process.env;

if (
  !CONFLUENCE_EMAIL ||
  !API_TOKEN ||
  !CONFLUENCE_BASE_URL ||
  !CONFLUENCE_SPACE_KEY ||
  !CONFLUENCE_PARENT_PAGE_ID
) {
  throw new Error("Missing required Confluence environment variables");
}

const markdownFiles = process.argv.slice(2);

if (markdownFiles.length === 0) {
  throw new Error("Missing markdown file arguments");
}

const confluenceEmail = CONFLUENCE_EMAIL;
const confluenceApiToken = API_TOKEN;
const confluenceBaseUrl = CONFLUENCE_BASE_URL;
const confluenceSpaceKey = CONFLUENCE_SPACE_KEY;
const confluenceParentPageId = CONFLUENCE_PARENT_PAGE_ID;

const auth = Buffer.from(`${confluenceEmail}:${confluenceApiToken}`).toString("base64");

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    body: options.body,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Confluence request failed: ${response.status}\n${text}`);
  }

  return (text ? JSON.parse(text) : {}) as T;
}

function getPageTitle(markdownFile: string): string {
  return path.basename(markdownFile, ".md");
}

function renderMarkdown(markdownFile: string): string {
  const markdown = fs.readFileSync(markdownFile, "utf8");
  return marked.parse(markdown) as string;
}

async function findExistingPage(title: string): Promise<ConfluencePage | undefined> {
  const url =
    `${confluenceBaseUrl}/rest/api/content` +
    `?spaceKey=${encodeURIComponent(confluenceSpaceKey)}` +
    `&title=${encodeURIComponent(title)}` +
    `&expand=version`;

  const result = await request<ConfluenceSearchResponse>(url);
  return result.results?.[0];
}

async function createPage(title: string, html: string): Promise<void> {
  const payload = {
    type: "page",
    title,
    ancestors: [{ id: confluenceParentPageId }],
    space: { key: confluenceSpaceKey },
    body: {
      storage: {
        value: html,
        representation: "storage"
      }
    }
  };

  await request(`${confluenceBaseUrl}/rest/api/content`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

async function updatePage(page: ConfluencePage, title: string, html: string): Promise<void> {
  const payload = {
    id: page.id,
    type: "page",
    title,
    space: { key: confluenceSpaceKey },
    version: {
      number: page.version.number + 1
    },
    body: {
      storage: {
        value: html,
        representation: "storage"
      }
    }
  };

  await request(`${confluenceBaseUrl}/rest/api/content/${page.id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

async function syncFile(markdownFile: string): Promise<void> {
  const title = getPageTitle(markdownFile);
  const html = renderMarkdown(markdownFile);

  console.log(`Syncing ${markdownFile} to Confluence page "${title}"`);

  const existingPage = await findExistingPage(title);

  if (existingPage) {
    console.log(`Updating existing page: ${existingPage.id}`);
    await updatePage(existingPage, title, html);
  } else {
    console.log("Creating new page");
    await createPage(title, html);
  }

  console.log(`Confluence sync completed for "${title}"`);
}

async function main(): Promise<void> {
  for (const markdownFile of markdownFiles) {
    await syncFile(markdownFile);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
