import { prismaClient } from "../../extras/prisma";
import { CommentError } from "./comments-types";
export const getComments = async (parameters) => {
    const comments = await prismaClient.comment.findMany({
        where: { postId: parameters.postId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { comments };
};
export const createComment = async (parameters) => {
    const comment = await prismaClient.comment.create({
        data: {
            text: parameters.text,
            userId: parameters.userId,
            postId: parameters.postId
        },
        include: { user: { select: { username: true, name: true } } }
    });
    return { comment };
};
export const updateComment = async (parameters) => {
    const comment = await prismaClient.comment.findUnique({
        where: { id: parameters.commentId }
    });
    if (!comment)
        throw CommentError.NOT_FOUND;
    if (comment.userId !== parameters.userId)
        throw CommentError.UNAUTHORIZED;
    const updatedComment = await prismaClient.comment.update({
        where: { id: parameters.commentId },
        data: { text: parameters.text },
        include: { user: { select: { username: true, name: true } } }
    });
    return { comment: updatedComment };
};
export const deleteComment = async (parameters) => {
    const comment = await prismaClient.comment.findUnique({
        where: { id: parameters.commentId }
    });
    if (!comment)
        throw CommentError.NOT_FOUND;
    if (comment.userId !== parameters.userId)
        throw CommentError.UNAUTHORIZED;
    await prismaClient.comment.delete({
        where: { id: parameters.commentId }
    });
};
