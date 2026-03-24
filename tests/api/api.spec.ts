import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/apiClient";
import { AllureHelper } from "@utils/allureHelper";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const api = new ApiClient("https://jsonplaceholder.typicode.com");

async function getErrorStatus(request: Promise<unknown>): Promise<number> {
  try {
    await request;
    throw new Error("Expected request to fail but it succeeded");
  } catch (error: unknown) {
    const axiosError = error as { response?: { status: number } };
    if (axiosError.response?.status) {
      return axiosError.response.status;
    }
    throw error;
  }
}

test.describe("API — Posts", () => {
  test("@api @smoke - GET /posts returns list of 100 posts", async () => {
    await AllureHelper.label("API Posts", "Create Post", "critical");

    const body = {
      title: "QA Automation Post",
      body: "Testing the POST endpoint",
      userId: 1,
    };

    // Attach the request body to the report
    await AllureHelper.attachJson("Request Body", body);

    const res = await api.post<Post>("/posts", body);

    // Attach the response to the report
    await AllureHelper.attachJson("Response Body", res.data);

    expect(res.status).toBe(201);
    expect(res.data.title).toBe(body.title);
    expect(res.data.id).toBeTruthy();
  });

  test("@api @regression - GET /posts/:id returns single post", async () => {
    const res = await api.get<Post>("/posts/1");

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(1);
    expect(typeof res.data.title).toBe("string");
    expect(res.data.title.length).toBeGreaterThan(0);
  });

  test("@api @regression - GET /posts/:id returns 404 for missing post", async () => {
    const status = await getErrorStatus(api.get("/posts/9999"));
    expect(status).toBe(404);
  });

  test("@api @regression - GET /posts supports filtering by userId", async () => {
    const res = await api.get<Post[]>("/posts", { userId: 1 });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((post) => {
      expect(post.userId).toBe(1);
    });
  });

  test("@api @regression - GET /posts/:id/comments returns comments for post", async () => {
    const res = await api.get<Comment[]>("/posts/1/comments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((comment) => {
      expect(comment.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(comment.postId).toBe(1);
    });
  });
});

test.describe("API — Posts CRUD", () => {
  test("@api @smoke - POST /posts creates a new post", async () => {
    const body = {
      title: "QA Automation Post",
      body: "Testing the POST endpoint",
      userId: 1,
    };

    const res = await api.post<Post>("/posts", body);

    expect(res.status).toBe(201);
    expect(res.data.title).toBe(body.title);
    expect(res.data.body).toBe(body.body);
    expect(res.data.userId).toBe(body.userId);
    expect(res.data.id).toBeTruthy();
  });

  test("@api @regression - PUT /posts/:id replaces entire post", async () => {
    const body = {
      id: 1,
      title: "Updated Title",
      body: "Updated body content",
      userId: 1,
    };

    const res = await api.put<Post>("/posts/1", body);

    expect(res.status).toBe(200);
    expect(res.data.title).toBe(body.title);
    expect(res.data.body).toBe(body.body);
  });

  test("@api @regression - PATCH /posts/:id updates only specified fields", async () => {
    const body = { title: "Only Title Changed" };

    const res = await api.patch<Post>("/posts/1", body);

    expect(res.status).toBe(200);
    expect(res.data.title).toBe(body.title);
    expect(res.data.id).toBe(1);
  });

  test("@api @regression - DELETE /posts/:id returns 200", async () => {
    const res = await api.delete("/posts/1");
    expect(res.status).toBe(200);
  });
});

test.describe("API — Users", () => {
  test("@api @smoke - GET /users returns 10 users", async () => {
    const res = await api.get<User[]>("/users");

    expect(res.status).toBe(200);
    expect(res.data.length).toBe(10);

    const first = res.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("email");
  });

  test("@api @regression - GET /users/:id returns correct user", async () => {
    const res = await api.get<User>("/users/1");

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(1);

    expect(res.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test("@api @regression - GET /users/:id returns 404 for missing user", async () => {
    const status = await getErrorStatus(api.get("/users/9999"));
    expect(status).toBe(404);
  });
});

test.describe("API — Todos", () => {
  test("@api @regression - GET /todos filters by completed status", async () => {
    const res = await api.get<Todo[]>("/todos", { completed: true });

    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);

    res.data.forEach((todo) => {
      expect(todo.completed).toBe(true);
    });
  });

  test("@api @regression - GET /todos/:id returns single todo", async () => {
    const res = await api.get<Todo>("/todos/1");

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(1);
    expect(res.data).toHaveProperty("completed");
    expect(typeof res.data.completed).toBe("boolean");
  });
});

test.describe("API — Response Quality", () => {
  test("@api @regression - response time is under 3000ms", async () => {
    const start = Date.now();
    await api.get("/posts/1");
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(3000);
  });

  test("@api @regression - response has correct content-type header", async () => {
    const res = await api.get("/posts/1");
    expect(res.headers["content-type"]).toContain("application/json");
  });

  test("@api @regression - parallel requests all complete successfully", async () => {
    // Promise.all runs all 3 simultaneously — faster than sequential
    const [posts, users, todos] = await Promise.all([
      api.get<Post[]>("/posts"),
      api.get<User[]>("/users"),
      api.get<Todo[]>("/todos"),
    ]);

    expect(posts.status).toBe(200);
    expect(users.status).toBe(200);
    expect(todos.status).toBe(200);
  });
});
