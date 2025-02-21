import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const Person = mysqlTable('person', {
  id: int("id").notNull().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 255 }).notNull(),
});

export const Auth = mysqlTable("auth", {
  key: varchar("key", { length: 36 }).primaryKey(),
});