"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '../../input/TextArea';
import { getProject } from '@/services/project';
import { User } from '@/constants/interfaces';
import { useParams, useRouter } from 'next/navigation';
import { createTask } from '@/services/task';

export default function NewTask() {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const project = await getProject(id);
        const members = project.team?.members || [];
        const memberOptions = members.map((member: User) => ({
          value: member.id,
          label: member.name,
        }));

        setOptions(memberOptions);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await createTask({
        title,
        projectId: id,
        userId,
        startDate,
        dueDate,
        description,
      });
      router.push("/admin/leader-projects");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/leader-projects");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Task">
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label>Select Member</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select a member"
              onChange={(value) => setUserId(value)}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </ComponentCard>

        <ComponentCard title="Timeline">
          <DatePicker
            id="start-date"
            label="Start Date"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => setStartDate(currentDateString)}
          />

          <DatePicker
            id="due-date"
            label="Due Date"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => setDueDate(currentDateString)}
          />
        </ComponentCard>
      </div>

      <ComponentCard title="Description">
        <TextArea
          value={description}
          onChange={(value) => setDescription(value)}
          rows={6}
        />
      </ComponentCard>

      <div className="flex gap-6 justify-center sm:justify-start">
        <Button
          type="submit"
          size="sm"
          variant="success"
        >
          Create Task
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