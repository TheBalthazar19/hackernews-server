import { prismaClient } from "../../extras/prisma";
import { LikeError } from "./likes-types";
export const getLikes = async (parameters) => {
    const likes = await prismaClient.like.findMany({
        where: { postId: parameters.postId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { likes };
};
export const createLike = async (parameters) => {
    const existingLike = await prismaClient.like.findUnique({
        where: { userId_postId: { userId: parameters.userId, postId: parameters.postId } },
        include: { user: { select: { username: true, name: true } } }
    });
    if (existingLike)
        return { like: existingLike };
    const like = await prismaClient.like.create({
        data: {
            userId: parameters.userId,
            postId: parameters.postId
        },
        include: { user: { select: { username: true, name: true } } }
    });
    return { like };
};
export const deleteLike = async (parameters) => {
    const like = await prismaClient.like.findUnique({
        where: { userId_postId: { userId: parameters.userId, postId: parameters.postId } }
    });
    if (!like)
        throw LikeError.NOT_FOUND;
    if (like.userId !== parameters.userId)
        throw LikeError.UNAUTHORIZED;
    await prismaClient.like.delete({
        where: { userId_postId: { userId: parameters.userId, postId: parameters.postId } }
    });
};
