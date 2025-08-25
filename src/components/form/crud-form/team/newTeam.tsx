"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../ui/Label';
import Input from '../../ui/input/InputField';
import Select from '../../ui/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import { createTeam } from '@/services/team';
import { getUsers } from '@/services/user';
import { useRouter } from 'next/navigation';
import Checkbox from '../../ui/input/Checkbox';
import { User } from '@/constants/interfaces';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function NewTeam() {
  const [teamName, setTeamName] = useState("");
  const [leaderId, setLeaderId] = useState("");

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const router = useRouter();

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };


  useEffect(() => {
    const fetchLeader = async () => {
      try {
        const users = await getUsers();
        const leaders = users.filter((user: { role: string }) => user.role === "LEADER");
        const filteredUsers = users.filter((user: User) => user.role === "STAFF" && user.team === null);

        const leaderOptions = leaders.map((leader: { id: unknown; name: unknown }) => ({
          value: leader.id,
          label: leader.name,
        }));

        setOptions(leaderOptions);
        setUsers(filteredUsers);
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
        members: selectedMembers,
      });
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

      <ComponentCard title="Select Members">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => {
                const userId = user.id.toString();
                return (
                  <TableRow key={userId}>
                    <TableCell className="flex flex-row justify-between px-5 py-4 sm:px-6 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                          {/* <Image
                            width={80}
                            height={80}
                            src={user.avatar || "/images/user/default.jpg"}
                            alt={user.name}
                          /> */}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMembers.includes(userId)}
                        onChange={() => toggleMember(userId)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ComponentCard>

      <div className="flex gap-6 justify-center sm:justify-start">
        <Button
          type="submit"
          size="sm"
          variant="success"
        >
          Create Team
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