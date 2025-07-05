import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.event.createMany({
    data: [
      { title: 'Music Festival', date: new Date('2025-07-10') },
      { title: 'Art Exhibition', date: new Date('2025-08-15') },
    ],
  })

  console.log('🌱 Seed complete')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())