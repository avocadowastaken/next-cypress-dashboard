import { ReactElement } from "react";
import useSWR from "swr";
import { ResourceField, ResourceFieldProps } from "../common/ResourceField";

const FIVE_MINUTES = 5 * 60 * 1000;

export interface UserFieldProps
  extends Pick<ResourceFieldProps<string>, "name" | "label" | "helperText"> {}

export function UserField(props: UserFieldProps): ReactElement {
  const useOptions = (searchQuery: string | undefined) => {
    const { data } = useSWR<string[]>(
      !searchQuery ? null : `/api/search/users?q=${searchQuery}`,
      { dedupingInterval: FIVE_MINUTES }
    );

    return data;
  };

  return <ResourceField {...props} useOptions={useOptions} />;
}
