// api/surveys/[surveyId]/questions/index.ts
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { z } from "zod";
import { QuestionType } from "@prisma/client";

const createQuestionSchema = z.object({
  title: z.string().min(1, "Question title is required").max(500),
  type: z.enum([
    "MULTIPLE_CHOICE",
    "SINGLE_CHOICE",
    "TEXT",
    "LONG_TEXT",
    "EMAIL",
    "NUMBER",
    "DATE",
    "TIME",
    "PHONE",
    "RATING",
    "FILE_UPLOAD",
    "CHECKBOX",
  ] as const),
  required: z.boolean().optional(),
  options: z
    .array(
      z.object({
        text: z.string().min(1),
        order: z.number(),
      }),
    )
    .optional(),
  explanation: z
    .object({
      text: z.string(),
      mediaUrl: z.string().optional(),
      mediaType: z.enum(["IMAGE", "VIDEO", "AUDIO"]).optional(),
    })
    .optional(),
  validation: z
    .array(
      z.object({
        type: z.string(),
        value: z.union([z.string(), z.number()]).optional(),
        message: z.string(),
      }),
    )
    .optional(),
  logic: z
    .array(
      z.object({
        conditions: z.array(
          z.object({
            sourceQuestionId: z.string(),
            operator: z.string(),
            value: z.union([z.string(), z.number(), z.boolean()]),
          }),
        ),
        action: z.object({
          type: z.string(),
          targetQuestionIds: z.array(z.string()),
        }),
      }),
    )
    .optional(),
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

    const questions = await db.question.findMany({
      where: {
        surveyId: params.surveyId,
        survey: {
          createdById: user.id,
        },
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
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Error fetching questions" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { surveyId: string } },
) {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if survey exists and belongs to user
    const survey = await db.survey.findUnique({
      where: {
        id: params.surveyId,
        createdById: user.id,
      },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const json = await request.json();
    const body = createQuestionSchema.parse(json);

    // Get the highest order number
    const lastQuestion = await db.question.findFirst({
      where: { surveyId: params.surveyId },
      orderBy: { order: "desc" },
    });
    const newOrder = (lastQuestion?.order ?? -1) + 1;

    const question = await db.question.create({
      data: {
        surveyId: params.surveyId,
        title: body.title,
        type: body.type as QuestionType,
        required: body.required ?? false,
        order: newOrder,
        options: body.options
          ? {
              create: body.options,
            }
          : undefined,
        explanation: body.explanation
          ? {
              create: body.explanation,
            }
          : undefined,
        validation: body.validation
          ? {
              create: {
                rules: body.validation,
              },
            }
          : undefined,
        logic: body.logic
          ? {
              create: body.logic,
            }
          : undefined,
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
    });

    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Error creating question" },
      { status: 500 },
    );
  }
}
