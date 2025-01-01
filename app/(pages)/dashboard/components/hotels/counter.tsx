import { MinusSVG, PlusSVG } from "@/app/assets/icons";
import { cn } from "@/app/lib/helper";
import { Button } from "antd";

export const Counter: React.FC<{
  className?: string;
  count: number;
  iconHeight?: number;
  iconWidth?: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}> = ({ count, setCount, className, iconHeight = 20, iconWidth = 20 }) => {
  const handleDecrement = () => {
    setCount((prev) => Math.max(1, Number(prev - 1)));
  };
  const handleIncrement = () => {
    setCount((prev) => Number(prev + 1));
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between gap-4 w-[200px] h-[40px] rounded-xl bg-[#F9F9F9] border border-[#C0C0C0] px-3",
          className
        )}
      >
        <span className="text-sm min-w-[1ch] text-center">{count}</span>
        <div className="flex items-center">
          <Button
            type="text"
            icon={<MinusSVG width={iconWidth} height={iconHeight} />}
            onClick={handleDecrement}
            disabled={count <= 1}
          />
          <Button
            type="text"
            icon={<PlusSVG width={iconWidth} height={iconHeight} />}
            onClick={handleIncrement}
            disabled={count >= 10}
          />
        </div>
      </div>
    </>
  );
};
