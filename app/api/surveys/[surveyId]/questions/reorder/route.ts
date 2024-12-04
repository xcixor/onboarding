// app/api/surveys/[surveyId]/questions/reorder/route.ts

import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth/utils";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { surveyId: string } },
) {
  try {
    const user = await getLoggedInUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questions } = await request.json();

    // Update all questions in a transaction
    await db.$transaction(
      questions.map((question: any) =>
        db.question.update({
          where: {
            id: question.id,
            surveyId: params.surveyId,
          },
          data: {
            order: question.order,
          },
        }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering questions:", error);
    return NextResponse.json(
      { error: "Error reordering questions" },
      { status: 500 },
    );
  }
}
