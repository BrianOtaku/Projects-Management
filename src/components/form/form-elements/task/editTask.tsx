"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '../../input/TextArea';
import { deleteProject, getProject, updateProject } from '@/services/project';
import { getTeams } from '@/services/team';
import Checkbox from '../../input/Checkbox';
import { Status } from '@/constants/interfaces';
import { useRouter } from 'next/navigation';

export default function EditProject() {
  const [title, setTitle] = useState("");
  const [teamId, setTeamId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [status, setSelectedStatus] = useState<Status | null>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await getTeams();
        const teamOptions = teams.map((team: { id: unknown; teamName: unknown; }) => ({
          value: team.id,
          label: team.teamName,
        }));
        setOptions(teamOptions);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await getProject(id);
        if (response) {
          setTitle(response.title);
          setTeamId(response.teamId);
          setStartDate(response.startDate);
          setDueDate(response.dueDate);
          setDescription(response.description);
          setSelectedStatus(response.status);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await updateProject(id, {
        title,
        teamId,
        status,
        startDate,
        dueDate,
        description,
      });
      router.push("/admin/projects-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDelete = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await deleteProject(id)
      router.push("/admin/projects-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/projects-management");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Project">
          <Label>Title</Label>
          <Input
            type="text"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label>Select Team</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select a team"
              value={teamId}
              onChange={(value) => setTeamId(value)}
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
            defaultDate={startDate}
            onChange={(dates, currentDateString) => setStartDate(currentDateString)}
          />

          <DatePicker
            id="due-date"
            label="Due Date"
            placeholder="Select a date"
            defaultDate={dueDate}
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

      <ComponentCard title="Options">
        <div className="flex items-center gap-4 flex-col items-start md:flex-row">
          <Checkbox
            checked={status === Status.NOT_STARTED}
            onChange={() => setSelectedStatus(Status.NOT_STARTED)}
            label="Not started"
          />
          <Checkbox
            checked={status === Status.IN_PROGRESS}
            onChange={() => setSelectedStatus(Status.IN_PROGRESS)}
            label="In progress"
          />
          <Checkbox
            checked={status === Status.COMPLETED}
            onChange={() => setSelectedStatus(Status.COMPLETED)}
            label="Completed"
          />
          <Checkbox
            checked={status === Status.CANCELED}
            onChange={() => setSelectedStatus(Status.CANCELED)}
            label="Canceled"
          />
        </div>
      </ComponentCard>
      <div className="flex gap-6 justify-center sm:justify-start">
        <Button
          type="submit"
          size="sm"
          variant="primary"
        >
          Update
        </Button>

        <Button
          onClick={handleDelete}
          size="sm"
          variant="error"
        >
          Delete
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