import { createHash } from "crypto";
import { LogInWtihUsernameAndPasswordError, SignUpWithUsernameAndPasswordError, } from "./authentication-types";
import { prismaClient } from "../../extras/prisma";
import * as jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../environment";
export const signUpWithUsernameAndPassword = async (parameters) => {
    // Check if user already exists
    const isUserExistingAlready = await checkIfUserExistsAlready({
        username: parameters.username,
    });
    if (isUserExistingAlready) {
        throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }
    // Create password hash
    const passwordHash = await createPasswordHash({
        password: parameters.password,
    });
    // Create new user
    const user = await prismaClient.user.create({
        data: {
            username: parameters.username,
            password: passwordHash,
            name: parameters.name,
        },
    });
    // Generate JWT token
    const token = createJWToken({
        id: user.id,
        username: user.username,
    });
    return {
        token,
        user,
    };
};
export const logInWithUsernameAndPassword = async (parameters) => {
    // Create password hash
    const passwordHash = createPasswordHash({
        password: parameters.password,
    });
    // Find user
    const user = await prismaClient.user.findUnique({
        where: {
            username: parameters.username,
            password: passwordHash,
        },
    });
    if (!user) {
        throw LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
    }
    // Generate JWT token
    const token = createJWToken({
        id: user.id,
        username: user.username,
    });
    return {
        token,
        user,
    };
};
const createJWToken = (parameters) => {
    const jwtPayload = {
        iss: "hackernews-server",
        sub: parameters.id,
        username: parameters.username,
    };
    return jwt.sign(jwtPayload, jwtSecretKey, {
        expiresIn: "30d",
    });
};
const checkIfUserExistsAlready = async (parameters) => {
    const existingUser = await prismaClient.user.findUnique({
        where: {
            username: parameters.username,
        },
    });
    return !!existingUser;
};
const createPasswordHash = (parameters) => {
    return createHash("sha256").update(parameters.password).digest("hex");
};
