import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

const AIRDROP_AMOUNT = "0.0001";

export enum SUPPORTED_NETWORKS {
  CELO = "celo",
  ALFAJORES = "alfajores",
}

const form = new formidable.IncomingForm({
  maxFields: 2,
  allowEmptyFiles: false,
});

export class DustHandler {
  private provider: CeloProvider;
  private wallet: any;
  private scanApi: string;

  constructor(network: SUPPORTED_NETWORKS) {
    if (network == SUPPORTED_NETWORKS.CELO) {
      this.provider = new CeloProvider(
        "https://celo-hackathon.lavanet.xyz/celo/http"
      );
      this.scanApi = "https://api.celoscan.io/api";
    } else if (network == SUPPORTED_NETWORKS.ALFAJORES) {
      this.provider = new CeloProvider(
        "https://celo-hackathon.lavanet.xyz/celo-alfajores/http"
      );
      this.scanApi = "https://api-alfajores.celoscan.io/api";
    } else {
      throw new Error("invalid network");
    }

    this.wallet = new CeloWallet(process.env.PK!, this.provider);
  }

  async sendAirdrop(address: string) {
    await this.provider.ready;

    const txResponse = await this.wallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther(AIRDROP_AMOUNT),
    });
  }

  async handler(req: NextApiRequest, res: NextApiResponse) {
    form.parse(req, async function (err, { address, token }, files) {
      console.log(token, "req.body.token");

      const human = await this.validateHuman(token);
      console.log(human, "human");
      if (!human) {
        return res
          .status(400)
          .json({ error: "Please, you are not fooling us, bot." });
      }

      const response = await fetch(
        `${this.scanApi}?module=account&action=balance&address=${address}`
      );

      const balanceRes = (await response.json()) as {
        status: string;
        message: string;
        result: string;
      };

      if (balanceRes.result === "0") {
        await this.sendAirdrop(address);

        res.status(200).json({ success: true });
      } else {
        res.status(403).json({ success: false });
      }
    });
  }

  async validateHuman(token: string) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    return data.success;
  }
}
