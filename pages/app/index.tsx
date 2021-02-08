import { GetServerSidePropsResult } from "next";

export function getServerSideProps(): GetServerSidePropsResult<unknown> {
  return {
    redirect: {
      permanent: false,
      destination: "/app/projects",
    },
  };
}

export default function AppPage() {
  return null;
}
