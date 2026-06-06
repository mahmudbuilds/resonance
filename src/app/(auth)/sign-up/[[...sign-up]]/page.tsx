import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          logoBox: "flex items-center justify-center mb-6",
          logoImage: {
            width: "96px",
            height: "96px",
            objectFit: "contain",
          },
        },
      }}
    />
  );
}