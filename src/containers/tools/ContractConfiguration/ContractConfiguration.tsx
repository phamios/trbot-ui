import Button from '@/components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '@/components/bootstrap/Card';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import Label from '@/components/bootstrap/forms/Label';
import Select from '@/components/bootstrap/forms/Select';
import Spinner from '@/components/bootstrap/Spinner';
import EthereumAddress from '@/components/EthereumAddress';
import Icon from '@/components/icon/Icon';
import { getErrorMessage } from '@/helpers';
import useQueryBalance from '@/hooks/api/useQueryBalance';
import useQueryErc20Balance from '@/hooks/api/useQueryErc20Balance';
import useQueryWallet from '@/hooks/api/useQueryWallet';
import useDexRouterByChainIdOptions from '@/hooks/select-options/useDexRouterByChainIdOptions';
import useTradingContractOptions from '@/hooks/select-options/useTradingContracts';
import useErrorToast from '@/hooks/useErrorToast';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import useSuccessToast from '@/hooks/useSuccessToast';
import ServiceAPI from '@/services/service-api';
import { TDEXRouter } from '@/type/data/dex-routers.type';
import { TTradingContract, TUpdateTradingContract } from '@/type/data/trading-contracts.type';
import { useFormik } from 'formik';
import { isEmpty, isNil, omitBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import * as yup from 'yup';

enum ApprovalState {
	INIT,
	APPROVED,
	NOT_APPROVED,
}

const validate = () => {
	return yup.object().shape({
		contractId: yup.number().positive().required(),
		routerId: yup.number().positive().required(),
		gasPrice: yup.string().required(),
		gasLimit: yup.string().required(),
		slippage: yup.number().required(),
	});
};

interface FormikValues {
	contractId?: number;
	routerId?: number;
	gasPrice?: string;
	gasLimit?: string;
	slippage?: number;
}

interface ContractSelectionContainerProps {
	onSelectContract?: (contract: TTradingContract) => void;
	onSelectRouter?: (router: TDEXRouter) => void;
	onApprovalChange?: (isErc20Approved: boolean, isWETHApproved: boolean) => void;
}

const ContractSelectionContainer: React.FC<ContractSelectionContainerProps> = ({
	onSelectContract,
	onSelectRouter,
	onApprovalChange,
}) => {
	const [, copyToClipboard] = useCopyToClipboard();

	const toastError = useErrorToast();
	const toastSuccess = useSuccessToast();

	const [selectedContract, setSelectedContract] = useState<TTradingContract | null>(null);
	const [selectedRouter, setSelectedRouter] = useState<TDEXRouter | null>(null);
	const [wethApprovalState, setWETHApprovalState] = useState<ApprovalState>(ApprovalState.INIT);
	const [erc20ApprovalState, setErc20ApprovalState] = useState<ApprovalState>(ApprovalState.INIT);
	const [isWETHApproving, setIsWETHApproving] = useState<boolean>(false);
	const [isErc20Approving, setIsErc20Approving] = useState<boolean>(false);

	const { data: balance, isLoading: isBalanceLoading } = useQueryBalance(selectedContract?.chainId, {
		refetchInterval: 10000,
	});
	const { data: erc20Balance, isLoading: isErc20BalanceLoading } = useQueryErc20Balance(selectedContract?.id, {
		refetchInterval: 10000,
	});

	const contractOptions = useTradingContractOptions();
	const routerOptions = useDexRouterByChainIdOptions(selectedContract?.chainId);

	const { data: wallet } = useQueryWallet();

	const formik = useFormik<FormikValues>({
		initialValues: {},
		validationSchema: validate(),
		onSubmit: async (values) => {
			try {
				const { contractId, gasPrice, gasLimit, slippage } = values;
				if (contractId && contractId > 0) {
					const dto: TUpdateTradingContract = omitBy(
						{
							gasLimit: String(gasLimit),
							gasPrice: gasPrice as string,
							slippage: Number(slippage),
						},
						isNil,
					) as TUpdateTradingContract;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.updateTradingContract(contractId, dto);
						if (!success) {
							throw new Error(`Failed to update swap settings`);
						}

						toastSuccess('Saved successfully');
					}
				}
			} catch (e: any) {
				toastError(getErrorMessage(e));
			}
		},
	});

	const checkWETHApprovalStatus = useOnEventCallback(async (dexRouterId: number) => {
		try {
			const approval = await ServiceAPI.checkWETHApprovalStatus(Number(dexRouterId));
			setWETHApprovalState(approval.approved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED);
			return approval.approved;
		} catch (e: any) {
			toastError(getErrorMessage(e));
		}
		return false;
	});

	const checkErc20ApprovalStatus = useOnEventCallback(async (contractId: number, routerId: number) => {
		try {
			const approval = await ServiceAPI.checkApprovalStatus(Number(contractId), Number(routerId));
			setErc20ApprovalState(approval.approved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED);
		} catch (e: any) {
			toastError(getErrorMessage(e));
		}
		return false;
	});

	const approveWETH = useOnEventCallback(async () => {
		try {
			if (selectedRouter) {
				setIsWETHApproving(true);

				const response = await ServiceAPI.approveWETH(selectedRouter.id);

				if (response?.txHash) {
					await checkWETHApprovalStatus(selectedRouter.id);
					return true;
				}
			}
		} catch (e: any) {
			toastError(getErrorMessage(e));
		} finally {
			setIsWETHApproving(false);
		}

		return false;
	});

	const approve = useOnEventCallback(async () => {
		try {
			if (selectedContract && selectedRouter) {
				setIsErc20Approving(true);

				const response = await ServiceAPI.approveContract(selectedContract.id, selectedRouter.id);

				if (response?.txHash) {
					await checkErc20ApprovalStatus(selectedContract.id, selectedRouter.id);
					return true;
				}
			}
		} catch (e: any) {
			toastError(getErrorMessage(e));
		} finally {
			setIsErc20Approving(false);
		}

		return false;
	});

	const fetchContract = useOnEventCallback(async (contractId: number) => {
		try {
			const fetchedContract = await ServiceAPI.getTradingContractById(contractId);

			formik.setValues({
				contractId: fetchedContract.id,
				gasPrice: fetchedContract.gasPrice,
				gasLimit: fetchedContract.gasLimit,
				slippage: fetchedContract.slippage,
			});

			setSelectedContract(fetchedContract);

			if (typeof onSelectContract === 'function') {
				onSelectContract(fetchedContract);
			}

			return true;
		} catch (e: any) {
			toastError(getErrorMessage(e));
		} finally {
			setErc20ApprovalState(ApprovalState.INIT);
		}

		setSelectedContract(null);
		return false;
	});

	const fetchRouter = useOnEventCallback(async (routerId: number) => {
		try {
			const fetchRouter = await ServiceAPI.getDexRouterById(routerId);

			formik.setFieldValue('routerId', routerId);
			setSelectedRouter(fetchRouter);

			if (typeof onSelectRouter === 'function') {
				onSelectRouter(fetchRouter);
			}

			return true;
		} catch (e: any) {
			toastError(getErrorMessage(e));
		} finally {
			setWETHApprovalState(ApprovalState.INIT);
		}

		setSelectedRouter(null);
		return false;
	});

	const isFetchingBalances = useMemo(() => {
		return isBalanceLoading || isErc20BalanceLoading;
	}, [isBalanceLoading, isErc20BalanceLoading]);

	useEffect(() => {
		if (typeof onApprovalChange === 'function') {
			onApprovalChange(
				erc20ApprovalState === ApprovalState.APPROVED,
				wethApprovalState === ApprovalState.APPROVED,
			);
		}
	}, [wethApprovalState, erc20ApprovalState]);

	useEffect(() => {
		if (selectedContract && selectedRouter) {
			checkErc20ApprovalStatus(selectedContract.id, selectedRouter.id);
		}
	}, [selectedContract, selectedRouter]);

	useEffect(() => {
		if (selectedRouter) {
			checkWETHApprovalStatus(selectedRouter.id);
		}
	}, [selectedRouter]);

	useEffect(() => {
		const contractId = formik.values.contractId;
		if (contractId && contractId > 0) {
			setSelectedRouter(null);
			fetchContract(contractId);
		}
	}, [formik.values.contractId]);

	useEffect(() => {
		const routerId = formik.values.routerId;
		if (routerId && routerId > 0) {
			fetchRouter(routerId);
		}
	}, [formik.values.routerId]);

	return (
		<>
			<div className="col-md-7">
				<Card>
					<CardHeader>
						<CardLabel icon="Book" iconColor="success">
							<CardTitle>Select Swap information</CardTitle>
						</CardLabel>
					</CardHeader>

					<CardBody>
						<div className="row g-4 align-items-center">
							<div className="col-12">
								<FormGroup id="contractId" label="">
									<Select
										ariaLabel="Contract"
										placeholder="Select contract..."
										list={contractOptions}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.contractId ? String(formik.values.contractId) : ''}
									/>
								</FormGroup>
							</div>

							{selectedContract && (
								<div className="col-12">
									<FormGroup id="routerId" label="">
										<Select
											ariaLabel="Router"
											placeholder="Select router..."
											list={routerOptions}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.routerId ? String(formik.values.routerId) : ''}
										/>
									</FormGroup>
								</div>
							)}
						</div>
					</CardBody>
				</Card>

				{selectedContract && (
					<Card>
						<CardHeader>
							<CardLabel icon="DataExploration" iconColor="info">
								<CardTitle>Metadata</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className="row g-4 align-items-center">
								<div className="col-12">
									<FormGroup id="name" label="Name">
										<Input readOnly type="text" value={selectedContract.name} />
									</FormGroup>
								</div>

								<div className="col-12">
									<FormGroup id="symbol" label="Symbol">
										<Input readOnly type="text" value={selectedContract.symbol} />
									</FormGroup>
								</div>

								<div className="col-12">
									<FormGroup id="address" label="Address">
										<Input readOnly type="text" value={selectedContract.address} />
									</FormGroup>
								</div>

								<div className="col-12">
									<FormGroup id="chainName" label="Chain">
										<Input readOnly type="text" value={selectedContract.chain?.name} />
									</FormGroup>
								</div>

								<div className="col-6">
									<FormGroup id="chainId" label="Chain ID">
										<Input readOnly type="number" value={selectedContract.chainId} />
									</FormGroup>
								</div>

								<div className="col-6">
									<FormGroup id="decimals" label="Decimals">
										<Input readOnly type="number" value={selectedContract.decimals} />
									</FormGroup>
								</div>
							</div>
						</CardBody>
					</Card>
				)}
			</div>
			<div className="col-md-5">
				<Card>
					<CardHeader>
						<CardLabel icon="AccountBalanceWallet" iconColor="secondary">
							<CardTitle>Wallet</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody>
						<dl className="row">
							<dt className="col-sm-3">
								<Label>Address:</Label>
							</dt>
							<dd
								className="col-sm-9"
								onClick={() => {
									if (wallet?.address) {
										copyToClipboard(wallet.address);
										toastSuccess('Address copied');
									}
								}}
							>
								<EthereumAddress shorten address={wallet?.address} />
								<Icon className="ms-2" icon="CopyAll" size="lg" />
							</dd>

							{!isFetchingBalances && selectedContract && (
								<>
									{balance && (
										<>
											<dt className="col-sm-3">
												<Label>ETH:</Label>
											</dt>
											<dd className="col-sm-9 d-flex">{balance.balance}</dd>
										</>
									)}

									{erc20Balance && (
										<>
											<dt className="col-sm-3">
												<Label>{selectedContract.symbol}:</Label>
											</dt>
											<dd className="col-sm-9">{erc20Balance.balance}</dd>
										</>
									)}

									<div className="d-flex mt-2">
										{selectedRouter && wethApprovalState === ApprovalState.NOT_APPROVED && (
											<div className="ms-2">
												{isWETHApproving ? (
													<>
														<Spinner isSmall inButton isGrow />
														Approving WETH...
													</>
												) : (
													<a href={'#!'} onClick={approveWETH}>
														[Approve WETH]
													</a>
												)}
											</div>
										)}

										{selectedRouter && erc20ApprovalState === ApprovalState.NOT_APPROVED && (
											<div className="ms-2">
												{isErc20Approving ? (
													<>
														<Spinner isSmall inButton isGrow />
														Approving {selectedContract.symbol}...
													</>
												) : (
													<a href={'#!'} onClick={approve}>
														[Approve {selectedContract.symbol}]
													</a>
												)}
											</div>
										)}
									</div>
								</>
							)}

							{isFetchingBalances && (
								<div className="row">
									<div className="col-sm-1">
										<Spinner size="10" isSmall isGrow color={'primary'} />
									</div>
									<div className="col-sm-11">Fetching balances...</div>
								</div>
							)}
						</dl>
					</CardBody>
				</Card>

				{selectedContract && (
					<>
						<Card>
							<CardHeader>
								<CardLabel icon="Settings" iconColor="warning">
									<CardTitle>Swap settings</CardTitle>
								</CardLabel>
								<CardActions>
									<Button
										isDisable={formik.isSubmitting}
										color="primary"
										isLight
										icon="Save"
										onClick={formik.handleSubmit}
									>
										{formik.isSubmitting && <Spinner isSmall inButton isGrow />}
										Save
									</Button>
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className="row g-4 align-items-center">
									<div className="col-12">
										<FormGroup id="gasPrice" label="Gas price" onChange={formik.handleChange}>
											<Input
												type="text"
												value={formik.values.gasPrice}
												isTouched={formik.touched.gasPrice}
												invalidFeedback={formik.errors.gasPrice}
												isValid={formik.isValid}
											/>
										</FormGroup>
									</div>

									<div className="col-12">
										<FormGroup id="gasLimit" label="Gas Limit" onChange={formik.handleChange}>
											<Input
												type="number"
												value={formik.values.gasLimit}
												isTouched={formik.touched.gasLimit}
												invalidFeedback={formik.errors.gasLimit}
												isValid={formik.isValid}
											/>
										</FormGroup>
									</div>

									<div className="col-12">
										<FormGroup id="slippage" label="Slippage (%)" onChange={formik.handleChange}>
											<Input
												type="number"
												value={formik.values.slippage}
												isTouched={formik.touched.slippage}
												invalidFeedback={formik.errors.slippage}
												isValid={formik.isValid}
											/>
										</FormGroup>
									</div>
								</div>
							</CardBody>
						</Card>
					</>
				)}
			</div>
		</>
	);
};

export default ContractSelectionContainer;
