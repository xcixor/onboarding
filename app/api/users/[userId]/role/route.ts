import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLoggedInUser } from "@/lib/auth/utils";
import { Role } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const user = await getLoggedInUser();

    if (!user || user.role !== Role.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { userId } = params;
    const { role } = await req.json();
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("[USER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
