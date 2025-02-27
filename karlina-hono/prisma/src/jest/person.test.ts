import { Context } from "hono";
import prisma from "../client";
import { createPerson, deletePerson, getPerson, getPersonById, updatePerson } from "../controllers/PersonController";


beforeAll(async () => {
  await prisma.person.deleteMany(); 

  await prisma.person.create({
    data: { id: 1, name: "Person One", address: "Address One", phone: "1111111111" },
  });

  await prisma.person.create({
    data: { id: 2, name: "Person Two", address: "Address Two", phone: "2222222222" },
  });

  await prisma.person.create({
    data: { id: 3, name: "Person Three", address: "Address Three", phone: "3333333333" },
  });
  await prisma.person.create({
    data: { id: 4, name: "Person Four", address: "Address Four", phone: "4444444444" },
  });

  await prisma.person.create({
    data: { id: 5, name: "Person Five", address: "Address Five", phone: "555555555" },
  });

  await prisma.person.create({
    data: { id: 6, name: "Person Six", address: "Address Six", phone: "6666666" },
  });
  await prisma.person.create({
    data: { id: 7, name: "Person Seven", address: "", phone: "" },
  });
});



afterAll(async () => {
  await prisma.$disconnect();
});

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

    const person = await prisma.person.findUnique({ where: { id: personId } });

    await getPersonById(getPersonByIdTest);

    if (person) {
      expect(getPersonByIdTest.json).toHaveBeenCalledWith(person);
    } else {
      expect(getPersonByIdTest.json).toHaveBeenCalledWith({
        message: "Person Not Found!",
        statusCode: 404,
      });
    }
  });
});


export const createperson = async (c: Context) => {
  try {
    const { name, address, phone } = await c.req.json();

    const newPerson = await prisma.person.create({
      data: { name, address, phone },
    });

    return c.json(newPerson, 201);
  } catch (error) {
    return c.json({ message: "Error creating person", error }, 500);
  }
};


export const updatePersonByOrder = async (c: Context) => {
  try {
    const order = parseInt(c.req.param("order"));
    const { name, address, phone } = await c.req.json();

   
    const allPersons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (order < 1 || order > allPersons.length) {
      return c.json({ message: "Person Not Found!", statusCode: 404 });
    }

    const updatedPerson = await prisma.person.update({
      where: { id: allPersons[order - 1].id },
      data: { name, address, phone },
    });

    return c.json(updatedPerson);
  } catch (error) {
    return c.json({ message: "Error updating person", error }, 500);
  }
};



export const deletePersonByOrder = async (c: Context) => {
  try {
    const order = parseInt(c.req.param("order"));

    
    const allPersons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (order < 1 || order > allPersons.length) {
      return c.json({ message: "Person Not Found or Already Deleted", statusCode: 404 });
    }

    await prisma.person.delete({
      where: { id: allPersons[order - 1].id },
    });

    return c.json({ message: `Person in position ${order} from bottom deleted successfully`, statusCode: 200 });
  } catch (error) {
    return c.json({ message: "Error deleting person", error }, 500);
  }
};