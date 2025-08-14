"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import { createTeam } from '@/services/teams';
import { getUsers } from '@/services/users';
import { useRouter } from 'next/navigation';

export default function NewTeam() {
  const [teamName, setTeamName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchLeader = async () => {
      try {
        const users = await getUsers();
        const leaders = users.filter((user: { role: string }) => user.role === "LEADER");

        const leaderOptions = leaders.map((leader: { id: unknown; name: unknown }) => ({
          value: leader.id,
          label: leader.name,
        }));

        setOptions(leaderOptions);
      } catch (error) {
        console.error('Error fetching leaders:', error);
      }
    };

    fetchLeader();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await createTeam({
        teamName,
        leaderId,
      });
      router.push("/teams-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/teams-management");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Team">
          <Label>Team Name</Label>
          <Input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </ComponentCard>
        <ComponentCard title="Leader">
          <Label>Select Leader</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select a leader"
              onChange={(value) => setLeaderId(value)}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </ComponentCard>
      </div>

      <div className="flex gap-6 justify-center sm:justify-start">
        <Button
          type="submit"
          size="sm"
          variant="success"
        >
          Create Project
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