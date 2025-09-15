// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSheetsClient() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64;
  if (!b64) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64");
  const credentials = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function quoteA1Sheet(sheetName: string) {
  const safe = sheetName.replace(/'/g, "''");
  return `'${safe}'`;
}


function sanitize(val: unknown): string {
  const s = typeof val === "string" ? val : JSON.stringify(val ?? "");
  return /^[=+@\-\t]/.test(s) ? `'${s}` : s;
}

type Body = {

  overallRating?: number | null;     
  helpfulRating?: number | null;     
  engagingRating?: number | null;    
  freeText?: string;                


  lengthChoice?: "long" | "right" | "short" | null;
  daysPerWeek?: number | null;      
  notes?: string;                    
  name?: string;


  meta?: Record<string, unknown>;
  sheet?: string; 
};

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();

   
    if (
      body.overallRating != null &&
      (typeof body.overallRating !== "number" ||
        body.overallRating < 1 ||
        body.overallRating > 5)
    ) {
      return NextResponse.json({ error: "Invalid overallRating" }, { status: 400 });
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: "Missing GOOGLE_SHEETS_SPREADSHEET_ID" },
        { status: 500 },
      );
    }

    const sheetName = (body.sheet?.trim() || process.env.GOOGLE_SHEETS_SHEET_NAME || "Feedback").trim();
    const sheets = getSheetsClient();


    const metaRes = await sheets.spreadsheets.get({ spreadsheetId });
    const exists = metaRes.data.sheets?.some((s) => s.properties?.title === sheetName);
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
      });


      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${quoteA1Sheet(sheetName)}!A:K`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[
            "ts_iso",
            "name",
            "overall_rating",
            "helpful_rating",
            "engaging_rating",
            "length_choice",
            "days_per_week",
            "notes",
            "meta_json",
            "user_agent",
          ]],
        },
      });
    }

    const iso = new Date().toISOString();
    const userAgent = req.headers.get("user-agent") || "";

    const row = [
      iso,
      sanitize(body.name ?? ""),
      body.overallRating ?? "",
      body.helpfulRating ?? "",
      body.engagingRating ?? "",
      sanitize(body.lengthChoice ?? ""),
      body.daysPerWeek ?? "",
      sanitize(body.notes ?? ""),
      sanitize(body.meta ?? {}),
      sanitize(userAgent),
    ];

    const range = `${quoteA1Sheet(sheetName)}!A:K`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("Sheets append error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}