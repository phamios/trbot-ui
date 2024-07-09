import Button from '@/components/bootstrap/Button';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import Select from '@/components/bootstrap/forms/Select';
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '@/components/bootstrap/Offcanvas';
import Spinner from '@/components/bootstrap/Spinner';
import Toasts from '@/components/bootstrap/Toasts';
import useChainOptions from '@/hooks/select-options/useChainOptions';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import ServiceAPI from '@/services/service-api';
import { TAddTradingContract, TTradingContract, TUpdateTradingContract } from '@/type/data/trading-contracts.type';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import { isEmpty, isNil, omitBy } from 'lodash';
import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';

const validate = () => {
	return yup.object().shape({
		name: yup.string().max(50).required(),
		symbol: yup.string().max(10).required(),
		address: yup
			.string()
			.test('isEthereumAddress', (value: any) => {
				return ethers.utils.isAddress(value);
			})
			.required(),
		decimals: yup.number().positive().required(),
		chainId: yup.string().max(10).required(),
	});
};

interface FormikValues {
	name?: string;
	symbol?: string;
	address?: string;
	decimals?: number;
	chainId?: string;
}

interface EditTradingContractOffCanvasProps {
	contract?: TTradingContract | null;
	mode: 'add' | 'edit';
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	onSuccess?: () => void;
}

const EditTradingContractOffCanvas: React.FC<EditTradingContractOffCanvasProps> = ({
	contract,
	mode,
	isOpen,
	setOpen,
	onSuccess,
}) => {
	const { addToast } = useToasts();
	const chainOptions = useChainOptions();

	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const formik = useFormik<FormikValues>({
		initialValues: !contract
			? {}
			: {
					name: contract.name,
					address: contract.address,
					symbol: contract.symbol,
					decimals: contract.decimals,
					chainId: contract.chainId,
			  },
		validationSchema: validate(),
		onSubmit: async (values) => {
			try {
				setIsProcessing(true);
				const { name, address, symbol, decimals, chainId } = values;

				if (mode === 'edit' && !isNil(contract)) {
					const dto: TUpdateTradingContract = omitBy(
						{
							name: name as string,
							address: address as string,
							symbol: symbol as string,
							chainId: chainId,
							decimals: Number(decimals),
						},
						isNil,
					) as TUpdateTradingContract;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.updateTradingContract(contract.id, dto);
						if (!success) {
							throw new Error(`Failed to update contract ${contract.name}`);
						}
					}
				} else {
					// add new
					const dto: TAddTradingContract = omitBy(
						{
							name: name as string,
							address: address as string,
							symbol: symbol as string,
							chainId: chainId as string,
							decimals: Number(decimals),
						},
						isNil,
					) as TAddTradingContract;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.createTradingContract(dto);
						if (!success) {
							throw new Error(`Failed to add new contract ${name}`);
						}
					}
				}

				if (typeof onSuccess === 'function') {
					onSuccess();
				}
			} catch (e: any) {
				addToast(
					<Toasts title="Error" icon="Error" iconColor="danger" isDismiss>
						{e.message}
					</Toasts>,
					{
						autoDismiss: true,
					},
				);
			}
			setIsProcessing(false);
		},
	});

	const deleteTradingContract = useOnEventCallback(async () => {
		try {
			if (contract?.id) {
				setIsProcessing(true);
				const success = await ServiceAPI.deleteTradingContract(contract.id);

				if (!success) {
					throw new Error(`Failed to delete contract ${contract.name}`);
				}

				if (typeof onSuccess === 'function') {
					onSuccess();
				}
			}
		} catch (e: any) {
			addToast(
				<Toasts title="Error" icon="Error" iconColor="danger" isDismiss>
					{e.message}
				</Toasts>,
				{
					autoDismiss: true,
				},
			);
		}
		setIsProcessing(false);
	});

	return (
		<OffCanvas setOpen={setOpen} isOpen={isOpen} titleId="edit-contract" isBodyScroll placement="end">
			<OffCanvasHeader setOpen={setOpen}>
				<OffCanvasTitle id="edit-contract-title">Edit contract</OffCanvasTitle>
			</OffCanvasHeader>

			<OffCanvasBody>
				<div className="row g-4">
					<div className="col-12">
						<FormGroup id="name" label="Name">
							<Input
								onChange={formik.handleChange}
								value={formik.values.name}
								isTouched={formik.touched.name}
								invalidFeedback={formik.errors.name}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="symbol" label="Symbol">
							<Input
								onChange={formik.handleChange}
								value={formik.values.symbol}
								isTouched={formik.touched.symbol}
								invalidFeedback={formik.errors.symbol}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="decimals" label="Decimals">
							<Input
								onChange={formik.handleChange}
								value={formik.values.decimals}
								isTouched={formik.touched.decimals}
								invalidFeedback={formik.errors.decimals}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="address" label="Address">
							<Input
								onChange={formik.handleChange}
								value={formik.values.address}
								isTouched={formik.touched.address}
								invalidFeedback={formik.errors.address}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="chainId" label="Chain" isFloating>
							<Select
								ariaLabel="Chain"
								placeholder="Select chain..."
								list={chainOptions}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={String(formik.values.chainId)}
								isValid={formik.isValid}
								isTouched={formik.touched.chainId}
								invalidFeedback={formik.errors.chainId}
							/>
						</FormGroup>
					</div>
				</div>
			</OffCanvasBody>

			<div className="row m-0">
				<div className="col-6 p-3">
					<Button isDisable={isProcessing} color="info" className="w-100" onClick={formik.handleSubmit}>
						{isProcessing && <Spinner isSmall inButton isGrow />}
						Save
					</Button>
				</div>
				<div className="col-6 p-3">
					<Button isDisable={isProcessing} color="danger" className="w-100" onClick={deleteTradingContract}>
						{isProcessing && <Spinner isSmall inButton isGrow />}
						Delete
					</Button>
				</div>
			</div>
		</OffCanvas>
	);
};

export default EditTradingContractOffCanvas;
