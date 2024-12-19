import Link from "next/link";
import { AppleIcon } from "@/app/assets/icons";
import { GoogleIcon } from "@/app/assets/icons";
import { Button, Divider, Form, Input, Typography } from "antd";

const Login = () => {
  const [form] = Form.useForm();

  return (
    <>
      <div className="space-y-5">
        <Typography.Text className="text-[32px] font-extrabold">
          Sign in
        </Typography.Text>

        <div className="">
          <Form form={form} layout="vertical">
            <Form.Item
              name="emailAddress"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                Enter your email address
                </Typography.Text>
              }
            >
              <Input value="HBL50" variant="filled" size="large" placeholder="Enter your email address" />
            </Form.Item>
            <Form.Item
              name="password"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                Password
                </Typography.Text>
              }
            >
              <Input.Password variant="filled" size="large" placeholder="Enter your account password" />
            </Form.Item>

            <Form.Item className="text-end">
              <Link href='/' className="text-primary hover:underline hover:text-primary">Forgot Password?</Link>
            </Form.Item>

            <Form.Item>
              <Button size='large' variant="filled" type='primary' className="w-full">Sign in</Button>
            </Form.Item>
          </Form>

          <Divider />
          
          <div className="flex items-center gap-x-2">
            <Button size="large" className="rounded-full font-medium px-6 py-6" icon={<GoogleIcon />}>
              Sign in with Google
            </Button>
            <Button size="large" className="rounded-full font-medium px-6 py-6" icon={<AppleIcon />}>
              Sign in with Apple
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
