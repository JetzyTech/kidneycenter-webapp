import { Button, Typography } from "antd";
import { CheckmarkSVG, ChevronRightSVG } from "@/app/assets/icons";
import { cn } from "@/app/lib/helper";

export const RoomDetail = ({
  selectedDeal,
  setSelectedDeal,
  room,
  footer = true,
}: {
  selectedDeal?: string;
  setSelectedDeal?: (dealId: string) => void;
  room: Room;
  footer?: boolean;
}) => {
  return (
    <>
      <div
        className={cn(
          "relative border rounded-xl w-[444px] h-max p-3 cursor-pointer",
          selectedDeal === room.id
            ? "bg-secondary border-primary"
            : "bg-white border-[#C0C0C0]"
        )}
        onClick={() => setSelectedDeal?.(room.id)}
      >
        {selectedDeal === room.id && (
          <div className="absolute top-3 right-3">
            <CheckmarkSVG />
          </div>
        )}
        <div className="flex flex-col gap-y-3">
          <Typography.Text className="font-medium text-xl">
            {room?.title}
          </Typography.Text>
          <Typography.Text className="text-[#5A5A5A]">
            {room?.description}
          </Typography.Text>

          <Typography.Text className="font-semibold">
            <span className="text-muted line-through">$200</span>
            &nbsp;{room?.rate_data?.price_details?.display_symbol}
            {
              room?.rate_data?.price_details?.night_price_data[0]
                ?.display_night_price
            }
            /night
          </Typography.Text>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm">
              1 Room x 1 Night
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm">
              ${room?.rate_data?.price_details?.source_sub_total}
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm">
              Taxes and fees
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm">
              {room?.rate_data?.price_details?.display_symbol}{" "}
              {room?.rate_data?.price_details?.source_taxes}
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm font-bold">
              Total
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm font-bold">
              {room?.rate_data?.price_details?.display_symbol}{" "}
              {room?.rate_data?.price_details?.display_all_in_total}
            </Typography.Text>
          </div>
        </div>
        {footer && (
          <div className="flex justify-end mt-5 gap-x-3">
            <Button
              type="text"
              variant="text"
              className="text-primary underline font-semibold p-0"
              iconPosition="end"
              icon={<ChevronRightSVG />}
            >
              Policy Details
            </Button>
            <Button
              type="text"
              variant="text"
              className="text-primary underline font-semibold p-0"
              iconPosition="end"
              icon={<ChevronRightSVG />}
            >
              Room Details
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
