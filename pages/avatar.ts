import { createServerSideProps } from "@/app/data/ServerSideProps";
import { createHash } from "crypto";

function normalizeEmail(input: unknown): null | string {
  if (typeof input == "string") {
    const email = input.trim().toLocaleLowerCase();

    if (email) {
      return email;
    }
  }

  return null;
}

export const getServerSideProps = createServerSideProps((_, { query }) => {
  const email = normalizeEmail(query.email);

  if (!email) {
    return { notFound: true };
  }

  const hash = createHash("md5").update(email.trim()).digest("hex");

  return {
    redirect: {
      permanent: true,
      destination: `https://www.gravatar.com/avatar/${hash}?s=256`,
    },
  };
});

export default function AvatarRenderer() {
  return null;
}
