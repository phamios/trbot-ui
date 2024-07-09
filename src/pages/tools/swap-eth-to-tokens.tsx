import Alert from '@/components/bootstrap/Alert';
import Breadcrumb from '@/components/bootstrap/Breadcrumb';
import Button from '@/components/bootstrap/Button';
import Card, { CardBody } from '@/components/bootstrap/Card';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import Spinner from '@/components/bootstrap/Spinner';
import ContractConfiguration from '@/containers/tools/ContractConfiguration/ContractConfiguration';
import { getErrorMessage } from '@/helpers';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '@/layout/SubHeader/SubHeader';
import ServiceAPI from '@/services/service-api';
import { TDEXRouter } from '@/type/data/dex-routers.type';
import { TTradingContract } from '@/type/data/trading-contracts.type';
import { isNaN } from 'lodash';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface SwapETHTokensPageProps {}

const SwapETHTokensPage: NextPage<SwapETHTokensPageProps> = () => {
	const router = useRouter();

	const [canSwap, setCanSwap] = useState<boolean>(false);
	const [selectedContract, setSelectedContract] = useState<TTradingContract | null>(null);
	const [selectedRouter, setSelectedRouter] = useState<TDEXRouter | null>(null);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [amountIn, setAmountIn] = useState<string>('');
	const [txHash, setTxHash] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const animateScrollTop = useOnEventCallback(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	});

	const swap = useOnEventCallback(async () => {
		try {
			if (selectedContract && selectedRouter) {
				setIsProcessing(true);
				setTxHash(null);
				setError(null);

				const response = await ServiceAPI.swap(selectedContract.id, selectedRouter.id, amountIn);

				if (response?.txHash) {
					setTxHash(response.txHash);
					setAmountIn('');
					animateScrollTop();

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
	});

	const onSelectContract = useOnEventCallback((selectedContract: TTradingContract) => {
		setSelectedContract(selectedContract);
	});

	const onSelectRouter = useOnEventCallback((selectedRouter: TDEXRouter) => {
		setSelectedRouter(selectedRouter);
	});

	const onApprovalChange = useOnEventCallback((isErc20Approved: boolean, isWETHApproved: boolean) => {
		setCanSwap(isErc20Approved && isWETHApproved);
	});

	return (
		<PageWrapper isProtected={true}>
			<Head>Swap ETH to Tokens</Head>
			<SubHeader className="mt-4">
				<SubHeaderLeft>
					<Breadcrumb list={[{ title: 'Swap ETH to Tokens', to: router.pathname }]} />
				</SubHeaderLeft>
				<SubHeaderRight>{null}</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className="row h-100 align-content-start">
					{txHash && (
						<div className="col-md-12">
							<Alert
								color="success"
								isLight
								isDismissible
								onDismiss={() => {
									setTxHash(null);
								}}
							>
								Swapped successfully. Transaction hash: {txHash}
							</Alert>
						</div>
					)}

					{error && (
						<div className="col-md-12">
							<Alert
								color="danger"
								isLight
								isDismissible
								onDismiss={() => {
									setTxHash(null);
								}}
							>
								Error: {error}
							</Alert>
						</div>
					)}

					<ContractConfiguration
						onSelectContract={onSelectContract}
						onSelectRouter={onSelectRouter}
						onApprovalChange={onApprovalChange}
					/>

					{selectedContract && canSwap && (
						<div className="col-7">
							<Card>
								<CardBody>
									<div className="row g-4">
										<div className="col-12">
											<FormGroup label="Enter amount of ETH you'd like to swap">
												<Input
													readOnly={isProcessing}
													type="text"
													placeholder={`Amount (Max ${selectedContract.decimals} decimal places)`}
													value={String(amountIn)}
													onChange={(e: any) => {
														const value = e.target.value;
														if (!isNaN(Number(value))) {
															setAmountIn(value);
														}
													}}
												/>
											</FormGroup>
										</div>

										<div className="col-12">
											<Button
												isDisable={isProcessing || !amountIn || Number(amountIn) <= 0}
												icon={isProcessing ? '' : 'SwapHoriz'}
												color="success"
												className="w-100 p-3"
												onClick={swap}
											>
												{isProcessing && <Spinner isSmall inButton isGrow />}
												SWAP
											</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}
				</div>
			</Page>
		</PageWrapper>
	);
};

export default SwapETHTokensPage;
