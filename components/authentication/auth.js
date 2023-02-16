import { Avatar, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GoSignOut } from "react-icons/go";
import { AiOutlineUser } from "react-icons/ai";
import Image from "next/image";

import CustomTooltip from "../tooltip/customtooltip";

export default function Authentication() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const items = [
    {
      label: "Sign Out",
      key: "1",
      icon: <GoSignOut />,
      onClick: () => signOut(),
    },
  ];

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <>
      {status === "authenticated" ? (
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <Avatar
            size={50}
            src={session.user.image}
            alt={session.user.name}
            style={{ cursor: "pointer" }}
            title={session.user.name}
          />
        </Dropdown>
      ) : router.pathname !== "/auth/signin" ? (
        <CustomTooltip title="Click to sign-in">
          <Avatar
            size={50}
            icon={<AiOutlineUser />}
            style={{ cursor: "pointer" }}
            onClick={handleSignIn}
          />
        </CustomTooltip>
      ) : null}
    </>
  );
}
