"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';
import { updateProjectStatus } from '@/services/project';
import FileInput from '../../input/FileInput';

export default function Submit() {

  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await updateProjectStatus(id, {
        submit: true,
      });
      router.push("/admin/assigned-projects");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/assigned-projects");
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
          Submit
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