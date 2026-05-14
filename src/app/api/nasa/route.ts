import { NextRequest, NextResponse } from "next/server";

type NasaApodResponse = {
  date?: string;
  explanation?: string;
  hdurl?: string;
  media_type?: string;
  title?: string;
  url?: string;
  copyright?: string;
};

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date")?.trim() || "";
  const apiKey = process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

  if (!isValidDate(date)) {
    return NextResponse.json({ error: "Informe uma data no formato YYYY-MM-DD." }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (date > today) {
    return NextResponse.json({ error: "A NASA nao retorna APOD para datas futuras." }, { status: 400 });
  }

  const url = new URL("https://api.nasa.gov/planetary/apod");
  url.searchParams.set("date", date);
  url.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    const data = (await response.json()) as NasaApodResponse & { msg?: string; error?: { message?: string } };

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.msg || data?.error?.message || "Falha ao buscar imagem da NASA." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      date: data.date,
      explanation: data.explanation,
      hdurl: data.hdurl,
      media_type: data.media_type,
      title: data.title,
      url: data.url,
      copyright: data.copyright,
    });
  } catch {
    return NextResponse.json({ error: "NASA indisponivel no momento." }, { status: 502 });
  }
}
