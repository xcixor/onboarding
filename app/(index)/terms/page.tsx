import TermsAndConditions from "@/components/terms/TermsAndConditions";
import Head from 'next/head';

const TermsAndConditionsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and conditions | PES Academy</title>
        <meta name="description" content="Terms and Conditions for PES Academy" />
      </Head>
      <TermsAndConditions />
    </>
  );
};

export default TermsAndConditionsPage;