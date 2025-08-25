"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../ui/Label';
import Select from '../../ui/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import { useParams, useRouter } from 'next/navigation';
import { deleteUser, getUser, updateUser } from '@/services/user';

export default function EditUser() {
  const [role, setRole] = useState("");
  const [teamId, setTeamId] = useState("");

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        const response = await getUser(id);
        if (response) {
          setRole(response.role);
          setTeamId(response.teamId)
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchTeamDetail();
  }, [id]);

  useEffect(() => {
    const roles = [
      { value: "MANAGER", label: "Manager" },
      { value: "LEADER", label: "Leader" },
      { value: "STAFF", label: "Staff" },
    ];
    setOptions(roles);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      await updateUser(id, {
        role,
        teamId
      });
      router.push("/admin/staffs-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDelete = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await deleteUser(id)
      router.push("/admin/staffs-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/staffs-management");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <ComponentCard title="Authentication">
          <Label>Select Role</Label>
          <div className="relative">
            <Select
              options={options}
              value={role}
              placeholder="Select a user role"
              onChange={(value) => setRole(value)}
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