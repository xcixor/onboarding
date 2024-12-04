import TermsAndConditions from "@/components/terms/TermsAndConditions";
import Head from "next/head";

const TermsAndConditionsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and conditions | PES Onboarding</title>
        <meta
          name="description"
          content="Terms and Conditions for PES Onboarding"
        />
      </Head>
      <TermsAndConditions />
    </>
  );
};

export default TermsAndConditionsPage;
