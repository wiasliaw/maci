import { logError, logGreen, success } from "../utils/theme";
import { banner } from "../utils/banner";
import { getDefaultSigner } from "maci-contracts";

/**
 * Utility to travel in time when using a local blockchain
 * @param seconds - the number of seconds to travel in time
 * @param quiet - whether to log the output
 */
export const timeTravel = async (seconds: number, quiet = true) => {
  banner(quiet);
  const signer = await getDefaultSigner();
  try {
    // send the instructions to the provider
    await signer.provider.send("evm_increaseTime", [Number(seconds)]);
    await signer.provider.send("evm_mine", []);

    logGreen(quiet, success(`Fast-forwarded ${seconds} seconds`));
  } catch (error: any) {
    logError(error.message);
  }
};