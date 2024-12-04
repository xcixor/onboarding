// api/surveys/index.ts
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for creating a new survey
const createSurveySchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const surveys = await db.survey.findMany({
      where: {
        createdById: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        _count: {
          select: {
            questions: true,
            responses: true,
          },
        },
      },
    });

    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Error fetching surveys" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const body = createSurveySchema.parse(json);

    const survey = await db.survey.create({
      data: {
        title: body.title,
        description: body.description,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
        questions: {
          create: [
            {
              title: "Untitled Question",
              type: "TEXT",
              required: false,
              order: 0,
            },
          ],
        },
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(survey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating survey:", error);
    return NextResponse.json(
      { error: "Error creating survey" },
      { status: 500 },
    );
  }
}
