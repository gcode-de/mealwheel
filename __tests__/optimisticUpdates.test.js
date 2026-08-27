import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import updateLikes from "@/helpers/updateLikes";
import updateUserInDb from "@/helpers/updateUserInDb";

describe("optimistic persistence helpers", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("publishes user changes immediately and avoids a follow-up request", async () => {
    const user = { _id: "user-1", name: "Neu" };
    fetch.mockResolvedValue({ ok: true });
    const mutate = jest.fn((updater) => updater({ _id: "user-1", name: "Alt" }));

    await updateUserInDb(user, mutate);

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][1]).toEqual({
      optimisticData: user,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/users/user",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(user) })
    );
  });

  it("configures household updates to roll back failed requests", async () => {
    const household = { _id: "household-1", shoppingList: [] };
    fetch.mockResolvedValue({ ok: false });
    const mutate = jest.fn((updater, options) => {
      expect(options.rollbackOnError).toBe(true);
      return updater({ _id: "household-1", shoppingList: [{ name: "Alt" }] });
    });

    await expect(updateHouseholdInDb(household, mutate)).rejects.toThrow(
      "Failed to update household data."
    );
  });

  it("updates likes optimistically for recipe lists", async () => {
    const recipes = [
      { _id: "recipe-1", likes: 2 },
      { _id: "recipe-2", likes: 5 },
    ];
    const persistedRecipe = { _id: "recipe-1", likes: 3 };
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ recipe: persistedRecipe }),
    });
    const mutate = jest.fn((updater, options) => {
      expect(options.optimisticData(recipes)).toEqual([
        { _id: "recipe-1", likes: 3 },
        recipes[1],
      ]);
      return updater(recipes);
    });

    const result = await updateLikes("recipe-1", 1, mutate);

    expect(result).toEqual([persistedRecipe, recipes[1]]);
    expect(mutate.mock.calls[0][1]).toEqual(
      expect.objectContaining({ rollbackOnError: true, revalidate: false })
    );
  });
});
