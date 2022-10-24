import { NextApiRequest, NextApiResponse } from "next";
import { DustHandler, SUPPORTED_NETWORKS } from "./utils/DustHandler";

const dustHandler = new DustHandler(SUPPORTED_NETWORKS.CELO);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return dustHandler.handler(req, res);
}
