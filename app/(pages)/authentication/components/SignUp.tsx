import { AppleIcon, GoogleIcon } from "@/app/assets/icons";
import { countries } from "@/app/lib/countries";
import { Button, Divider, Input, Select, Typography, Form } from "antd";

const Signup = () => {
  const [form] = Form.useForm();

  const defaultValue = countries.find((entry) => entry.cca2 === 'US')?.cca2 || 'US';

  const onSelectPhoneNumberCode = (
    <Select
      showSearch
      defaultValue={defaultValue}
      className="w-24"
      labelInValue={false}
      optionLabelProp="label"
      popupMatchSelectWidth={192}
      filterOption={(input, option) => {
        const countryData = countries.find(entry => entry.cca2 === option?.value);
        return (
          countryData?.name.toLowerCase().includes(input.toLowerCase()) || 
          countryData?.cca2.toLowerCase().includes(input.toLowerCase())
        ) ?? false;
      }}
    >
      {countries.map((country) => (
        <Select.Option 
          key={country.cca2} 
          value={country.cca2}
          label={`${country.flag} +${country.code}`}
        >
          {country.flag}&nbsp;&nbsp;(+{country.code})&nbsp;{country.name}
        </Select.Option>
      ))}
    </Select>
  )

  return (
    <>
      <div className="space-y-5">
        <Typography.Text className="text-[32px] font-extrabold">
          Sign up
        </Typography.Text>

        <div>
          <Form form={form} layout="vertical" initialValues={{inviteCode: 'HBL50'}}>
            <Form.Item
              name="inviteCode"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                  Invite Code
                </Typography.Text>
              }
            >
              <Input value="HBL50" variant="filled" size="large" disabled />
            </Form.Item>
            <Form.Item
              name="emailAddress"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                  Enter your email address
                </Typography.Text>
              }
            >
              <Input
                placeholder="Enter your email address"
                variant="filled"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                  Phone Number
                </Typography.Text>
              }
            >
              <Input
                size="large"
                variant="filled" 
                placeholder="Enter your Phone Number" 
                addonBefore={onSelectPhoneNumberCode}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                  Password
                </Typography.Text>
              }
            >
              <Input.Password
                placeholder="Password"
                variant="filled"
                size="large"
              />
            </Form.Item>
            <Button
              size="large"
              type="primary"
              variant="filled"
              className="w-full"
            >
              Signup
            </Button>
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

export default Signup