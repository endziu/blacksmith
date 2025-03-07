import { ComponentProps } from "react";
import { render, screen } from "testing";
import { buildAddress } from "testing/factory";
import { useBalance } from "wagmi";
import Balance from ".";

jest.mock("wagmi");

const useBalanceMock = useBalance as jest.Mock<any>;

useBalanceMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
});

const renderBalance = (props: Partial<ComponentProps<typeof Balance>> = {}) => {
  return render(<Balance address={props.address || buildAddress()} />);
};

describe("Balance", () => {
  it("should render loading", () => {
    useBalanceMock.mockReturnValue({
      isLoading: true,
    });

    renderBalance();

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("should render error", () => {
    useBalanceMock.mockReturnValue({
      isError: true,
    });

    renderBalance();

    expect(screen.getByText("Error retrieving balance")).toBeInTheDocument();
  });

  it("should render the formatted balance and symbol", () => {
    useBalanceMock.mockReturnValue({
      data: {
        formatted: "1.0",
        symbol: "ETH",
      },
    });

    renderBalance();

    expect(screen.getByText("1.0 ETH")).toBeInTheDocument();
  });
});
