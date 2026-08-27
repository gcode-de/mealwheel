import { expect, test } from "@playwright/test";

const recipe = {
  _id: "recipe-1",
  title: "Ofengemüse mit Feta",
  instructions: "Gemüse schneiden.\nAlles im Ofen backen.",
  imageLink: "",
  diet: ["vegetarian"],
  mealtype: ["dinner"],
  ingredients: [
    { _id: "ingredient-1", name: "Paprika", quantity: 1, unit: "Stk." },
  ],
  defaultNumberOfServings: 2,
  duration: 35,
  difficulty: "easy",
  author: "author-1",
  likes: 0,
};

async function mockPublicApi(page) {
  await page.route("**/api/users/user**", (route) =>
    route.fulfill({
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({ message: "Nicht angemeldet" }),
    })
  );

  await page.route("**/api/users", (route) =>
    route.fulfill({ json: [] })
  );

  await page.route("**/api/recipes**", (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const body = pathname === `/api/recipes/${recipe._id}` ? recipe : [recipe];
    return route.fulfill({ json: body });
  });
}

test.beforeEach(async ({ page }) => {
  await mockPublicApi(page);
});

test("start page loads recipes and applies a search", async ({ page }) => {
  const recipeRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/recipes") {
      recipeRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Meal Wheel" })).toBeVisible();
  await expect(page.getByText(recipe.title)).toBeVisible();

  await page.getByRole("button", { name: "Filter öffnen" }).click();
  await page.getByRole("textbox", { name: "Rezepte suchen" }).fill("Feta");
  await page.getByRole("button", { name: "Suche ausführen" }).click();

  await expect(page).toHaveURL(/search=Feta/);
  await expect.poll(() => recipeRequests.some((url) => url.includes("search=Feta"))).toBe(true);
  await expect(page.getByText(recipe.title)).toBeVisible();
});

test("failed recipe loading can be retried", async ({ page }) => {
  await page.unroute("**/api/recipes**");
  let shouldFail = true;
  await page.route("**/api/recipes**", (route) =>
    shouldFail
      ? route.fulfill({ status: 500, json: { message: "Fehler" } })
      : route.fulfill({ json: [recipe] })
  );

  await page.goto("/");
  await expect(page.locator('main[role="alert"]')).toContainText(
    "Die Rezepte konnten nicht geladen werden."
  );

  shouldFail = false;
  await page.getByRole("button", { name: "Erneut versuchen" }).click();
  await expect(page.getByText(recipe.title)).toBeVisible();
});

test("recipe detail is reachable from the start page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: recipe.title, exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`/recipe/${recipe._id}`));
  await expect(page.getByRole("heading", { name: recipe.title })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Zutaten/ })).toBeVisible();
  await expect(page.getByText("Paprika")).toBeVisible();
});

test("favorites explain how to sign in for anonymous users", async ({ page }) => {
  await page.goto("/profile/favorites");

  await expect(page.getByRole("heading", { name: "Schmeckos" })).toBeVisible();
  await expect(page.getByRole("link", { name: "einloggen" })).toHaveAttribute(
    "href",
    "/api/auth/signin"
  );
});

test("offline fallback is available", async ({ page }) => {
  await page.goto("/offline");

  await expect(
    page.getByRole("heading", { name: "Du bist gerade offline" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Erneut versuchen" })).toHaveAttribute(
    "href",
    "/"
  );
});
