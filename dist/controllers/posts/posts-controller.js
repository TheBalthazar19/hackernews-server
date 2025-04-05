import { prismaClient } from "../../extras/prisma";
import { PostError } from "./posts-types";
export const getAllPosts = async (parameters) => {
    const posts = await prismaClient.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { posts };
};
export const getMyPosts = async (parameters) => {
    const posts = await prismaClient.post.findMany({
        where: { userId: parameters.userId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { posts };
};
export const createPost = async (parameters) => {
    const post = await prismaClient.post.create({
        data: {
            title: parameters.title,
            url: parameters.url,
            userId: parameters.userId
        },
        include: { user: { select: { username: true, name: true } } }
    });
    return { post };
};
export const deletePost = async (parameters) => {
    const post = await prismaClient.post.findUnique({
        where: { id: parameters.postId }
    });
    if (!post)
        throw PostError.NOT_FOUND;
    if (post.userId !== parameters.userId)
        throw PostError.UNAUTHORIZED;
    await prismaClient.post.delete({
        where: { id: parameters.postId }
    });
};
