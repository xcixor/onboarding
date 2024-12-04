import PrivacyPolicy from "@/components/privacy/PrivacyPolicy";
import Head from "next/head";

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | PES Onboarding</title>
        <meta name="description" content="Privacy Policy for PES Onboarding" />
      </Head>
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPage;
