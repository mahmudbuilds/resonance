import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          logoBox: "flex items-center justify-center mb-3",
          logoImage: "size-9 object-contain dark:invert-0 invert",
        },
      }}
    />
  );
}
