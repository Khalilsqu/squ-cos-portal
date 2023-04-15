import { Menu } from "antd";
import { useRouter } from "next/router";
import { RiAdminLine, RiContactsBookLine } from "react-icons/ri";
import { BsNewspaper } from "react-icons/bs";
import { getItem } from "./index";
import { CiViewList } from "react-icons/ci";

export function AdminMenu() {
  const router = useRouter();

  const items = [
    getItem("Dashboard", "dashboard", <CiViewList />, null),
    getItem("Admin Users", "admins", <RiAdminLine />, null),
    getItem("News", "news", <BsNewspaper />, null),
    getItem("Staff Directory", "staff-directory", <RiContactsBookLine />, null),
  ];

  const handleClick = (e) => {
    router.push("/" + "admin-dashboard/" + e.key);
  };

  return <Menu mode="inline" items={items} onClick={handleClick} />;
}
