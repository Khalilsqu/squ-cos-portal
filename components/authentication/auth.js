import { Avatar, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GoSignOut } from "react-icons/go";
import { AiOutlineUser } from "react-icons/ai";
import { useRef } from "react";

import CustomTooltip from "../tooltip/customtooltip";
import LogOutModal from "./logOutModal";

export default function Authentication(props) {
  const { data: session, status } = useSession();
  const childRef = useRef();
  const router = useRouter();

  const { themeColor, handleShowAdminPanel } = props;

  const logOutNotification = () => {
    childRef.current.countDown();
  };

  const items = [
    {
      label: status === "authenticated" && session.user.name,
      key: "0",
      icon: <AiOutlineUser />,
      onClick: () => logOutNotification(),
    },
    {
      label: "Sign Out",
      key: "1",
      icon: <GoSignOut />,
      onClick: () => {
        signOut();
        handleShowAdminPanel(false);
      },
    },
  ];

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div>
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
          />
        </Dropdown>
      ) : router.pathname !== "/auth/signin" ? (
        <CustomTooltip title="Click to sign-in">
          <Avatar
            size={50}
            onClick={handleSignIn}
            className="cursor-pointer"
            icon={
              <AiOutlineUser
                className={
                  "text-center text-5xl " +
                  (themeColor === "dark" ? "text-white" : "text-stone-900")
                }
              />
            }
          />
        </CustomTooltip>
      ) : null}
      <LogOutModal ref={childRef} />
    </div>
  );
}
