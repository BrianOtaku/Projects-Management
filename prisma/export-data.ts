// scripts/export-data.ts
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import { convertBigIntToString } from '@/lib/utils';

async function main() {
    // Lấy dữ liệu từ các bảng (ví dụ: User, Project, Task)
    const users = await prisma.user.findMany();
    const teamMember = await prisma.teamMember.findMany();
    const projects = await prisma.project.findMany();
    const tasks = await prisma.task.findMany();

    // Chuyển dữ liệu thành chuỗi code TypeScript
    const seedContent = `
// Generated seed file from current DB
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function main() {
  // Insert Users
  await prisma.user.createMany({
    data: ${JSON.stringify(convertBigIntToString(users), null, 2)}
  });

    // Insert teamMember
  await prisma.teamMember.createMany({
    data: ${JSON.stringify(convertBigIntToString(teamMember), null, 2)}
  });

  // Insert Projects
  await prisma.project.createMany({
    data: ${JSON.stringify(convertBigIntToString(projects), null, 2)}
  });

  // Insert Tasks
  await prisma.task.createMany({
    data: ${JSON.stringify(convertBigIntToString(tasks), null, 2)}
  });
}
`;

    // Ghi ra file seed.ts
    fs.writeFileSync('prisma/seed.ts', seedContent);
    console.log('✅ Đã xuất file prisma/seed.ts từ dữ liệu hiện tại');
}

main().finally(() => prisma.$disconnect());
