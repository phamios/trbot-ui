import { GetServerSideProps } from 'next';

export default function Home() {
	return <></>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	return {
		redirect: {
			destination: '/manage/chains',
			permanent: false,
		},
	};
};
