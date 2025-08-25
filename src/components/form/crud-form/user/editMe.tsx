"use client";

import React, { useState, useEffect } from 'react';
import ComponentCard from '../../../common/ComponentCard';
import Label from '../../ui/Label';
import Button from '@/components/ui/button/Button';
import { useParams, useRouter } from 'next/navigation';
import { deleteMe, getMe, updateMe } from '@/services/user';
import Input from '../../ui/input/InputField';

export default function EditMe() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        const response = await getMe();
        if (response) {
          setName(response.name);
          setEmail(response.email);
          setAvatar(response.avatar);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchTeamDetail();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      await updateMe(id, {
        name,
        email
      });
      router.push("/admin");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDelete = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await deleteMe(id)
      router.push("/signin");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin");
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