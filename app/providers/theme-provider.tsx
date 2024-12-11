import { ConfigProvider, ThemeConfig } from "antd";

export const ThemeProvider = ({
    theme, 
    children 
  }: {
    theme: ThemeConfig; 
    children: React.ReactNode
  }) => {
  return (
    <>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </>
  );
};
