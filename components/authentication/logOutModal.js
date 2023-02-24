import { Modal, Typography, Button, Space } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { useSession } from "next-auth/react";

const LogOutModal = (props, ref) => {
  const [modal, contextHolder] = Modal.useModal();
  const { data: session, status } = useSession();

  const userName = status === "authenticated" && session.user.name;

  useImperativeHandle(ref, () => ({
    countDown() {
      let secondsToGo = 15;
      const instance = modal.warning({
        title: "Log Out",
        content:
          "Hello " +
          userName +
          ", If you are using a shared or a public computer, please log out after you finish using the application.",
        footer: [
          <Space
            key="space1"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography.Text key="countdown">
              Closing in {secondsToGo} seconds
            </Typography.Text>
            <Button key="cancel" onClick={() => instance.destroy()}>
              OK
            </Button>
          </Space>,
        ],
      });
      const timer = setInterval(() => {
        secondsToGo -= 1;
        instance.update({
          footer: [
            <Space
              key="space2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography.Text key="countdown">
                Closing after {secondsToGo} seconds
              </Typography.Text>
              <Button key="cancel" onClick={() => instance.destroy()}>
                OK
              </Button>
            </Space>,
          ],
        });
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        instance.destroy();
      }, secondsToGo * 1000);
    },
  }));
  return <>{contextHolder}</>;
};
export default forwardRef(LogOutModal);
