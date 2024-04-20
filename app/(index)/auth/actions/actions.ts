import { db } from "@/lib/db";

export const verifyEmail = async (token: string) => {
  const user = await db.user.findFirst({
    where: {
      verifyToken: token,
    },
  });
  if (!user) {
    return {
      user: null,
      isVerified: false,
    };
  }
  try {
    const userToVerify = await db.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });
    if (!userToVerify) {
      return {
        user: user,
        isVerified: false,
      };
    }
    const verifiedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verifyToken: "",
        verifyTokenExpiry: null,
      },
    });

    return {
      user: verifiedUser,
      isVerified: verifiedUser.isVerified,
    };
  } catch (error) {
    console.log(error);
    return {
      user: user,
      isVerified: false,
    };
  }
};
