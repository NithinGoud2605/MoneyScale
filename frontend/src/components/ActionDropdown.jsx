import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const ActionDropdown = ({ onEdit, onDelete }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
          ⋮
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-1 min-w-[120px]">
          <DropdownMenu.Item
            onSelect={onEdit}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={onDelete}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ActionDropdown;
