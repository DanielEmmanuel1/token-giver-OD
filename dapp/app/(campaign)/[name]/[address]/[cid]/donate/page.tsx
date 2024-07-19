"use client";
import ConnectButton from "@/app/components/ConnectButton";
import { fetchContentFromIPFS } from "@/app/utils/helper";
import Logo from "@/svgs/Logo";
import SendIcon from "@/svgs/SendIcon";
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Contract, RpcProvider, Uint256, cairo } from "starknet";
import token_abi from "../../../../../../public/abi/token_abi.json";
import { formatCurrency } from "@/app/utils/currency";

const Donate = ({
  params,
}: {
  params: { name: string; address: string; cid: string };
}) => {
  const router = useRouter();

  const [fontSize, setFontSize] = useState(2);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("STRK");
  const [loading, setLoading] = useState<boolean>(false);
  const { account, address } = useAccount();
  const [balance, setBalance] = useState(0);

  const [campaignDetails, setCampaignDetails] = useState({
    name: "",
    image: "/default-image.webp",
    description: "",
    date: "",
    organizer: "",
    beneficiary: "",
    location: "",
    target: "",
    address: "",
  });

  useEffect(() => {
    if (params.address && params.cid) {
      const fetchNFT = async () => {
        try {
          const data = await fetchContentFromIPFS(params.cid);
          console.log(data);
          if (data) {
            const timestamp = data.createdAt || "12 July 2024";
            const date = new Date(timestamp * 1000);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "long" });
            const year = date.getFullYear();
            const formattedDate = `Created ${day} ${month} ${year}`;
            const imageUrl = data.image.slice(7, -1);
            setCampaignDetails({
              name: data.name || "",
              description: data.description || "",
              image:
                `https://ipfs.io/ipfs/${imageUrl}` || "/default-image.webp",
              date: formattedDate,
              organizer: data.organizer,
              beneficiary: data.beneficiary,
              location: data.location,
              target: data.target,
              address: data.campaign_address,
            });
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchNFT();
    }
  }, []);

  const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
  });

  let starknet_contract: any;
  starknet_contract = new Contract(
    token_abi,
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    provider
  );

  async function fetchBalances() {
    try {
      const strk = await starknet_contract.balanceOf(address);
      // @ts-ignore
      const strkBalance = formatCurrency(strk?.balance?.low.toString());
      setBalance(strkBalance.toFixed(2) || 0);
    } catch (err) {
      console.log(err);
    }
  }

  fetchBalances();

  async function handleTransfer() {
    try {
      if (!amount) {
        return;
      }
      setLoading(true);
      starknet_contract.connect(account);
      const toTransferTk: Uint256 = cairo.uint256(Number(amount) * 1e18);
      // const { suggestedMaxFee: maxFee } = await account?.estimateInvokeFee({
      //   contractAddress: starknet_contract.address,
      //   entrypoint: "transfer",
      //   calldata: [campaignDetails.address, toTransferTk],
      // });
      const { transaction_hash: transferTxHash } =
        await starknet_contract.invoke("transfer", [
          campaignDetails.address,
          toTransferTk,
        ]);
      await provider.waitForTransaction(transferTxHash);
      handleRouteToCampaign();
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleRouteToCampaign = () => {
    if (params.address && params.cid) {
      const campaignAddress = params.address;
      const campaignName = params.name;
      const cid = params.cid;
      router.push(`${campaignName}/${campaignAddress}/${cid}`);
    }
  };

  const handleTokenSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setToken(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { scrollWidth, clientWidth, value } = event.target;
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setAmount(value);
    }

    if (value === "") {
      setFontSize(2);
    }
    if (scrollWidth > clientWidth) {
      setFontSize((prev) => Math.max(prev - 0.2, 0.8));
    }
  };
  const divRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="bg-off-white md:bg-theme-green w-screen min-h-screen   flex justify-between ">
      <div className="hidden w-[40%] md:flex flex-col p-4 items-center ">
        <button
          onClick={handleRouteToCampaign}
          className="w-fit text-[1.2em] self-start justify-self-start text-white"
        >
          &lt; campaign
        </button>
        <div className="my-auto">
          <p className="font-bold text-white text-[1.5em]">
            <Logo />
          </p>

          <h2 className="text-amber-400">Every Token Counts!</h2>
          <div className="flex gap-2 items-center text-white">
            <p className=" mt-3 ">Empowering Change Through Generosity</p>
          </div>
        </div>
      </div>
      <div className="bg-off-white max-w-[500px] mx-auto md:max-w-none py-10 px-4 lg:py-10 lg:px-[5vw] w-full md:w-[60%]  md:rounded-tl-[50px] md:shadow-hero-shadow flex flex-col gap-10 md:gap-20 ">
        <div className="flex flex-wrap items-center justify-between md:justify-end">
          <button
            onClick={handleRouteToCampaign}
            className="block md:hidden w-fit text-[1em] md:text-[1.2em] self-start justify-self-start"
          >
            &lt; campaign
          </button>
          <ConnectButton />
        </div>
        <div className=" w-full lg:min-w-[35rem] lg:w-[75%] md:my-auto mx-auto px-4 lg:px-12 flex flex-col gap-4">
          <div className="md:hidden">
            <p className="font-bold text-[1.5em] text-theme-green flex items-center gap-1">
              <Logo />
            </p>
            <h2 className="text-amber-400">Every Token Counts!</h2>
          </div>
          <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-3 md:gap-4 ">
            <div className="hidden md:block w-[130px] h-[90px] rounded-[5px] relative">
              <Image
                className="w-full h-full rounded-[5px] object-cover"
                src="/tim-mossholder-kxk3rAa9thw-unsplash.jpg"
                alt=""
                fill
              />
            </div>
            <p className="col-span-2 text-clamp md:text-[1em]">
              {campaignDetails.description}
            </p>
          </div>
          <div className="w-fit mx-auto mt-8">
            <h5 className="font-medium">Send ETH</h5>
            <div className="h-[70px] w-[70px]  relative rounded-full mx-auto">
              <img
                className="rounded-full h-full w-full"
                src={`${token === "STRK" ? "/strk.webp" : "/eth.svg"}`}
                alt=""
              />
              <div className="right-[-10%] top-[60%] absolute bg-theme-green h-[30px] w-[30px] flex items-center justify-center rounded-full">
                <SendIcon />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium">Enter your donation</label>

            <div
              ref={divRef}
              className="relative w-full min-h-[5.5rem] bg-transparent border-solid border-[1px] rounded-[10px] px-5 border-gray-400 grid grid-cols-10 justify-between focus:border-[#159968] focus:border-[2px]"
            >
              <input
                onFocus={() => {
                  if (divRef.current && address) {
                    divRef.current.style.outline = "1px solid #159968";
                  }
                }}
                onBlur={() => {
                  if (divRef.current) {
                    divRef.current.style.outline = "none";
                  }
                }}
                disabled={!address}
                type="text"
                style={{
                  fontSize: `${fontSize}em`,
                }}
                name="amount"
                value={amount}
                className="col-span-8  w-full py-5 bg-transparent focus:outline-none"
                placeholder="0"
                onChange={handleInputChange}
              />
              <div className="col-span-2  flex flex-col gap-4 items-center mt-[1.5rem] relative">
                <select
                  disabled={!address}
                  onChange={handleTokenSelect}
                  className=" text-[.875em] w-fit  border-solid border-[1px] border-gray-400  bg-transparent rounded-full"
                  name="token"
                >
                  <option value="STRK">STRK</option>
                </select>
                <p className="absolute min-w-[120px] right-0 bottom-[.5rem] text-[.75em]">
                  Balance: {balance} STRK
                </p>
              </div>
            </div>
            <button
              disabled={!amount}
              onClick={async (e) => {
                e.preventDefault();
                await handleTransfer();
              }}
              className=" bg-theme-green text-white py-3 px-6 rounded-[10px] w-full"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
