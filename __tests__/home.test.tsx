import { render, screen } from "testing";
import Home from "pages/index";
import { server } from "mocks/server";
import { rest } from "msw";
import { buildAddress, buildContractDetailsList } from "testing/factory";
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";

jest.mock("wagmi");

const useBalanceMock = useBalance as jest.Mock<any>;

useBalanceMock.mockReturnValue({
  data: undefined,
  isLoading: false,
  isError: false,
});

const usePrepareSendTransactionMock =
  usePrepareSendTransaction as jest.Mock<any>;

usePrepareSendTransactionMock.mockReturnValue({
  config: {},
});

const useSendTransactionMock = useSendTransaction as jest.Mock<any>;

useSendTransactionMock.mockReturnValue({
  sendTransaction: jest.fn(),
});

const useAccountMock = useAccount as jest.Mock<any>;

useAccountMock.mockReturnValue({
  address: buildAddress(),
});

describe("Home", () => {
  it("should render without crashing", () => {
    render(<Home />);
  });

  it("should have a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Blacksmith",
    });

    expect(heading).toBeInTheDocument();
  });

  it("should open and close the wallet", async () => {
    const { user } = render(<Home />);

    const openWalletButton = screen.getByRole("button", {
      name: "open wallet",
    });

    expect(openWalletButton).toBeInTheDocument();

    await user.click(openWalletButton);

    expect(
      screen.getByRole("heading", { level: 2, name: "Transfer" })
    ).toBeInTheDocument();

    const closeWalletButton = screen.getByRole("button", {
      name: "close wallet",
    });

    expect(closeWalletButton).toBeInTheDocument();

    await user.click(closeWalletButton);

    expect(
      screen.queryByRole("heading", { level: 2, name: "Transfer" })
    ).not.toBeInTheDocument();
  });

  it("should render the selected contract when clicked", async () => {
    const contracts = buildContractDetailsList(2);
    server.use(
      rest.get("/api/contracts", (_req, res, ctx) => {
        return res(ctx.json(contracts));
      })
    );

    const { user } = render(<Home />);

    const contractButton = await screen.findByRole("button", {
      name: contracts[0].name,
    });

    user.click(contractButton);

    expect(
      await screen.findByRole("heading", { level: 3, name: contracts[0].name })
    ).toBeInTheDocument();
  });
});
