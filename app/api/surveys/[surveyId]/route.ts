// api/surveys/[surveyId]/index.ts
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for updating a survey
const updateSurveySchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { surveyId: string } },
) {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const survey = await db.survey.findUnique({
      where: {
        id: params.surveyId,
        createdById: user.id,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
            explanation: true,
            validation: true,
            logic: true,
          },
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json(
      { error: "Error fetching survey" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { surveyId: string } },
) {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const body = updateSurveySchema.parse(json);

    const survey = await db.survey.update({
      where: {
        id: params.surveyId,
        createdById: user.id,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
            explanation: true,
            validation: true,
            logic: true,
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

    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Error updating survey" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { surveyId: string } },
) {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.survey.delete({
      where: {
        id: params.surveyId,
        createdById: user.id,
      },
    });

    return NextResponse.json(
      { message: "Survey deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting survey:", error);
    return NextResponse.json(
      { error: "Error deleting survey" },
      { status: 500 },
    );
  }
}
