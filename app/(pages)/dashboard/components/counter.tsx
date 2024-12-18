import { MinusSVG, PlusSVG } from "@/app/assets/icons";
import { Button } from "antd";

export const Counter: React.FC<{
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}> = ({ count, setCount }) => {
  const handleDecrement = () => {
    setCount((prev) => Math.max(1, Number(prev - 1)));
  };
  const handleIncrement = () => {
    setCount((prev) => Number(prev + 1));
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 w-[131px] h-[40px] rounded-xl bg-[#F9F9F9] border border-[#C0C0C0] px-3">
        <span className="text-sm min-w-[1ch] text-center">{count}</span>
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<MinusSVG width={20} height={20} />}
            onClick={handleDecrement}
            disabled={count <= 1}
          />
          <Button
            type="text"
            icon={<PlusSVG width={20} height={20} />}
            onClick={handleIncrement}
            disabled={count >= 10}
          />
        </div>
      </div>
    </>
  );
};
