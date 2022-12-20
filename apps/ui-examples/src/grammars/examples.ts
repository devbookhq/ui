
export const prisma =
  `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`

export const ts =
  `import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()
  `