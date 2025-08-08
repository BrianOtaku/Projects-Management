
// Generated seed file from current DB
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function main() {
  // Insert Users
  await prisma.user.createMany({
    data: [
      {
        "id": "6",
        "name": "manager",
        "email": "manager@example.com",
        "password": "$2b$10$Z98EOnCGM17hWb/v77O1LeEOrMJBR.UyCRThbzhLyABq4Rp4vkXea",
        "role": "MANAGER"
      },
      {
        "id": "7",
        "name": "leader",
        "email": "leader@example.com",
        "password": "$2b$10$MXI694trYu8s8hSKN4oYve5asPc1uEHUX4ZiLCoHJiATi4P.m81Ay",
        "role": "LEADER"
      },
      {
        "id": "9",
        "name": "staff",
        "email": "staff@example.com",
        "password": "$2b$10$ze30y0WaZuqzJ0SoKiLJIOL.m5PuKIyanw/unX6dD.LQt3dfMPAF6",
        "role": "STAFF"
      },
      {
        "id": "10",
        "name": "staff1",
        "email": "staff1@example.com",
        "password": "$2b$10$3F3AIWKO4REK4pz2xk9n..fQaPxg0S58nSJydUEIvKtHeO38.xYhW",
        "role": "STAFF"
      },
      {
        "id": "11",
        "name": "staff2",
        "email": "staff2@example.com",
        "password": "$2b$10$yS2dPnjBSaO5..pXyGijmeWfb/vMXlznIb.g5lxtPsO2ntCwTzUqq",
        "role": "STAFF"
      }
    ]
  });

  // Insert teamMember
  await prisma.teamMember.createMany({
    data: [
      {
        "id": "1",
        "userId": "7",
        "projectId": "1"
      },
      {
        "id": "2",
        "userId": "9",
        "projectId": "1"
      },
      {
        "id": "3",
        "userId": "10",
        "projectId": "2"
      },
      {
        "id": "4",
        "userId": "11",
        "projectId": "2"
      }
    ]
  });

  // Insert Projects
  await prisma.project.createMany({
    data: [
      {
        "id": "1",
        "title": "Dự án quản lý học sinh",
        "description": "Ứng dụng giúp theo dõi học tập và điểm số",
        "status": "IN_PROGRESS",
        "startDate": {},
        "dueDate": {},
        "progress": 0,
        "fileUrl": "https://example.com/file.pdf"
      },
      {
        "id": "2",
        "title": "Dự án quản lý học sinh",
        "description": "Ứng dụng giúp theo dõi học tập và điểm số",
        "status": "IN_PROGRESS",
        "startDate": {},
        "dueDate": {},
        "progress": 0,
        "fileUrl": "https://example.com/file.pdf"
      },
      {
        "id": "3",
        "title": "Dự án quản lý học sinh",
        "description": "Ứng dụng giúp theo dõi học tập và điểm số",
        "status": "IN_PROGRESS",
        "startDate": {},
        "dueDate": {},
        "progress": 0,
        "fileUrl": "https://example.com/file.pdf"
      },
      {
        "id": "4",
        "title": "Dự án quản lý học sinh",
        "description": "Ứng dụng giúp theo dõi học tập và điểm số",
        "status": "IN_PROGRESS",
        "startDate": {},
        "dueDate": {},
        "progress": 0,
        "fileUrl": "https://example.com/file.pdf"
      },
      {
        "id": "5",
        "title": "Dự án quản lý học sinh",
        "description": "Ứng dụng giúp theo dõi học tập và điểm số",
        "status": "IN_PROGRESS",
        "startDate": {},
        "dueDate": {},
        "progress": 0,
        "fileUrl": "https://example.com/file.pdf"
      }
    ]
  });

  // Insert Tasks
  await prisma.task.createMany({
    data: [
      {
        "id": "1",
        "title": "New Task",
        "description": "Do something",
        "status": "IN_PROGRESS",
        "projectId": "1",
        "userId": "7",
        "startDate": {},
        "dueDate": {},
        "reviewedByLeader": false,
        "completeAt": null
      }
    ]
  });
}
