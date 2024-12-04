// api/surveys/[surveyId]/questions/[questionId]/index.ts
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { z } from "zod";
import { QuestionType } from "@prisma/client";

const updateQuestionSchema = z.object({
  title: z.string().min(1, "Question title is required").max(500).optional(),
  type: z
    .enum([
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
    ] as const)
    .optional(),
  required: z.boolean().optional(),
  order: z.number().optional(),
  options: z
    .array(
      z.object({
        id: z.string().optional(),
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

export async function PATCH(
  request: Request,
  { params }: { params: { surveyId: string; questionId: string } },
) {
  try {
    const user = await getLoggedInUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify survey ownership
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
    const body = updateQuestionSchema.parse(json);

    // Update question and related data in a transaction
    const updatedQuestion = await db.$transaction(async (tx) => {
      // Update main question data
      const question = await tx.question.update({
        where: {
          id: params.questionId,
          surveyId: params.surveyId,
        },
        data: {
          title: body.title,
          type: body.type as QuestionType,
          required: body.required,
          order: body.order,
        },
      });

      // Update options if provided
      if (body.options) {
        // Delete existing options
        await tx.questionOption.deleteMany({
          where: { questionId: params.questionId },
        });

        // Create new options
        if (body.options.length > 0) {
          await tx.questionOption.createMany({
            data: body.options.map((opt) => ({
              id: opt.id,
              questionId: params.questionId,
              text: opt.text,
              order: opt.order,
            })),
          });
        }
      }

      // Update explanation if provided
      if (body.explanation) {
        await tx.questionExplanation.upsert({
          where: { questionId: params.questionId },
          create: {
            questionId: params.questionId,
            ...body.explanation,
          },
          update: body.explanation,
        });
      }

      // Update validation if provided
      if (body.validation) {
        await tx.questionValidation.upsert({
          where: { questionId: params.questionId },
          create: {
            questionId: params.questionId,
            rules: body.validation,
          },
          update: {
            rules: body.validation,
          },
        });
      }

      // Update logic if provided
      if (body.logic) {
        // Delete existing logic
        await tx.questionLogic.deleteMany({
          where: { questionId: params.questionId },
        });

        // Create new logic
        if (body.logic.length > 0) {
          await tx.questionLogic.createMany({
            data: body.logic.map((logic) => ({
              questionId: params.questionId,
              conditions: logic.conditions,
              action: logic.action,
            })),
          });
        }
      }

      // Return updated question with all related data
      return tx.question.findUnique({
        where: { id: params.questionId },
        include: {
          options: {
            orderBy: { order: "asc" },
          },
          explanation: true,
          validation: true,
          logic: true,
        },
      });
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Error updating question" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { surveyId: string; questionId: string } },
) {
  try {
    const user = await getLoggedInUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify survey ownership
    const survey = await db.survey.findUnique({
      where: {
        id: params.surveyId,
        createdById: user.id,
      },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    await db.question.delete({
      where: {
        id: params.questionId,
        surveyId: params.surveyId,
      },
    });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Error deleting question" },
      { status: 500 },
    );
  }
}
