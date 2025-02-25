import { Context } from "hono";
import prisma from "../prisma/client";
import { createPerson, deletePerson, getPersonById, updatePerson } from "../src/controllers/PersonController";


export const getPerson = async (c: Context) => {
  try {
    
    const person = await prisma.person.findMany({ orderBy: { id: "asc" } });
    return c.json(person);
  } catch (e: unknown) {
    console.error(`Error getting posts: ${e}`);
  }
};

describe("getPerson test", () => {
  test("getPerson test", async () => {
    const getPersonTest = {
      json: jest.fn(),
    } as unknown as Context;

    const persons = await prisma.person.findMany({ orderBy: { id: "asc" } });

    await getPerson(getPersonTest);

    expect(getPersonTest.json).toHaveBeenCalledWith(persons);
  });
});

describe("getPersonById test", () => {
  test("getPersonById test", async () => {
    const personId = 1;
    const getPersonByIdTest = {
      req: {
        param: jest.fn().mockReturnValue(personId),
      },
      json: jest.fn(),
    } as unknown as Context;

    const person = await prisma.person.findUnique({
      where: { id: personId },
    });

    await getPersonById(getPersonByIdTest);

    expect(getPersonByIdTest.json).toHaveBeenCalledWith(person);
  });
});

describe("createPerson test", () => {
  test("createPerson with all fields", async () => {
    const createTest = {
      req: {
        json: jest.fn().mockResolvedValue({
          name: "John Doe",
          address: "123 Street",
          phone: "1234567890",
        }),
      },
      json: jest.fn(),
    } as unknown as Context;

    await createPerson(createTest);

    expect(createTest.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        address: "123 Street",
        phone: "1234567890",
      })
    );
  });
});

describe("updatePerson test", () => {
  test("updatePerson with all fields", async () => {
    const personId = 2;
    const updateTest = {
      req: {
        param: jest.fn().mockReturnValue(personId),
        json: jest.fn().mockResolvedValue({
          name: "Updated Name",
          address: "Updated Address",
          phone: "0987654321",
        }),
      },
      json: jest.fn(),
    } as unknown as Context;

    await updatePerson(updateTest);

    expect(updateTest.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Updated Name",
        address: "Updated Address",
        phone: "0987654321",
      })
    );
  });
});

describe("deletePerson test", () => {
  test("deletePerson with existing id", async () => {
    const personId = 3;
    const deleteTest = {
      req: {
        param: jest.fn().mockReturnValue(personId),
      },
      json: jest.fn(),
    } as unknown as Context;

    await deletePerson(deleteTest);

    expect(deleteTest.json).toHaveBeenCalledWith({
      statusCode: 200,
      message: "Person Deleted Successfully!",
    });
  });
});
