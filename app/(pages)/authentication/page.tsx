'use client';

import { AppleIcon, GoogleIcon } from "@/app/assets/icons";
import { Button, Divider, Form, Input, Typography } from "antd"
import { parseAsString, useQueryState } from "nuqs";

enum AUTH_TABS {
  SIGNUP = 'signup',
  LOGIN = 'login'
}

const Login = () => {
  return (<></>)  
}

const Signup = () => {
  const [form] = Form.useForm();

  return (
    <>
    <div>
      <Typography.Text className="text-[32px] font-extrabold">Sign up</Typography.Text>

      <div>
        <Form form={form} layout="vertical">
          <Form.Item name='inviteCode' label={<Typography.Text className="font-medium text-lg leading-6">Invite Code</Typography.Text>}>
            <Input value='HBL50' variant="filled" size="large" />
          </Form.Item>
          <Form.Item name='emailAddress' label={<Typography.Text className="font-medium text-lg leading-6">Enter your email address</Typography.Text>}>
            <Input placeholder="Enter your email address" variant="filled" size="large" />
          </Form.Item>
          <Form.Item name='phoneNumber' label={<Typography.Text className="font-medium text-lg leading-6">Phone Number</Typography.Text>}>
            <Input placeholder="Phone Number" variant="filled" size="large" />
          </Form.Item>
          <Form.Item name='password' label={<Typography.Text className="font-medium text-lg leading-6">Password</Typography.Text>}>
            <Input.Password placeholder="Password" variant="filled" size="large" />
          </Form.Item>
          <Button size='large' type='primary' variant="filled" className="w-full">Signup</Button>
        </Form>

        <Divider />

        <div className="flex items-center gap-x-1">
          <Button size='large' className="rounded-full" icon={<GoogleIcon/>}>Sign in with Google</Button>
          <Button size='large' className="rounded-full" icon={<AppleIcon/>}>Sign in with Apple</Button>
        </div>
      </div>
    </div>
    </>
  )
}

const authItems = [
  {
    key: AUTH_TABS.SIGNUP,
    label: 'New Jetzy Member',
    children: <Signup />,
  },
  {
    key: AUTH_TABS.LOGIN,
    label: 'Existing Jetzy Member',
    children: <Login />,
  },
]


export default function Authentication() {
  const [selectedTab, setSelectedTab] = useQueryState('tab', parseAsString.withDefault(AUTH_TABS.LOGIN));

  console.log({selectedTab})

   return (
    <>
    <div className="flex items-center gap-x-5 border border-muted w-max rounded-full p-2">
      {authItems.map((item) => (
        <div
          key={item.key} 
          onClick={() => setSelectedTab(item.key)}
          className={`p-2 !cursor-pointer ${selectedTab === item.key ? 'bg-secondary border border-primary rounded-full' : ''}`}
        >
          <Typography.Text className={`font-medium ${selectedTab === item.key ? 'text-primary' : 'text-muted'}`}>{item.label}</Typography.Text>
        </div>
      ))}
    </div>

    <div className="max-w-sm">
      {authItems.find(item => item.key === selectedTab)?.children}
    </div>
    </>
  )
}
