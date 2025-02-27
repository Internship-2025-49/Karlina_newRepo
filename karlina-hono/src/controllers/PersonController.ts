// import { drizzle } from "drizzle-orm/mysql2";
// import type { Context } from "hono";
// import prisma from "../../prisma/src/client";

// // import  { Person }  from "../drizzle/schema.js";
// // import { asc, eq } from "drizzle-orm";
// // import { db } from '../drizzle/index.js';


// /**
//  * Getting all posts
//  */
// export const getPerson = async (c: Context) => {
//   try {
//     //get all posts
//     const person = await prisma.person.findMany({ orderBy: { id: "asc" } });
//     // const data = await db.select().from(Person);
//     //return JSON
//     return c.json(person);
//   } catch (e: unknown) {
//     console.error(`Error getting posts: ${e}`);
//   }
// };

// export async function createPerson(c: Context) {
//   try {
//     //get body request
//     const body = await c.req.json();

//     //check if title and content is string
//     const name = typeof body["name"] === "string" ? body["name"] : "";
//     const address = typeof body["address"] === "string" ? body["address"] : "";
//     const phone = typeof body["phone"] === "string" ? body["phone"] : "";

//     const person = await prisma.person.create({
//       data: {
//         name: name,
//         address: address,
//         phone: phone,
//       },
//     });

//     //return JSON
//     return c.json(person);
//   } catch (e: unknown) {
//     console.error(`Error creating person: ${e}`);
//   }
// }

// export async function getPersonById(c: Context) {
//   try {
//     // Konversi tipe id menjadi number
//     const personId = parseInt(c.req.param("id"));

//     //get food by id
//     const person = await prisma.person.findUnique({
//       where: { id: personId },
//     });

//     //if food not found
//     if (!person) {
//       //return JSON
//       return c.json({
//         statusCode: 404,
//         message: "ID Food Not Found!",
//       });
//     }

//     //return JSON
//     return c.json(person);
//   } catch (e: unknown) {
//     console.error(`Error finding food: ${e}`);
//   }
// }

// export async function updatePerson(c: Context) {
//   try {
//     // Konversi tipe id menjadi number
//     const personId = parseInt(c.req.param("id"));

//     //get body request
//     const body = await c.req.json();

//     //check if title and content is string
//     const name = typeof body["name"] === "string" ? body["name"] : "";
//     const address = typeof body["address"] === "string" ? body["address"] : "";
//     const phone = typeof body["phone"] === "string" ? body["phone"] : "";

//     //update food with prisma
//     const person = await prisma.person.update({
//       where: { id: personId },
//       data: {
//         name: name,
//         address: address,
//         phone: phone,
//       },
//     });

//     //return JSON
//     return c.json(person);
//   } catch (e: unknown) {
//     console.error(`Error updating food: ${e}`);
//   }
// }

// export async function deletePerson(c: Context) {
//   try {
//     // Konversi tipe id menjadi number
//     const personId = parseInt(c.req.param("id"));

//     //delete food with prisma
//     await prisma.person.delete({
//       where: { id: personId },
//     });

//     //return JSON
//     return c.json({
//       statusCode: 200,
//       message: "Person Deleted Successfully!",
//     });
//   } catch (e: unknown) {
//     console.error(`Error deleting person: ${e}`);
//   }
// }

import { drizzle } from "drizzle-orm/mysql2";
import type { Context } from "hono";
import prisma from "../../prisma/src/client";


/**
 * Getting all persons ordered by descending ID (latest first)
 */
export const getPerson = async (c: Context) => {
  try {
   
    const person = await prisma.person.findMany({ orderBy: { id: "desc" } });
    return c.json(person);
  } catch (e: unknown) {
    console.error(`Error getting persons: ${e}`);
  }
};

export async function createPerson(c: Context) {
  try {
    const body = await c.req.json();
    const name = typeof body["name"] === "string" ? body["name"] : "";
    const address = typeof body["address"] === "string" ? body["address"] : "";
    const phone = typeof body["phone"] === "string" ? body["phone"] : "";

    const person = await prisma.person.create({
      data: { name, address, phone },
    });

    return c.json(person);
  } catch (e: unknown) {
    console.error(`Error creating person: ${e}`);
  }
}

export async function getPersonById(c: Context) {
  try {
    const index = parseInt(c.req.param("id"));
    const persons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (index <= 0 || index > persons.length) {
      return c.json({ statusCode: 404, message: "Index Out of Range!" });
    }

    return c.json(persons[index - 1]);
  } catch (e: unknown) {
    console.error(`Error finding person: ${e}`);
  }
}

export async function updatePerson(c: Context) {
  try {
    const index = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const name = typeof body["name"] === "string" ? body["name"] : "";
    const address = typeof body["address"] === "string" ? body["address"] : "";
    const phone = typeof body["phone"] === "string" ? body["phone"] : "";

    
    const persons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (index <= 0 || index > persons.length) {
      return c.json({ statusCode: 404, message: "Index Out of Range!" });
    }

    const personToUpdate = persons[index - 1]; 
    const updatedPerson = await prisma.person.update({
      where: { id: personToUpdate.id },
      data: { name, address, phone },
    });

    return c.json({
      message: "Person updated successfully",
      data: updatedPerson, 
      statusCode: 200
  });
} catch (e) {
  console.error(`Error updating person: ${e}`);
  return c.json({ message: "Error updating person" }, 500);
}
}

export async function deletePerson(c: Context) {
  try {
    const index = parseInt(c.req.param("id"));

   
    const persons = await prisma.person.findMany({ orderBy: { id: "desc" } });

    if (index <= 0 || index > persons.length) {
      return c.json({ statusCode: 404, message: "Index Out of Range!" });
    }

    const personToDelete = persons[index - 1]; 

    await prisma.person.delete({ where: { id: personToDelete.id } });

    return c.json({ statusCode: 200, message: "Person Deleted Successfully!" });
  } catch (e: unknown) {
    console.error(`Error deleting person: ${e}`);
  }
}
