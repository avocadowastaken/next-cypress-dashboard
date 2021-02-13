import { ResourceField, ResourceFieldProps } from "@/app/common/ResourceField";
import { ReactElement } from "react";
import useSWR from "swr";

const FIVE_MINUTES = 5 * 60 * 1000;

export interface RepoFieldProps
  extends Omit<ResourceFieldProps<string>, "useOptions"> {
  owner: string;
}

export function RepoField({
  owner,
  disabled,
  ...props
}: RepoFieldProps): ReactElement {
  const useOptions = (searchQuery: string | undefined) => {
    const { data } = useSWR<string[]>(
      !owner || !searchQuery
        ? null
        : `/api/search/repos?owner=${owner}&q=${searchQuery}`,
      { dedupingInterval: FIVE_MINUTES }
    );

    return data;
  };

  return (
    <ResourceField
      {...props}
      useOptions={useOptions}
      disabled={!owner || disabled}
    />
  );
}
