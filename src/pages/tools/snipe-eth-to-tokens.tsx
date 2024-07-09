import Alert from '@/components/bootstrap/Alert';
import Breadcrumb from '@/components/bootstrap/Breadcrumb';
import Button from '@/components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '@/components/bootstrap/Card';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import Spinner from '@/components/bootstrap/Spinner';
import ContractConfiguration from '@/containers/tools/ContractConfiguration/ContractConfiguration';
import { getErrorMessage } from '@/helpers';
import useQuerySnipeData from '@/hooks/api/useQuerySnipeData';
import useQuerySnipes from '@/hooks/api/useQuerySnipes';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import useSuccessToast from '@/hooks/useSuccessToast';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '@/layout/SubHeader/SubHeader';
import ServiceAPI from '@/services/service-api';
import { TDEXRouter } from '@/type/data/dex-routers.type';
import { parseSnipeStatus, SnipeStatus, TSnipe } from '@/type/data/snipes.type';
import { TTradingContract } from '@/type/data/trading-contracts.type';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { isNaN } from 'lodash';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as yup from 'yup';

interface SnipeETHToTokensProps {}

interface FormikValues {
	snipedAmountOut?: string;
	exactAmountIn?: string;
}

const validationSchema = yup.object().shape({
	snipedAmountOut: yup.string().required(),
	exactAmountIn: yup.string().required(),
});

const SnipeETHToTokens: NextPage<SnipeETHToTokensProps> = () => {
	const router = useRouter();

	const toastSuccess = useSuccessToast();

	const [canSnipe, setCanSnipe] = useState<boolean>(false);
	const [selectedRouter, setSelectedRouter] = useState<TDEXRouter | null>(null);
	const [selectedContract, setSelectedContract] = useState<TTradingContract | null>(null);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [snipeInfo, setSnipeInfo] = useState<TSnipe | null>(null);

	const { data: snipes, refetch: refetchSnipes } = useQuerySnipes(selectedContract?.id);
	const { data: snipeData } = useQuerySnipeData(snipeInfo?.id, {
		refetchInterval: 3000,
	});

	const formik = useFormik<FormikValues>({
		initialValues: {},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			const { exactAmountIn, snipedAmountOut } = values;
			try {
				if (selectedContract && selectedRouter && canSnipe) {
					setIsProcessing(true);
					setError(null);

					const snipeId = await ServiceAPI.snipeSwapEthToTokens({
						snipedAmountOut: snipedAmountOut as string,
						exactAmountIn: exactAmountIn as string,
						contractId: selectedContract.id,
						routerId: selectedRouter.id,
					});

					if (snipeId && snipeId > 0) {
						formik.resetForm();

						const newSnipe = await ServiceAPI.getSnipeById(snipeId);
						setSnipeInfo(newSnipe);

						toastSuccess('Successfully created a snipe request');
						return true;
					}
				}
			} catch (e: any) {
				setError(getErrorMessage(e));
				animateScrollTop();
			} finally {
				setIsProcessing(false);
			}

			return false;
		},
	});

	const animateScrollTop = useOnEventCallback(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	});

	const onSelectContract = useOnEventCallback((selectedContract: TTradingContract) => {
		setSelectedContract(selectedContract);
	});

	const onSelectRouter = useOnEventCallback((selectedRouter: TDEXRouter) => {
		setSelectedRouter(selectedRouter);
	});

	const onApprovalChange = useOnEventCallback((isErc20Approved: boolean, isWETHApproved: boolean) => {
		setCanSnipe(isErc20Approved && isWETHApproved);
	});

	const onAmountChange = useOnEventCallback((field: string) => {
		return (e: any) => {
			const value = e.target.value;
			if (!isNaN(Number(value))) {
				formik.setFieldValue(field, value);
			}
		};
	});

	const onViewSnipeInfo = useOnEventCallback((snipe: TSnipe) => {
		setSnipeInfo(snipe);
	});

	const onBackToList = useOnEventCallback(() => {
		setSnipeInfo(null);
		refetchSnipes();
	});

	const onDeleteSnipe = useOnEventCallback(async (snipe: TSnipe) => {
		if (snipe.status === SnipeStatus.ERROR) {
			const deleted = await ServiceAPI.deleteSnipe(snipe.id);
			if (deleted) {
				refetchSnipes();
			}
		}
	});

	const renderSnipeTable = () => {
		return (
			<Card>
				<CardHeader>
					<CardLabel icon={'PlaylistPlay'} iconColor="primary">
						<CardTitle>Your snipes</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody className="table-responsive">
					<table className="table table-modern">
						<thead>
							<tr>
								<th>Snipe ID</th>
								<th>Threshold</th>
								<th>Exact amount in</th>
								<th>Status</th>
								<td align="center" width={2}></td>
							</tr>
						</thead>
						<tbody>
							{snipes &&
								snipes?.map((snipe) => {
									const snipeStatus = parseSnipeStatus(snipe.status);
									return (
										<tr key={`snipe-${snipe.id}`}>
											<td>{snipe.id}</td>
											<td>
												{snipe.snipedAmountOut} {selectedContract?.symbol}
											</td>
											<td>{snipe.exactAmountIn} ETH</td>
											<td>
												<span
													style={{
														color: snipeStatus?.color ? snipeStatus.color : '',
													}}
												>
													{snipeStatus?.label || ''}
												</span>

												{snipe.status === SnipeStatus.ERROR && (
													<Button
														isLink
														color="danger"
														className={classNames('text-nowrap', 'border-light', 'ms-2')}
														icon="DeleteSweep"
														onClick={() => onDeleteSnipe(snipe)}
													></Button>
												)}
											</td>
											<td>
												<Button
													isLink
													color="primary"
													className={classNames('text-nowrap', 'border-light')}
													icon="Info"
													onClick={() => onViewSnipeInfo(snipe)}
												>
													View data
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</CardBody>
			</Card>
		);
	};

	const renderSnipeLog = () => {
		if (snipeInfo && typeof snipeData?.logs === 'string') {
			try {
				const logs = snipeData.logs;
				const logParts = logs.split('\n');
				if (logParts.length > 0) {
					return logParts.map((log: string, index: number) => {
						return <p key={`snipe-${snipeInfo}-log-${index}`}>{log}</p>;
					});
				}
			} catch (e) {}
		}
		return <></>;
	};

	const renderSnipeInfo = () => {
		const snipeStatus = parseSnipeStatus(snipeData?.status as SnipeStatus);

		return (
			<Card>
				<CardHeader>
					<CardLabel icon={'Info'} iconColor="primary">
						<CardTitle>Snipe data</CardTitle>
					</CardLabel>
					<CardActions>
						<Button color="brand-two" isLight icon="Backspace" onClick={onBackToList}>
							Back to list
						</Button>
					</CardActions>
				</CardHeader>
				<CardBody>
					<div className="mb-3">
						<h4>Summary</h4>
					</div>
					<div className="row">
						<dl className="ms-1 row">
							<dt className="col-sm-3">Snipe ID</dt>
							<dd className="col-sm-9">#{snipeInfo?.id}</dd>

							<dt className="col-sm-3">Upper threshold</dt>
							<dd className="col-sm-9">
								{snipeInfo?.snipedAmountOut} {selectedContract?.symbol}
							</dd>

							<dt className="col-sm-3 text-truncate">Exact amount in (ETH)</dt>
							<dd className="col-sm-9">{snipeInfo?.exactAmountIn} ETH</dd>

							<dt className="col-sm-3">Status</dt>
							<dd className="col-sm-9">
								{snipeData?.status !== SnipeStatus.DONE && snipeData?.status !== SnipeStatus.ERROR && (
									<Spinner isSmall inButton isGrow />
								)}

								<span
									style={{
										color: snipeStatus?.color ? snipeStatus.color : '',
									}}
								>
									{snipeStatus?.label || ''}
								</span>
							</dd>
						</dl>
					</div>

					<div className="mt-2 mb-3">
						<h4>Logs</h4>
					</div>
					<div className="col-12 snipe-log-box">{renderSnipeLog()} </div>
				</CardBody>
			</Card>
		);
	};

	return (
		<PageWrapper isProtected={true}>
			<Head>Snipe {`>`} ETH to Tokens</Head>
			<SubHeader className="mt-4">
				<SubHeaderLeft>
					<Breadcrumb list={[{ title: 'Snipe > ETH to Tokens', to: router.pathname }]} />
				</SubHeaderLeft>
				<SubHeaderRight>{null}</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className="row h-100 align-content-start">
					{error && (
						<div className="col-md-12">
							<Alert color="danger" isLight isDismissible>
								Error: {error}
							</Alert>
						</div>
					)}

					<ContractConfiguration
						onSelectContract={onSelectContract}
						onSelectRouter={onSelectRouter}
						onApprovalChange={onApprovalChange}
					/>

					{selectedContract && canSnipe && (
						<div className="col-7">
							<Card>
								<CardBody>
									<div className="row g-4">
										<div className="col-12">
											<FormGroup
												id="snipedAmountOut"
												label="Upper threshold of output amount (Auto-swap immediately if the quote is less than this)"
											>
												<Input
													readOnly={isProcessing}
													type="text"
													placeholder={`Enter threshold (Max ${selectedContract.decimals} decimal places)`}
													value={formik.values.snipedAmountOut}
													isTouched={formik.touched.snipedAmountOut}
													invalidFeedback={formik.errors.snipedAmountOut}
													isValid={formik.isValid}
													onChange={onAmountChange('snipedAmountOut')}
												/>
											</FormGroup>
										</div>

										<div className="col-12">
											<FormGroup
												id="exactAmountIn"
												label="Enter amount of ETH you'd like to swap"
											>
												<Input
													readOnly={isProcessing}
													type="text"
													placeholder={`Amount (Max ${selectedContract.decimals} decimal places)`}
													value={formik.values.exactAmountIn}
													isTouched={formik.touched.exactAmountIn}
													invalidFeedback={formik.errors.exactAmountIn}
													isValid={formik.isValid}
													onChange={onAmountChange('exactAmountIn')}
												/>
											</FormGroup>
										</div>

										<div className="col-12">
											<Button
												isDisable={isProcessing || !formik.isValid}
												icon={isProcessing ? '' : 'Api'}
												color="success"
												className="w-100 p-3"
												onClick={formik.handleSubmit}
											>
												{isProcessing && <Spinner isSmall inButton isGrow />}
												SNIPE IT
											</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}

					{selectedContract && <>{!snipeInfo ? renderSnipeTable() : renderSnipeInfo()}</>}
				</div>
			</Page>
		</PageWrapper>
	);
};

export default SnipeETHToTokens;
