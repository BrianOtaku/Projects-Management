"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import { deleteTeam, getTeam, updateTeam } from '@/services/team';
import { getUsers } from '@/services/user';
import { useParams, useRouter } from 'next/navigation';

export default function EditTeam() {
  const [teamName, setTeamName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const { id } = useParams<{ id: string }>();

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

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        const response = await getTeam(id);
        if (response) {
          setTeamName(response.teamName);
          setLeaderId(response.leaderId);
          console.log(response)
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchTeamDetail();
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await updateTeam(id, {
        teamName,
        leaderId,
      });
      router.push("/admin/teams-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDelete = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await deleteTeam(id)
      router.push("/admin/teams-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/teams-management");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Team">
          <Label>Team Name</Label>
          <Input
            type="text"
            defaultValue={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </ComponentCard>
        <ComponentCard title="Leader">
          <Label>Select Leader</Label>
          <div className="relative">
            <Select
              options={options}
              value={leaderId}
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