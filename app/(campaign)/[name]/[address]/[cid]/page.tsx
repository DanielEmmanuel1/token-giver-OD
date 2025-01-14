"use client";
import CampaignLoader from "@/app/components/loading/CampaignLoader";
import { fetchCampaign } from "@/app/utils/helper";
import CalenderIcon from "@/svgs/CalenderIcon";
import DonateIcon from "@/svgs/DonateIcon";
import ProfileIcon from "@/svgs/ProfileIcon";
import ShareIcon from "@/svgs/ShareIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/app/components/util/Container";
import { H2 } from "@/app/components/util/Headers";
import { campaign_contract } from "@/app/utils/data";

const page = ({
  params,
}: {
  params: { name: string; address: string; cid: string };
}) => {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  const donateNow = () => {
    if (params.address && params.cid) {
      const campaignAddress = params.address;
      const campaignName = params.name;
      const cid = params.cid;
      router.push(`/${campaignName}/${campaignAddress}/${cid}/donate`);
    }
  };

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
      fetchCampaign(
        params.cid,
        setBalance,
        setDonationCount,
        setCampaignDetails,
        null
      );
    }
  }, [params]);
  const width = `${Math.min(
    (balance / parseInt(campaignDetails.target)) * 100,
    100
  )}%`;
  return (
    <>
      {campaignDetails.name ? (
        <section className=" mt-[4rem]  bg-background ">
          <Container className="mx-auto py-10 md:py-16 px-4 md:px-10">
            <div className="lg:flex gap-8  max-w-[500px] mx-auto md:mx-0  md:max-w-none relative">
              <div className="lg:w-[60%] mx-auto flex flex-col gap-12">
                <H2 style="font-bold">{campaignDetails.name}</H2>
                <div className="rounded-[10px] h-[400px] relative w-full object-contain md:w-[80%] mx-auto">
                  <Image
                    className="rounded-[10px] h-full w-full"
                    loader={() => campaignDetails.image}
                    src={campaignDetails.image}
                    unoptimized
                    priority
                    fill
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-8 w-full md:w-[85%] md:mx-auto  lg:hidden">
                  <div className="flex flex-col gap-4">
                    <p>
                      <span className="text-[2rem]">
                        {balance.toFixed(2)} STRK
                      </span>{" "}
                      raised of {campaignDetails.target || 0}STRK target
                    </p>
                    <div className="">
                      <div className="w-full h-[.25rem] mb-2 relative">
                        <div className="w-full h-[1vw] max-h-[.25rem] bg-[#127c5548] rounded-full mb-4"></div>
                        <div
                          style={{
                            width: width,
                          }}
                          className={`h-[1vw] max-h-[.25rem] bg-[#127C56] rounded-full mb-4 top-0 absolute`}
                        ></div>
                      </div>
                      <p>
                        {donationCount || 0} donation
                        {donationCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 text-white md:flex-row   ">
                    <button
                      onClick={donateNow}
                      className="w-full md:w-1/2 bg-theme-green p-3 rounded-[5px] flex justify-center items-center gap-2 "
                    >
                      <span>Donate now</span>{" "}
                      <span className="text-theme-yellow">
                        <DonateIcon />
                      </span>
                    </button>
                    <button className="w-full md:w-1/2 bg-theme-green p-3 rounded-[5px]  flex justify-center items-center gap-2">
                      <span>Share</span>
                      <span className="text-theme-yellow">
                        <ShareIcon />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-[85%] md:mx-auto lg:w-full">
                  <p>{campaignDetails.description}</p>
                </div>
                <div className="flex flex-col w-full md:w-[85%] md:mx-auto md:flex-row gap-4 lg:w-full">
                  <button
                    onClick={donateNow}
                    className=" w-full md:w-1/2 border-[1px]  border-solid border-theme-green p-3 rounded-[5px] font-bold"
                  >
                    Donate
                  </button>
                  <button className="w-full md:w-1/2 border-[1px] border-solid border-theme-green p-3 rounded-[5px] font-bold">
                    Share
                  </button>
                </div>

                <div>
                  <h4>Organizer and beneficiary</h4>
                  <div className="flex flex-col items-center  w-fit md:items-start md:w-full md:flex-row gap-8 md:gap-12 py-8">
                    <div className="flex gap-4">
                      <div className="bg-gray-100 h-[50px] w-[50px] rounded-full flex items-center justify-center">
                        <ProfileIcon />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="font-bold">{campaignDetails.organizer}</p>
                        <p>Organizer</p>
                        <p>{campaignDetails.location}</p>
                      </div>
                    </div>
                    {campaignDetails.beneficiary && (
                      <>
                        <p className="text-[1.5em] font-extralight hidden md:block">
                          &rarr;
                        </p>
                        <div className="flex gap-4">
                          <div className="bg-gray-100 h-[50px] w-[50px] rounded-full flex items-center justify-center">
                            <ProfileIcon />
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="font-bold">
                              {campaignDetails.beneficiary}
                            </p>
                            <p>Beneficiary</p>
                          </div>
                        </div>{" "}
                      </>
                    )}
                  </div>
                </div>
                <div className="border-solid border-t-[1px] border-gray-100 py-6 flex gap-4 items-center">
                  <span className="bg-gray-100 h-[50px] w-[50px] rounded-full flex items-center justify-center">
                    <CalenderIcon />
                  </span>{" "}
                  <p>{campaignDetails.date}</p>
                </div>
              </div>
              <div className="hidden sticky top-8 bg-background p-8  rounded-[10px] w-[35%] h-fit lg:flex flex-col gap-8 shadow-small ">
                <div className="flex flex-col gap-4">
                  <p>
                    <span className="text-[2rem]">
                      {balance.toFixed(2)} STRK
                    </span>{" "}
                    raised of {campaignDetails.target || "0"} STRK target
                  </p>
                  <div className="">
                    <div className="w-full h-[.25rem] mb-2 relative">
                      <div className="w-full h-[1vw] max-h-[.25rem] bg-[#127c5548] rounded-full mb-4"></div>
                      <div
                        style={{
                          width: width,
                        }}
                        className={`h-[1vw] max-h-[.25rem] bg-[#127C56] rounded-full mb-4 top-0 absolute`}
                      ></div>
                    </div>
                    <p>
                      {donationCount} donation{donationCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-white  ">
                  <button
                    onClick={donateNow}
                    className="w-full bg-theme-green p-2 rounded-[5px] flex  justify-center items-center gap-2 "
                  >
                    <span>Donate now</span>{" "}
                    <span className="text-theme-yellow">
                      <DonateIcon />
                    </span>
                  </button>
                  <button className="w-full bg-theme-green p-2 rounded-[5px]  flex justify-center items-center gap-2">
                    <span>Share</span>
                    <span className="text-theme-yellow">
                      <ShareIcon />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : (
        <CampaignLoader />
      )}
    </>
  );
};

export default page;
