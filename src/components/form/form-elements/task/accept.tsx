"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';
import { updateTaskStatus } from '@/services/task';
import FileInput from '../../input/FileInput';

export default function Accept() {

  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await updateTaskStatus(id, {
        accept: true,
      });
      router.push("/admin/pending-tasks");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDisapprove = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await updateTaskStatus(id, {
        accept: false,
      });
      router.push("/admin/pending-tasks");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/pending-tasks");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="File URL">
          <Label>File URL</Label>
          <FileInput />
        </ComponentCard>
      </div>

      <div className="flex gap-6 justify-center sm:justify-start">
        <Button
          type="submit"
          size="sm"
          variant="primary"
        >
          Approve
        </Button>

        <Button
          onClick={handleDisapprove}
          size="sm"
          variant="error"
        >
          Disapprove
        </Button>

        <Button
          onClick={handleCancel}
          size="sm"
          variant="outline"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}