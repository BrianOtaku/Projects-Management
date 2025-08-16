"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../Label';
import Input from '../../input/InputField';
import Select from '../../Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '../../../../icons';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/users';

export default function NewUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const router = useRouter();

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

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await createUser({
        name,
        email,
        password,
        role
      });
      router.push("/users-management");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/users-management");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <ComponentCard title="User Details">
          <Label>User Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label>User Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label>Avatar</Label>
          <Input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </ComponentCard>

        <ComponentCard title="Authentication">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword !== "" && confirmPassword !== password}
            hint={confirmPassword !== "" && confirmPassword !== password ? "Passwords do not match" : ""}
          />
          <Label>Select Role</Label>
          <div className="relative">
            <Select
              options={options}
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
          variant="success"
        >
          Create User
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