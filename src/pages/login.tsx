import Button from '@/components/bootstrap/Button';
import Card, { CardBody } from '@/components/bootstrap/Card';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import Spinner from '@/components/bootstrap/Spinner';
import Toasts from '@/components/bootstrap/Toasts';
import Icon from '@/components/icon/Icon';
import { AuthContext } from '@/contexts/AuthContext';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import ServiceAPI from '@/services/service-api';
import classNames from 'classnames';
import { useFormik } from 'formik';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as Yup from 'yup';

const validate = () => {
	return Yup.object().shape({
		email: Yup.string().email().required(),
		password: Yup.string().max(64).required(),
	});
};

interface ILoginProps {}

interface FormikValues {
	email: string;
	password: string;
}

const Login: NextPage<ILoginProps> = () => {
	const router = useRouter();
	const { addToast } = useToasts();
	const { authenticate } = useContext(AuthContext);

	const formik = useFormik<FormikValues>({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: validate(),
		onSubmit: async (values) => {
			try {
				const { email, password } = values;
				const accessToken = await ServiceAPI.login(email, password);
				console.log(accessToken);
				const success = await authenticate(accessToken);
				success && router.push('/manage/chains');
			} catch (e: any) {
				addToast(
					<Toasts title="Login failed" icon="Error" iconColor="danger" isDismiss>
						{e.message}
					</Toasts>,
					{
						autoDismiss: true,
					},
				);
			}
		},
	});

	const onKeyUpSubmit = (e: any) => {
		if (e.key === 'Enter') {
			return formik.handleSubmit();
		}
	};

	return (
		<PageWrapper isProtected={false} className={classNames('bg-light')}>
			<Head>
				<title>Login to BTP Bot</title>
			</Head>
			<Page className="p-0">
				<div className="row h-100 align-items-center justify-content-center">
					<div className="col-xl-4 col-lg-6 col-md-8 shadow-3d-container">
						<Card className="shadow-3d-dark">
							<CardBody>
								<div className="text-center my-5">
									<Link
										href="/"
										className={classNames('text-decoration-none  fw-bold fs-2', 'text-dark')}
									>
										<Icon icon="Android" size="3x" />
										<span className="ms-1"> Login to BTP Bot</span>
									</Link>
								</div>

								<form className="row g-4">
									<div className="col-12">
										<FormGroup
											className="mb-2"
											id="loginUsername"
											isFloating
											label="Your email or username"
										>
											<Input
												autoComplete="username"
												value={formik.values.email}
												isTouched={formik.touched.email}
												invalidFeedback={formik.errors.email}
												isValid={formik.isValid}
												onKeyUp={onKeyUpSubmit}
												onChange={(e: any) => {
													formik.setFieldValue('email', e.target.value);
												}}
												onBlur={formik.handleBlur}
												onFocus={() => {
													formik.setErrors({});
												}}
											/>
										</FormGroup>

										<FormGroup id="loginPassword" isFloating label="Password">
											<Input
												type="password"
												autoComplete="current-password"
												value={formik.values.password}
												isTouched={formik.touched.password}
												invalidFeedback={formik.errors.password}
												validFeedback="Looks good!"
												isValid={formik.isValid}
												onKeyUp={onKeyUpSubmit}
												onChange={(e: any) => {
													formik.setFieldValue('password', e.target.value);
												}}
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
									</div>
									<div className="col-12">
										<Button
											isDisable={formik.isSubmitting}
											color="warning"
											className="w-100 py-3"
											onClick={formik.handleSubmit}
										>
											{formik.isSubmitting && <Spinner isSmall inButton isGrow />}
											Login
										</Button>
									</div>
								</form>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Login;
