import { Context } from "hono";
import prisma from "../client";
import { createPerson, getPerson, getPersonById, updatePerson, deletePerson } from "../controllers/PersonController";

beforeAll(async () => {
  await prisma.person.deleteMany();

  await prisma.person.createMany({
    data: [
      { name: "Person One", address: "Address One", phone: "1111111111" },
      { name: "Person Two", address: "Address Two", phone: "2222222222" },
      { name: "Person Three", address: "Address Three", phone: "3333333333" },
      { name: "Person Four", address: "Address Four", phone: "4444444444" },
      { name: "Person Five", address: "Address Five", phone: "5555555555" },
      { name: "Person Six", address: "Address Six", phone: "6666666666" },
      { name: "Person Seven", address: "", phone: "" },
    ],
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /person", () => {
  test("Should return all persons in ascending order", async () => {
    const getPersonTest = { json: jest.fn() } as unknown as Context;
    
    const persons = await prisma.person.findMany({ orderBy: { id: "asc" } });

    await getPerson(getPersonTest);
    
    expect(getPersonTest.json).toHaveBeenCalledWith(expect.arrayContaining(persons));
  });
});

describe("GET /person/:order", () => {
  test("Should return the person at a specific order from bottom", async () => {
    const order = 2;
    const getPersonByOrderTest = { req: { param: jest.fn().mockReturnValue(order) }, json: jest.fn() } as unknown as Context;

    const allPersons = await prisma.person.findMany({ orderBy: { id: "desc" } });
    
    if (order < 1 || order > allPersons.length) {
      await getPersonById(getPersonByOrderTest);
      expect(getPersonByOrderTest.json).toHaveBeenCalledWith({ message: "Person Not Found!", statusCode: 404 });
    } else {
      await getPersonById(getPersonByOrderTest);
      expect(getPersonByOrderTest.json).toHaveBeenCalledWith(expect.objectContaining(allPersons[order - 1]));
    }
  });
});

describe("POST /person", () => {
  test("Should create a new person", async () => {
    const createTest = { req: { json: jest.fn().mockResolvedValue({ name: "John Doe", address: "123 Street", phone: "1234567890" }) }, json: jest.fn() } as unknown as Context;

    await createPerson(createTest);

    expect(createTest.json).toHaveBeenCalledWith(expect.objectContaining({
      name: "John Doe",
      address: "123 Street",
      phone: "1234567890",
    }));
  });
});

describe("PUT /person/:order", () => {
  test("Should update person at a specific order from bottom", async () => {
    const order = 3;
    const updateTest = { 
      req: { 
        param: jest.fn().mockReturnValue(order), 
        json: jest.fn().mockResolvedValue({ name: "Updated Name", address: "Updated Address", phone: "0987654321" }) 
      }, 
      json: jest.fn() 
    } as unknown as Context;

    const allPersons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (order < 1 || order > allPersons.length) {
      await updatePerson(updateTest);
      expect(updateTest.json).toHaveBeenCalledWith({ message: "Person Not Found!", statusCode: 404 });
    } else {
      await updatePerson(updateTest);
      expect(updateTest.json).toHaveBeenCalledWith(expect.objectContaining({
        name: "Updated Name",
        address: "Updated Address",
        phone: "0987654321",
      }));
    }
  });
});

describe("DELETE /person/:order", () => {
  test("Should delete person at a specific order from bottom", async () => {
    const order = 1;
    const deleteTest = { req: { param: jest.fn().mockReturnValue(order) }, json: jest.fn() } as unknown as Context;

    const allPersons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (order < 1 || order > allPersons.length) {
      await deletePerson(deleteTest);
      expect(deleteTest.json).toHaveBeenCalledWith({ message: "Person Not Found!", statusCode: 404 });
    } else {
      await deletePerson(deleteTest);
      expect(deleteTest.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Person Deleted Successfully!",
        statusCode: 200,
      }));
    }
  });

  test("Should return 404 if trying to delete a non-existent person", async () => {
    const order = 20; 
    const deleteTest = { req: { param: jest.fn().mockReturnValue(order) }, json: jest.fn() } as unknown as Context;

    await deletePerson(deleteTest);

    expect(deleteTest.json).toHaveBeenCalledWith({ message: "Index Out of Range!", statusCode: 404 });
  });
});
