import Image from "next/image";
import { IHotel } from "../../types/dashboard.types";
import { Rate, Tooltip, Typography } from "antd";
import { convertCurrencySign, CURRENCY_SIGNS } from "@/app/lib/helper";

export const HotelCard = ({ entry }: { entry: IHotel }) => {
  return (
    <>
      <div className="flex border rounded-2xl p-2">
        <div className="relative">
          <Image
            src={entry.thumbnail}
            alt={entry.name}
            width={147}
            height={121}
            className="w-[147px] h-[121px] object-cover rounded-xl"
          />
          <div className="bg-primary absolute top-0 left-0 w-max rounded-tl-xl rounded-br-xl px-2">
            <Typography.Text className="text-base font-bold text-white">
              {entry.price_saving_percentage}%
            </Typography.Text>
          </div>
        </div>
        <div className="flex flex-col ml-4 w-full">
          <div className="flex justify-between">
            <Tooltip title={entry.name}>
              <Typography.Text className="text-2xl font-bold w-60 truncate">
                {entry.name}
              </Typography.Text>
            </Tooltip>
            <div className="space-x-2">
              <Typography.Text className="text-muted text-lg font-normal line-through	">
                {convertCurrencySign(entry.display_currency as CURRENCY_SIGNS)}
                {entry.price_non_saving}
              </Typography.Text>
              <Typography.Text className="text-primary text-lg font-bold">
                {convertCurrencySign(entry.display_currency as CURRENCY_SIGNS)}
                {entry.price_saving}
              </Typography.Text>
            </div>
          </div>
          <div className="flex gap-x-1 pt-2 pb-3">
            <Rate
              disabled
              // allowHalf
              defaultValue={entry.star_rating}
              className="text-black"
            />
          </div>
          {/* <Typography.Text className="text-sm text-muted">
                {entry.description}
              </Typography.Text> */}
        </div>
      </div>
    </>
  );
};
