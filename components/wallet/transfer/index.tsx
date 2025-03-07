import Button from "components/button";
import Field from "components/field";
import Unit from "components/unit";
import { useEther } from "hooks";
import { useState } from "react";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

const Transfer = () => {
  const [recipient, setRecipient] = useState("");
  const { value, formattedValue, handleValueChange, unit, units, setUnit } =
    useEther();

  const { config } = usePrepareSendTransaction({
    request: { to: recipient, value: formattedValue, gasLimit: 10000000 },
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipient(event.target.value);
  };

  const handleSendClick = () => {
    sendTransaction?.();
  };

  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-bold">Transfer</h2>
      <section className="flex flex-col gap-2">
        <Field
          inputName="recipient"
          type="address"
          id="recipient"
          value={recipient}
          handleChange={handleRecipientChange}
        />
        <div className="flex gap-1 z-10">
          <Field
            id="value"
            inputName="value"
            value={value}
            type="uint256"
            handleChange={handleValueChange}
          />
          <Unit units={units} unit={unit} setUnit={setUnit} />
        </div>
        <Button disabled={!sendTransaction} onClick={handleSendClick}>
          send
        </Button>
      </section>
    </div>
  );
};

export default Transfer;
