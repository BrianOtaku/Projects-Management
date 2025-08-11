"use client";
import React, { useState, useEffect } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '../input/TextArea';
import { createProject } from '@/services/projects';
import { getTeams } from '@/services/teams';
import Checkbox from '../input/Checkbox';

export default function NewProject() {
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [isNotStarted, setNotStarted] = useState(false);
  const [isInProgress, setInProgress] = useState(false);
  const [isCompleted, setCompleted] = useState(false);
  const [isCanceled, setCanceled] = useState(false);

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await getTeams();
        const teamOptions = teams.map((team: { id: unknown; teamName: unknown; }) => ({
          value: team.id,
          label: team.teamName,
        }));
        setOptions(teamOptions);
        console.log("Fetched teams:", teamOptions);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await createProject({
        title,
        team,
        status: "NOT_STARTED", // Assuming a default status
        startDate,
        dueDate,
        description,
      });
      // Reset form after successful submission
      setTitle("");
      setTeam("");
      setStartDate("");
      setDueDate("");
      setDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Project">
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label>Select Team</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select a team"
              onChange={(value) => setTeam(value)}
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

      <ComponentCard title="Options">
        <div className="flex items-center gap-4 flex-col items-start md:flex-row">
          <Checkbox checked={isNotStarted} onChange={setNotStarted} label="Not started" />
          <Checkbox checked={isInProgress} onChange={setInProgress} label="In progress" />
          <Checkbox checked={isCompleted} onChange={setCompleted} label="Completed" />
          <Checkbox checked={isCanceled} onChange={setCanceled} label="Canceled" />
        </div>
      </ComponentCard>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Project
      </button>
    </div>
  );
}