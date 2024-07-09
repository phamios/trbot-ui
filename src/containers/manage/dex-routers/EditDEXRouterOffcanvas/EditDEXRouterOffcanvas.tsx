import Button from '@/components/bootstrap/Button';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import Select from '@/components/bootstrap/forms/Select';
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '@/components/bootstrap/Offcanvas';
import Spinner from '@/components/bootstrap/Spinner';
import Toasts from '@/components/bootstrap/Toasts';
import useChainOptions from '@/hooks/select-options/useChainOptions';
import useDexOptions from '@/hooks/select-options/useDexOptions';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import ServiceAPI from '@/services/service-api';
import {
	DEXRouterProtocolVersion,
	DEXRouterProtocolVersionOptions,
	DEXRouterType,
	DEXRouterTypeOptions,
	TAddDEXRouter,
	TDEXRouter,
	TUpdateDEXRouter,
} from '@/type/data/dex-routers.type';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import { isEmpty, isNil, omitBy } from 'lodash';
import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';

const validate = () => {
	return yup.object().shape({
		name: yup.string().max(50).required(),
		address: yup
			.string()
			.test('isEthereumAddress', (value: any) => {
				return ethers.utils.isAddress(value);
			})
			.required(),
		protocolVersion: yup.string().required(),
		type: yup.string().required(),
		chainId: yup.string().required(),
		dexId: yup.string().required(),
	});
};

interface FormikValues {
	name?: string;
	address?: string;
	protocolVersion?: DEXRouterProtocolVersion;
	type?: DEXRouterType;
	chainId?: string;
	dexId?: number;
}

interface EditDEXRouterOffCanvasProps {
	router?: TDEXRouter | null;
	mode: 'add' | 'edit';
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	onSuccess?: () => void;
}

const EditDEXRouterOffCanvas: React.FC<EditDEXRouterOffCanvasProps> = ({
	router,
	mode,
	isOpen,
	setOpen,
	onSuccess,
}) => {
	const { addToast } = useToasts();
	const chainOptions = useChainOptions();
	const dexOptions = useDexOptions();

	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const formik = useFormik<FormikValues>({
		initialValues: !router
			? {}
			: {
					name: router.name,
					address: router.address,
					protocolVersion: router.protocolVersion as DEXRouterProtocolVersion,
					type: router.type as DEXRouterType,
					chainId: router.chain.chainId,
					dexId: router.dex.id,
			  },
		validationSchema: validate(),
		onSubmit: async (values) => {
			try {
				setIsProcessing(true);
				const { name, address, protocolVersion, type, chainId, dexId } = values;

				if (mode === 'edit' && !isNil(router)) {
					const dto: TUpdateDEXRouter = omitBy(
						{
							name: name as string,
							address: address as string,
							protocolVersion: protocolVersion as string,
							type: type as string,
							chainId: chainId as string,
							dexId: Number(dexId),
						},
						isNil,
					) as TUpdateDEXRouter;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.updateDexRouter(router.id, dto);
						if (!success) {
							throw new Error(`Failed to update router ${router.name}`);
						}
					}
				} else {
					// add new
					const dto: TAddDEXRouter = omitBy(
						{
							name: name as string,
							address: address as string,
							protocolVersion: protocolVersion as string,
							type: type as string,
							chainId: chainId as string,
							dexId: Number(dexId),
						},
						isNil,
					) as TAddDEXRouter;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.createDexRouter(dto);
						if (!success) {
							throw new Error(`Failed to add new router ${name as string}`);
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

	const deleteDEXRouter = useOnEventCallback(async () => {
		try {
			if (router?.id) {
				setIsProcessing(true);
				const success = await ServiceAPI.deleteDexRouter(router.id);

				if (!success) {
					throw new Error(`Failed to delete router ${router.name}`);
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
		<OffCanvas setOpen={setOpen} isOpen={isOpen} titleId="edit-router" isBodyScroll placement="end">
			<OffCanvasHeader setOpen={setOpen}>
				<OffCanvasTitle id="edit-router-title">Edit router</OffCanvasTitle>
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
						<FormGroup id="protocolVersion" label="Protocol version" isFloating>
							<Select
								ariaLabel="ProtocolVersion"
								placeholder="Select version..."
								list={DEXRouterProtocolVersionOptions}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.protocolVersion}
								isValid={formik.isValid}
								isTouched={formik.touched.protocolVersion}
								invalidFeedback={formik.errors.protocolVersion}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="type" label="Type" isFloating>
							<Select
								ariaLabel="Type"
								placeholder="Select type..."
								list={DEXRouterTypeOptions}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.type}
								isValid={formik.isValid}
								isTouched={formik.touched.type}
								invalidFeedback={formik.errors.type}
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
								value={formik.values.chainId}
								isValid={formik.isValid}
								isTouched={formik.touched.chainId}
								invalidFeedback={formik.errors.chainId}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="dexId" label="DEX" isFloating>
							<Select
								ariaLabel="DEX"
								placeholder="Select DEX..."
								list={dexOptions}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={String(formik.values.dexId)}
								isValid={formik.isValid}
								isTouched={formik.touched.dexId}
								invalidFeedback={formik.errors.dexId}
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
					<Button isDisable={isProcessing} color="danger" className="w-100" onClick={deleteDEXRouter}>
						{isProcessing && <Spinner isSmall inButton isGrow />}
						Delete
					</Button>
				</div>
			</div>
		</OffCanvas>
	);
};

export default EditDEXRouterOffCanvas;
