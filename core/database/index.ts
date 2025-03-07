import { Low, JSONFile } from "lowdb";
import type { Address, ContractDetails } from "core/types";

type Data = {
  contracts: {
    [key: Address]: ContractDetails;
  };
};

const file = ".database.json";
const adapter = new JSONFile<Data>(file);
const db = new Low(adapter);

export { db };
