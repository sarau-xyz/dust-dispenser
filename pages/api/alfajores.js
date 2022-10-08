import { CeloProvider, CeloWallet } from '@celo-tools/celo-ethers-wrapper'
const ethers = require('ethers')

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function addressAirdrop(celoAddress) {
    const addressAirdropFilter =  celoAddress.result.filter(item => ethers.utils.formatEther(item.balance) < 0.0001 )
    const addressAirdropSend = addressAirdropFilter.map(item => item.account)
    return addressAirdropSend
}


async function airdropSend(addressAirdropSend) {
    const privateKey = process.env.PK
    const amount = "0.0001"
    const provider = new CeloProvider("https://alfajores-forno.celo-testnet.org")
    await provider.ready
    const wallet = new CeloWallet(privateKey, provider)

    let sends = [];
    const address = addressAirdropSend

    for (let i = 0; i < address.length; i++ ){
        
        const txResponse = await wallet.sendTransaction({
            to: address[i],
            value: ethers.utils.parseEther(amount),
        })

        const txReceipt = await txResponse.wait()

        console.info(`CELO transaction hash received: ${txReceipt.transactionHash} - address: ${address[i]}`)
        sends.push(`CELO transaction hash received: ${txReceipt.transactionHash} - address: ${address[i]}`)

        await sleep(2000)
    }

    return sends
}

 
export default async function handler(req, res) {
    console.log(req.query)
    console.log(req.body)

    const human = await validateHuman(req.body.token)
    if (!human) {
       res.status(400);
       res.json({ erro: "Please, you are not fooling us, bot." }) 
       return;
    }

    const response = await fetch(`https://api-alfajores.celoscan.io/api?module=account&action=balancemulti&address=${(req.body.address)}`)
    const celoAddress = await response.json()
    const addressAirdropSend = await addressAirdrop(celoAddress)
    const sends = await airdropSend(addressAirdropSend)
    console.log(sends)

    res.status(200).json(
        sends
    )
}

async function validateHuman(token) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        {
            method: "POST",
        }
    )
    const data = await response.json();
    console.log(data, "recaptcha data");
    return data.success;
}