"use client";
import React, { useState } from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import Select from '../Select';
import { ChevronDownIcon } from '../../../icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '../input/TextArea';

export default function DefaultInputs() {
  const [description, setDescription] = useState("");
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">

        <ComponentCard title="Project">
          <Label>Title</Label>
          <Input type="text" />

          <Label>Select Leader</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Select a leader"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </ComponentCard>

        <ComponentCard title="Timeline">

          <DatePicker
            id="date-picker"
            label="Start Date"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />

          <DatePicker
            id="date-picker"
            label="Due Date"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
            }}
          />
        </ComponentCard>
      </div>

      <ComponentCard title="Description">
        <div>
          <TextArea
            value={description}
            onChange={(value) => setDescription(value)}
            rows={6}
          />
        </div>
      </ComponentCard>

    </div>
  );
}
