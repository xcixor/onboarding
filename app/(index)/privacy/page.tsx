import PrivacyPolicy from "@/components/privacy/PrivacyPolicy";
import Head from 'next/head';

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | PES Academy</title>
        <meta name="description" content="Privacy Policy for PES Academy" />
      </Head>
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPage;