import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

export const appDocs = new OpenAPIHono()

appDocs.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'JWT token obtained after login or signup'
})

appDocs.openapi(
  createRoute({
    tags: ['Authentication'],
    summary: 'Register a new user',
    method: 'post',
    path: '/auth/sign-up',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().openapi({ description: 'User full name' }),
              email: z.string().email().openapi({ description: 'User email address' }),
              password: z.string().openapi({ description: 'User password' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Signed up user successfully',
        content: {
          'application/json': {
            schema: z.object({
              token: z.string().openapi({ description: 'JWT authentication token' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ token: 'dummy' })
)

appDocs.openapi(
  createRoute({
    tags: ['Authentication'],
    summary: 'Login with existing credentials',
    method: 'post',
    path: '/auth/log-in',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              email: z.string().email().openapi({ description: 'User email address' }),
              password: z.string().openapi({ description: 'User password' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Logged in successfully',
        content: {
          'application/json': {
            schema: z.object({
              token: z.string().openapi({ description: 'JWT authentication token' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ token: 'dummy' })
)

/**
 * ===============
 * USER MANAGEMENT
 * ===============
 */
appDocs.openapi(
  createRoute({
    tags: ['Users'],
    summary: 'Get current user profile',
    method: 'get',
    path: '/users/me',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Current user info',
        content: {
          'application/json': {
            schema: z.object({
              id: z.string().openapi({ description: 'User unique identifier' }),
              name: z.string().openapi({ description: 'User full name' }),
              email: z.string().openapi({ description: 'User email address' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ 
    id: '123', 
    name: 'John Doe', 
    email: 'john@example.com' 
  })
)

appDocs.openapi(
  createRoute({
    tags: ['Users'],
    summary: 'List all users',
    method: 'get',
    path: '/users',
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: 'Page number for pagination' }),
        limit: z.string().optional().openapi({ description: 'Number of items per page' }),
      }),
    },
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.string().openapi({ description: 'User unique identifier' }),
                name: z.string().openapi({ description: 'User full name' }),
                email: z.string().openapi({ description: 'User email address' }),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => c.json([])
)

/**
 * ==============
 * POST HANDLING
 * ==============
 */
appDocs.openapi(
  createRoute({
    tags: ['Posts'],
    summary: 'Get all posts',
    method: 'get',
    path: '/posts',
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: 'Page number for pagination' }),
        limit: z.string().optional().openapi({ description: 'Number of items per page' }),
      }),
    },
    responses: {
      200: {
        description: 'List of all posts',
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.string().openapi({ description: 'Post unique identifier' }),
                title: z.string().openapi({ description: 'Post title' }),
                content: z.string().openapi({ description: 'Post content/body' }),
                createdAt: z.string().openapi({ description: 'Creation timestamp' }),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => c.json([])
)

appDocs.openapi(
  createRoute({
    tags: ['Posts'],
    summary: 'Get current user posts',
    method: 'get',
    path: '/posts/me',
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: 'Page number for pagination' }),
        limit: z.string().optional().openapi({ description: 'Number of items per page' }),
      }),
    },
    responses: {
      200: {
        description: "User's own posts",
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.string().openapi({ description: 'Post unique identifier' }),
                title: z.string().openapi({ description: 'Post title' }),
                content: z.string().openapi({ description: 'Post content/body' }),
                createdAt: z.string().openapi({ description: 'Creation timestamp' }),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => c.json([])
)

appDocs.openapi(
  createRoute({
    tags: ['Posts'],
    summary: 'Create a new post',
    method: 'post',
    path: '/posts',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              title: z.string().openapi({ description: 'Post title' }),
              content: z.string().openapi({ description: 'Post content/body' }),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Post created',
        content: {
          'application/json': {
            schema: z.object({
              id: z.string().openapi({ description: 'Created post ID' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ id: 'dummy' })
)

appDocs.openapi(
  createRoute({
    tags: ['Posts'],
    summary: 'Delete a post',
    method: 'delete',
    path: '/posts/:postId',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Post deleted',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ description: 'Operation result' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ success: true })
)

/**
 * =================
 * LIKE MANAGEMENT
 * =================
 */
appDocs.openapi(
  createRoute({
    tags: ['Likes'],
    summary: 'Get likes on a post',
    method: 'get',
    path: '/likes/on/:postId',
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: 'Page number for pagination' }),
        limit: z.string().optional().openapi({ description: 'Number of items per page' }),
      }),
    },
    responses: {
      200: {
        description: 'Likes on post',
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                userId: z.string().openapi({ description: 'User who liked the post' }),
                createdAt: z.string().openapi({ description: 'When the like was created' }),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => c.json([])
)

appDocs.openapi(
  createRoute({
    tags: ['Likes'],
    summary: 'Like a post',
    method: 'post',
    path: '/likes/on/:postId',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Like added',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ description: 'Operation result' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ success: true })
)

appDocs.openapi(
  createRoute({
    tags: ['Likes'],
    summary: 'Unlike a post',
    method: 'delete',
    path: '/likes/on/:postId',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Like removed',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ description: 'Operation result' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ success: true })
)

/**
 * ==================
 * COMMENT HANDLING
 * ==================
 */
appDocs.openapi(
  createRoute({
    tags: ['Comments'],
    summary: 'Get comments on a post',
    method: 'get',
    path: '/comments/on/:postId',
    security: [{ bearerAuth: [] }],
    request: {
      query: z.object({
        page: z.string().optional().openapi({ description: 'Page number for pagination' }),
        limit: z.string().optional().openapi({ description: 'Number of items per page' }),
      }),
    },
    responses: {
      200: {
        description: 'List of comments',
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.string().openapi({ description: 'Comment ID' }),
                text: z.string().openapi({ description: 'Comment content' }),
                userId: z.string().openapi({ description: 'User who created the comment' }),
                createdAt: z.string().openapi({ description: 'When the comment was created' }),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => c.json([])
)

appDocs.openapi(
  createRoute({
    tags: ['Comments'],
    summary: 'Add a comment to a post',
    method: 'post',
    path: '/comments/on/:postId',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              text: z.string().openapi({ description: 'Comment content' }),
            }),
          },
        },
      },
    },

    responses: {
      201: {
        description: 'Comment added',
        content: {
          'application/json': {
            schema: z.object({
              id: z.string().openapi({ description: 'Created comment ID' }),
            }),
          },
        },
      },
    },
  }),
  async (c) => c.json({ id: 'dummy' })
)